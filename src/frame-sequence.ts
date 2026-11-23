import { TOUR_CONFIG, SequenceConfig, getFrameUrl } from './config';

type FrameBitmap = ImageBitmap | HTMLImageElement;

export class FrameSequenceTour {
  private config: SequenceConfig;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private spacer: HTMLDivElement;
  private loaderOverlay: HTMLDivElement | null = null;

  // Frame storage and loading state
  private frames: (FrameBitmap | null)[] = [];
  private loadingStatus: ('idle' | 'loading' | 'loaded' | 'error')[] = [];
  private activeLoads = 0;
  private abortController = new AbortController();

  // Scroll & animation state
  private targetFrame = 0;
  private displayedFrame = 0;
  private lastDrawnFrame = -1;
  private rafId: number | null = null;
  private isDestroyed = false;
  private prefersReducedMotion = false;
  private motionQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(customConfig: Partial<SequenceConfig> = {}) {
    this.config = { ...TOUR_CONFIG, ...customConfig };
    this.frames = new Array(this.config.frameCount).fill(null);
    this.loadingStatus = new Array(this.config.frameCount).fill('idle');

    // Set body background to neutral dark color matching frame 1 immediately
    document.body.style.backgroundColor = this.config.backgroundColor;
    document.documentElement.style.backgroundColor = this.config.backgroundColor;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';

    // Prevent overscroll bounce revealing white on mobile browsers
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    // 1. Create fixed full-viewport canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100dvh';
    this.canvas.style.display = 'block';
    this.canvas.style.zIndex = '0';
    this.canvas.style.pointerEvents = 'none';

    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas 2D context is not supported');
    }
    this.ctx = ctx;
    document.body.appendChild(this.canvas);

