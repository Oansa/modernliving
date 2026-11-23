import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Nav } from '../Nav';
import { GlassPanel } from '../GlassPanel';
import { StatCard } from '../StatCard';

export const Frame1Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const headlineGroupRef = useRef<HTMLDivElement>(null);
  const glassPanelRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const statsGroupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current) return;

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

          // 1. Headline, subtext, search button drift up and fade out
          tl.to(
            headlineGroupRef.current,
            {
              y: -60,
              opacity: 0,
              duration: 0.6,
              ease: 'power1.inOut',
            },
            0
          );

          // 2. Left glass panel slides left and fades out
          tl.to(
            glassPanelRef.current,
            {
              x: -90,
              opacity: 0,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            0
          );

          // 3. Bottom left narrative and bottom right stats slide down and fade
          tl.to(
            [narrativeRef.current, statsGroupRef.current],
            {
              y: 60,
              opacity: 0,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            0
          );

          // 4. Background house image scales from 1 to 1.2 with subtle vertical parallax
          tl.to(
            bgImageRef.current,
            {
              scale: 1.22,
              y: 35,
              duration: 1,
              ease: 'none',
            },
            0
          );

          // 5. Hero card's padding and radius shrink to 0 to expand full-bleed
          tl.to(
            containerRef.current,
            {
              padding: 0,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0.2
          );

          tl.to(
            cardRef.current,
            {
              borderRadius: 0,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0.2
          );

          // 6. Dark overlay fades in at the end to hand off smoothly to Frame 2
          tl.to(
            darkOverlayRef.current,
            {
              opacity: 0.95,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            0.6
          );
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="frame-hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-[#2B2B2D] flex flex-col justify-center items-center z-10"
    >
      {/* Outer Padding Container (shrinks on scroll to expand full-bleed) */}
      <div
        ref={containerRef}
        className="w-full h-[100svh] p-2 sm:p-3 md:p-4 box-border flex flex-col justify-center items-center transition-[padding] duration-75"
      >
        {/* Main Rounded Hero Card */}
        <div
          ref={cardRef}
          className="relative w-full h-full rounded-[24px] sm:rounded-[28px] md:rounded-[34px] overflow-hidden bg-black shadow-2xl border border-white/[0.08]"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              ref={bgImageRef}
              src="/hero.jpg"
              alt="Futuristic curvilinear white house in pine forest at dusk"
              className="w-full h-full object-cover object-[center_60%] filter grayscale-[35%] contrast-105 will-change-transform"
            />
            {/* Subtle dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
            {/* Transition Dark Overlay (fades in on scroll to hand off to Frame 2) */}
            <div
              ref={darkOverlayRef}
              className="absolute inset-0 bg-[#2B2B2D] opacity-0 pointer-events-none"
            />
          </div>

          {/* Top Header & Navigation */}
          <div className="relative z-20 w-full p-4 sm:p-6 md:p-8">
            <Nav />
          </div>

          {/* Hero Content Area */}
          <div className="relative z-10 w-full h-[calc(100%-80px)] px-5 sm:px-8 md:px-12 flex flex-col justify-between pb-6 sm:pb-8 md:pb-10">
            {/* Upper Left Headline Group */}
            <div ref={headlineGroupRef} className="max-w-xl pt-2 sm:pt-6 md:pt-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-light tracking-[-0.03em] text-white leading-[1.05]">
                Find Your
                <br />
                Perfect Home
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-normal mt-4 max-w-md leading-relaxed tracking-tight">
                Discover handpicked properties that match your lifestyle, budget, and dreams.
              </p>

              <div className="mt-6 sm:mt-7">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 bg-[#1A1A1C]/90 hover:bg-black text-white px-7 py-3 rounded-full text-xs sm:text-sm font-medium border border-white/20 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:border-white/35 cursor-pointer group"
                >
                  <span>Search</span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Middle Left: Frosted Glass Panel Card */}
            <div
              ref={glassPanelRef}
              className="absolute left-6 sm:left-10 md:left-12 top-1/2 -translate-y-1/4 hidden lg:block z-20"
            >
              <GlassPanel />
            </div>

            {/* Bottom Row */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">
              {/* Bottom Left Narrative */}
              <div ref={narrativeRef} className="max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8803A] shadow-[0_0_8px_#E8803A]" />
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
                    Engineered Platform
                  </span>
                </div>
                <p className="text-xs sm:text-sm md:text-[15px] text-zinc-200 font-light leading-snug">
                  Step into the future with a platform engineered
                </p>
                <a
                  href="#frame-philosophy"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium mt-1.5 transition-colors group"
                >
                  <span>Learn more</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Bottom Right: Dual Stat Cards */}
              <div
                ref={statsGroupRef}
                className="flex items-center gap-3 sm:gap-4 self-end md:self-auto"
              >
                <StatCard label="Smart Flow" badge="+14%" value="85%" />
                <StatCard label="Smart Flow" badge="Active" value="85%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
