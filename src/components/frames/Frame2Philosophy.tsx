import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Frame2Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsContainerRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current) return;

      const words = wordsContainerRef.current?.querySelectorAll('.word');
      if (!words || words.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const pinDistance = isDesktop ? '+=160%' : '+=110%';

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: pinDistance,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          // 1. Reveal headline word by word (scrubbed opacity & color)
          tl.to(
            words,
            {
              opacity: 1,
              color: '#FFFFFF',
              stagger: 0.15,
              duration: 0.8,
              ease: 'power2.out',
            },
            0
          );

          // 2. Short paragraph about light, space and landscape fades in
          tl.fromTo(
            paragraphRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            0.3
          );

          // 3. Rounded monochrome architecture image starts at ~40% and expands to 100% width
          tl.fromTo(
            imageContainerRef.current,
            {
              width: isDesktop ? '42%' : '75%',
              borderRadius: isDesktop ? '32px' : '20px',
              scale: 0.95,
            },
            {
              width: '100%',
              borderRadius: isDesktop ? '24px' : '16px',
              scale: 1,
              duration: 1,
              ease: 'power2.inOut',
            },
            0.2
          );
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="frame-philosophy"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-[#2B2B2D] text-white flex flex-col justify-center items-center px-6 sm:px-10 md:px-16 py-12 z-10"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Eyebrow Label */}
        <div className="flex items-center gap-2 mb-4 self-start">
          <span className="w-2 h-2 rounded-full bg-[#E8803A]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            01 / PHILOSOPHY
          </span>
        </div>

        {/* Word-by-Word Headline */}
        <h2
          ref={wordsContainerRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em] text-zinc-700 leading-[1.1] mb-6 self-start max-w-4xl"
        >
          <span className="word opacity-25 transition-opacity inline-block mr-3 sm:mr-4">
            Architecture
          </span>
          <span className="word opacity-25 transition-opacity inline-block mr-3 sm:mr-4">
            that
          </span>
          <span className="word opacity-25 transition-opacity inline-block text-white">
            breathes.
          </span>
        </h2>

        {/* Paragraph Narrative */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8 sm:mb-12">
          <div className="md:col-span-7">
            <p
              ref={paragraphRef}
              className="text-zinc-300 text-base sm:text-lg md:text-xl font-light leading-relaxed tracking-tight"
            >
              We believe a home is not merely a shelter, but an organic dialogue with the land.
              Expansive monolithic glass, tactile natural limestone, and kinetic sightlines capture
              shifting daylight at dusk. Spaces expand freely, balancing bold structural geometry with
              quiet, restorative sanctuary.
            </p>
          </div>
          <div className="md:col-span-5 flex md:justify-end">
            <div className="glass-panel rounded-2xl p-4 max-w-xs text-xs text-zinc-300 font-light leading-snug">
              <span className="text-[#E8803A] font-medium block mb-1">Living Harmony</span>
              Passive solar orientation and low-embodied carbon materials ensure zero ecological friction.
            </div>
          </div>
        </div>

        {/* Expanding Monochrome Visual Container */}
        <div className="w-full flex justify-center items-center">
          <div
            ref={imageContainerRef}
            className="h-[300px] sm:h-[400px] md:h-[460px] overflow-hidden bg-black/50 border border-white/10 shadow-2xl relative"
          >
            <img
              src="/philosophy.webp"
              alt="Monolithic modern architecture integrated with landscape"
              className="w-full h-full object-cover object-center filter grayscale contrast-[1.1]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-zinc-300">
              <span className="tracking-wide">SANCTUM RESIDENCE · NATURAL LIGHT STUDY</span>
              <span className="font-mono text-zinc-400">LAT. 46.2044° N</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
