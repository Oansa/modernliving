import React, { useEffect } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { FrameCounter } from './components/FrameCounter';
import { FloatingNav } from './components/FloatingNav';
import { Frame1Hero } from './components/frames/Frame1Hero';
import { Frame2Philosophy } from './components/frames/Frame2Philosophy';
import { Frame3Residences } from './components/frames/Frame3Residences';
import { Frame4Living } from './components/frames/Frame4Living';
import { Frame5Stats } from './components/frames/Frame5Stats';
import { Frame6Footer } from './components/frames/Frame6Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const App: React.FC = () => {
  useEffect(() => {
    // Refresh ScrollTrigger after DOM has mounted and images/fonts have settled
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SmoothScroll>
      {/* Fixed UI Overlays */}
      <FloatingNav />
      <FrameCounter totalFrames={6} />

      {/* Main Document Flow (Stacked Frames) */}
      <main className="w-full bg-[#2B2B2D] text-white selection:bg-[#E8803A] selection:text-white">
        <Frame1Hero />
        <Frame2Philosophy />
        <Frame3Residences />
        <Frame4Living />
        <Frame5Stats />
        <Frame6Footer />
      </main>
    </SmoothScroll>
  );
};

export default App;
