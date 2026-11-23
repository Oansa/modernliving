import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface FeatureBlock {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const FEATURES: FeatureBlock[] = [
  {
    id: 'feat-1',
    title: 'Smart Home Automation',
    desc: 'Invisible neural sensors tune climate, circadian illumination, and acoustics automatically.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'feat-2',
    title: 'Sustainable Materials',
    desc: 'Low-embodied carbon timber, reclaimed stone masonry, and passive thermal mass.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
  {
    id: 'feat-3',
    title: 'Natural Light & Space',
    desc: 'Floor-to-ceiling structural glazing capturing uninterrupted panoramas and solar warmth.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'feat-4',
    title: 'Seamless Indoor-Outdoor',
    desc: 'Flush zero-threshold motorized portals effortlessly connect living suites to open horizons.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
];

export const Frame4Living: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current || !blocksRef.current) return;

      const items = blocksRef.current.querySelectorAll('.feature-block');
      if (!items || items.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const pinDistance = isDesktop ? '+=180%' : '+=120%';

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

          // Activate features one at a time with scroll progress
          items.forEach((item, index) => {
            const progressPoint = index / items.length;

            tl.to(
              item,
              {
                borderColor: '#E8803A',
                backgroundColor: 'rgba(232, 128, 58, 0.08)',
                color: '#FFFFFF',
                duration: 0.25,
                ease: 'power1.out',
              },
              progressPoint
            );

            // Highlight the icon and title in amber
            const iconBadge = item.querySelector('.icon-badge');
            if (iconBadge) {
              tl.to(
                iconBadge,
                {
                  backgroundColor: '#E8803A',
                  color: '#FFFFFF',
                  duration: 0.25,
                },
                progressPoint
              );
            }

            const title = item.querySelector('.feature-title');
            if (title) {
              tl.to(
                title,
                {
                  color: '#E8803A',
                  duration: 0.25,
                },
                progressPoint
              );
            }
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="frame-living"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-[#2B2B2D] text-white flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 z-10"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E8803A]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
              03 / MODERN LIVING
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
            Designed for Conscious Stillness
          </h2>
        </div>

        {/* 2-Column Layout: Visual with Glass Overlay + 4 Progressive Feature Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Large Rounded Image with single glass overlay card */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] md:h-[500px] rounded-[28px] overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
            <img
              src="/living.webp"
              alt="Sculptural residence interior at twilight"
              className="w-full h-full object-cover object-center filter grayscale contrast-[1.1]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Single Restrained Glass Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-[22px] p-5 sm:p-6 text-white max-w-lg shadow-xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E8803A] block mb-1">
                Aura Standard
              </span>
              <p className="text-sm sm:text-base text-zinc-200 font-light leading-snug">
                Every residence orchestrates pure natural light, silence, and automated intelligence
                to restore human rhythm.
              </p>
            </div>
          </div>

          {/* Right: 4 Feature Blocks Activating Sequentially */}
          <div ref={blocksRef} className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
            {FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="feature-block p-4 sm:p-5 rounded-[20px] bg-[#212123] border border-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3.5">
                  <div className="icon-badge w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0 transition-colors duration-300">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="feature-title text-base sm:text-lg font-normal text-white tracking-tight mb-1 transition-colors duration-300">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
