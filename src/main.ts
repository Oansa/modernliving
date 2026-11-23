import { FrameSequenceTour } from './frame-sequence';

// Initialize the full-viewport, scroll-driven sequence
const tour = new FrameSequenceTour();

// Cleanup on page unload or hot module replacement
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    tour.destroy();
  });
}
