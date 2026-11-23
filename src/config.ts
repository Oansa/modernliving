/**
 * Configuration for the scroll-driven image-sequence tour.
 * All tour tuning parameters (duration, smoothness, source folders, focal point) are configured here.
 */

export interface SequenceConfig {
  /** Total number of frames in the sequence (auto-detected: 113) */
  frameCount: number;

  /** Starting frame number (1-based index in filenames, e.g. frame_0001) */
  startFrameNumber: number;

  /** Base folder path containing the frames */
  folderPath: string;

  /** Prefix for frame filenames */
  fileNamePrefix: string;

  /** Number of digits for zero-padding in filename */
  fileNameDigits: number;

  /** Frame file extension (e.g. '.webp' or '.png') */
  fileNameExt: string;

  /**
   * Height of the invisible spacer element controlling the tour length.
   * Default: '800vh'. Larger values create a slower, longer, more granular tour.
   */
  spacerHeight: string;

  /**
   * Motion smoothing factor (lerp).
   * Range ~0.05 (very smooth/floaty) to ~0.2 (snappier). Default: 0.12.
   * Automatically disabled if user has prefers-reduced-motion set.
   */
  easing: number;

  /**
   * Focal point for cover-crop scaling (0 to 1).
   * x: 0.5 (center), 0 = left, 1 = right.
   * y: 0.5 (center), 0 = top, 1 = bottom.
   */
  focalPoint: {
    x: number;
    y: number;
  };

  /** Canvas 2D image smoothing */
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;

  /** Maximum device pixel ratio buffer cap */
  maxDpr: number;

  /** Max concurrent background prefetch network requests */
  maxConcurrentLoads: number;

  /** Background color matching first frame to prevent flashes */
  backgroundColor: string;
}

export const TOUR_CONFIG: SequenceConfig = {
  frameCount: 113,
  startFrameNumber: 1,

  // Use the optimized WebP frames (set folderPath: '/frames/' and fileNameExt: '.png' to point back to originals)
  folderPath: '/frames-web/',
  fileNamePrefix: 'frame_',
  fileNameDigits: 4,
  fileNameExt: '.webp',

  // Tour length: 800vh gives a graceful walking pace
  spacerHeight: '800vh',

  // Easing factor for momentum / smoothing
  easing: 0.12,

  // Default focal point: center
  focalPoint: {
    x: 0.5,
    y: 0.5,
  },

  imageSmoothingEnabled: true,
  imageSmoothingQuality: 'high',

  // Cap DPR at 2 for performance, can set to 1 for low-memory devices
  maxDpr: 2,

  // Concurrency limit for background preloading
  maxConcurrentLoads: 6,

  // Dark slate matching the initial outdoor frame
  backgroundColor: '#0d1117',
};

/**
 * Returns the URL for a 0-based frame index.
 */
export function getFrameUrl(index: number, config: SequenceConfig = TOUR_CONFIG): string {
  const fileNumber = config.startFrameNumber + index;
  const padded = String(fileNumber).padStart(config.fileNameDigits, '0');
  return `${config.folderPath}${config.fileNamePrefix}${padded}${config.fileNameExt}`;
}
