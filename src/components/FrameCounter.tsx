import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface FrameCounterProps {
  totalFrames?: number;
}

export const FrameCounter: React.FC<FrameCounterProps> = ({ totalFrames = 6 }) => {
  const [activeFrame, setActiveFrame] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setProgressPercent(progress * 100);

      // Determine which frame is active
      const frameIndex = Math.min(
        totalFrames,
        Math.max(1, Math.floor(progress * totalFrames) + 1)
      );
      setActiveFrame(frameIndex);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Also attach to ScrollTrigger update
    ScrollTrigger.addEventListener('refresh', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      ScrollTrigger.removeEventListener('refresh', onScroll);
    };
  }, [totalFrames]);

  const formattedActive = String(activeFrame).padStart(2, '0');
  const formattedTotal = String(totalFrames).padStart(2, '0');

  return (
    <aside
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-3 select-none"
      aria-label="Page scroll progress and frame indicator"
    >
      {/* Frame Counter Number */}
      <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-mono tracking-widest text-zinc-300 flex items-center gap-1 shadow-lg">
        <span className="text-[#E8803A] font-medium">{formattedActive}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">{formattedTotal}</span>
      </div>

      {/* Thin Vertical Progress Line */}
      <div className="relative w-[2px] h-28 sm:h-36 bg-white/10 rounded-full overflow-hidden">
        {/* Dynamic progress thumb */}
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#E8803A] to-white/70 rounded-full transition-all duration-100 ease-out"
          style={{ height: `${progressPercent}%` }}
        />
      </div>

      {/* Frame navigation dots */}
      <div className="hidden sm:flex flex-col gap-1.5 pt-1">
        {Array.from({ length: totalFrames }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              activeFrame === i + 1
                ? 'bg-[#E8803A] scale-125 shadow-[0_0_6px_#E8803A]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </aside>
  );
};