    // 2. Create invisible scroll spacer
    this.spacer = document.createElement('div');
    this.spacer.style.width = '100%';
    this.spacer.style.height = this.config.spacerHeight;
    this.spacer.style.pointerEvents = 'none';
    this.spacer.style.visibility = 'hidden';
    this.spacer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.spacer);

    // 3. Create minimal solid-colour loading overlay (no text, no spinner)
    this.createMinimalLoader();

    // 4. Set up reduced motion media query
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = motionQuery.matches;
    this.motionQueryListener = (e: MediaQueryListEvent) => {
      this.prefersReducedMotion = e.matches;
    };
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', this.motionQueryListener);
    }

    // 5. Setup event listeners
    this.bindEvents();

    // 6. Initial sizing
    this.resizeCanvas();

    // 7. Initial scroll position sync
    this.syncScrollTarget();
    this.displayedFrame = this.targetFrame;

    // 8. Start loading sequence: first frame immediately
    this.initSequence();
  }

  /**
   * Minimal plain solid-color screen that fades out once initial frame is ready.
   * Absolutely NO text or copy per strict scope requirements.
   */
  private createMinimalLoader(): void {
    this.loaderOverlay = document.createElement('div');
    this.loaderOverlay.style.position = 'fixed';
    this.loaderOverlay.style.inset = '0';
    this.loaderOverlay.style.width = '100vw';
    this.loaderOverlay.style.height = '100dvh';
    this.loaderOverlay.style.backgroundColor = this.config.backgroundColor;
    this.loaderOverlay.style.zIndex = '10';
    this.loaderOverlay.style.pointerEvents = 'none';
    this.loaderOverlay.style.transition = 'opacity 0.35s ease-out';
    this.loaderOverlay.style.opacity = '1';
    document.body.appendChild(this.loaderOverlay);
  }

  private dismissMinimalLoader(): void {
    if (!this.loaderOverlay) return;
    const overlay = this.loaderOverlay;
    this.loaderOverlay = null;
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
    }, 400);
  }

  private bindEvents(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
  }

  private handleScroll = (): void => {
    if (this.isDestroyed) return;
    this.syncScrollTarget();
    this.startRenderLoop();
    this.pumpQueue();
  };

  private handleResize = (): void => {
    if (this.isDestroyed) return;
    this.resizeCanvas();
    this.syncScrollTarget();
    this.drawCurrent();
  };

  private resizeCanvas(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, this.config.maxDpr);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const bufferWidth = Math.floor(viewportWidth * dpr);
    const bufferHeight = Math.floor(viewportHeight * dpr);

    if (this.canvas.width !== bufferWidth || this.canvas.height !== bufferHeight) {
      this.canvas.width = bufferWidth;
      this.canvas.height = bufferHeight;

      // Resizing buffer resets context properties
      this.ctx.imageSmoothingEnabled = this.config.imageSmoothingEnabled;
      this.ctx.imageSmoothingQuality = this.config.imageSmoothingQuality;
    }
  }

  private syncScrollTarget(): void {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      this.targetFrame = 0;
      return;
    }
    const scrollY = Math.max(0, Math.min(window.scrollY || window.pageYOffset || 0, maxScroll));
    const progress = scrollY / maxScroll;

    // Linear mapping from 0 to frameCount - 1
    // At scroll 0: frame 0. At scroll 100%: last frame.
    this.targetFrame = progress * (this.config.frameCount - 1);
  }

  private startRenderLoop(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.renderTick);
  }

  private renderTick = (): void => {
    if (this.isDestroyed) {
      this.rafId = null;
      return;
    }

    if (this.prefersReducedMotion) {
      this.displayedFrame = this.targetFrame;
    } else {
      // Smooth motion: lerp toward target frame
      const delta = this.targetFrame - this.displayedFrame;
      if (Math.abs(delta) < 0.001) {
        this.displayedFrame = this.targetFrame;
      } else {
        this.displayedFrame += delta * this.config.easing;
      }
    }

    const roundedFrame = Math.round(this.displayedFrame);
    if (roundedFrame !== this.lastDrawnFrame) {
      this.drawFrame(roundedFrame);
      this.lastDrawnFrame = roundedFrame;
    }

    // Continue loop until displayedFrame reaches targetFrame
    if (this.displayedFrame !== this.targetFrame) {
      this.rafId = requestAnimationFrame(this.renderTick);
    } else {
      this.rafId = null;
    }
  };

  /**
   * Draws a specific frame onto the canvas using "cover" scaling.
   * If the exact frame is not yet loaded, draws the nearest available loaded frame.
   */
  private drawFrame(index: number): void {
    const frame = this.getNearestLoadedFrame(index);
    if (!frame) return;

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    const imgWidth = 'naturalWidth' in frame ? frame.naturalWidth : frame.width;
    const imgHeight = 'naturalHeight' in frame ? frame.naturalHeight : frame.height;
    if (imgWidth === 0 || imgHeight === 0) return;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let sWidth = imgWidth;
    let sHeight = imgHeight;
    let sX = 0;
    let sY = 0;

    const focalX = this.config.focalPoint.x;
    const focalY = this.config.focalPoint.y;

    if (canvasRatio > imgRatio) {
      // Viewport is wider than image: crop top and bottom
      sHeight = imgWidth / canvasRatio;
      sY = (imgHeight - sHeight) * focalY;
    } else {
      // Viewport is taller than image (mobile portrait): crop left and right
      sWidth = imgHeight * canvasRatio;
      sX = (imgWidth - sWidth) * focalX;
    }

    this.ctx.drawImage(
      frame,
      sX,
      sY,
      sWidth,
      sHeight,
      0,
      0,
      canvasWidth,
      canvasHeight
    );
  }

  private drawCurrent(): void {
    const target = Math.round(this.displayedFrame);
    this.drawFrame(target);
    this.lastDrawnFrame = target;
  }

  /**
   * Returns the nearest loaded frame to the target index.
   * Never shows a blank canvas when scrolling through unloaded regions.
   */
  private getNearestLoadedFrame(targetIndex: number): FrameBitmap | null {
    if (this.frames[targetIndex]) {
      return this.frames[targetIndex];
    }

    // Search outward symmetrically from the target index
    const total = this.config.frameCount;
    for (let offset = 1; offset < total; offset++) {
      const lower = targetIndex - offset;
      if (lower >= 0 && this.frames[lower]) {
        return this.frames[lower];
      }
      const upper = targetIndex + offset;
      if (upper < total && this.frames[upper]) {
        return this.frames[upper];
      }
    }
    return null;
  }

  /**
   * Initializes sequence loading:
   * 1. Loads frame 0 immediately and draws it.
   * 2. Also kicks off loading the last frame (loop anchor) and starts background preloading.
   */
  private async initSequence(): Promise<void> {
    try {
      // Load initial frame 0 immediately
      await this.loadSingleFrame(0);
      this.drawCurrent();
      this.dismissMinimalLoader();
    } catch (err) {
      console.error('Failed to load initial frame:', err);
    }

    // Begin background preloading in priority order
    this.pumpQueue();
  }

  /**
   * Loads a single frame by index using off-thread decoding via createImageBitmap or Image.decode.
   */
  private async loadSingleFrame(index: number): Promise<FrameBitmap | null> {
    if (index < 0 || index >= this.config.frameCount) return null;
    if (this.frames[index]) return this.frames[index];
    if (this.loadingStatus[index] === 'loading') return null;

    this.loadingStatus[index] = 'loading';
    this.activeLoads++;

    const url = getFrameUrl(index, this.config);

    try {
      let bitmap: FrameBitmap;
      if ('createImageBitmap' in window) {
        const response = await fetch(url, { signal: this.abortController.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status} loading ${url}`);
        const blob = await response.blob();
        bitmap = await createImageBitmap(blob);
      } else {
        const img = new Image();
        img.src = url;
        await img.decode();
        bitmap = img;
      }

      if (this.isDestroyed) {
        if ('close' in bitmap) {
          bitmap.close();
        }
        return null;
      }

      this.frames[index] = bitmap;
      this.loadingStatus[index] = 'loaded';

      // If currently displaying this frame or if this loaded frame is closer than what's drawn, redraw
      const currentTarget = Math.round(this.displayedFrame);
      if (currentTarget === index || this.lastDrawnFrame === -1) {
        this.drawFrame(currentTarget);
        this.lastDrawnFrame = currentTarget;
      }

      return bitmap;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return null;
      console.warn(`Error loading frame ${index}:`, err);
      this.loadingStatus[index] = 'error';
      return null;
    } finally {
      this.activeLoads--;
      if (!this.isDestroyed) {
        this.pumpQueue();
      }
    }
  }

  /**
   * Background queue manager:
   * Prioritizes idle frames closest to current targetFrame.
   * Throttles active concurrent requests to maxConcurrentLoads.
   */
  private pumpQueue(): void {
    if (this.isDestroyed) return;
    if (this.activeLoads >= this.config.maxConcurrentLoads) return;

    const currentFocus = Math.round(this.displayedFrame);

    // Find all idle frames sorted by distance to current focus
    const candidates: { index: number; dist: number }[] = [];
    for (let i = 0; i < this.config.frameCount; i++) {
      if (this.loadingStatus[i] === 'idle') {
        candidates.push({ index: i, dist: Math.abs(i - currentFocus) });
      }
    }

    if (candidates.length === 0) return;

    candidates.sort((a, b) => a.dist - b.dist);

    while (this.activeLoads < this.config.maxConcurrentLoads && candidates.length > 0) {
      const next = candidates.shift()!;
      this.loadSingleFrame(next.index);
    }
  }

  /**
   * Clean up all memory, ImageBitmaps, and event listeners on unmount.
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.abortController.abort();

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);

    if (this.motionQueryListener) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', this.motionQueryListener);
      }
    }

    // Release ImageBitmap resources
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      if (frame && 'close' in frame) {
        frame.close();
      }
      this.frames[i] = null;
    }

    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }

    if (this.spacer.parentElement) {
      this.spacer.parentElement.removeChild(this.spacer);
    }

    if (this.loaderOverlay && this.loaderOverlay.parentElement) {
      this.loaderOverlay.parentElement.removeChild(this.loaderOverlay);
    }
  }
}
