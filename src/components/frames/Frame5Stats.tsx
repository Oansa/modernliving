import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StatItem {
  id: string;
  label: string;
  badge: string;
  targetNumber: number;
  suffix: string;
  subtext: string;
}

const STATS: StatItem[] = [
  {
    id: 'stat-1',
    label: 'Smart Flow',
    badge: 'Delivered',
    targetNumber: 240,
    suffix: '+',
    subtext: 'Bespoke residences delivered globally',
  },
  {
    id: 'stat-2',
    label: 'Smart Flow',
    badge: 'Net Zero',
    targetNumber: 85,
    suffix: '%',
    subtext: 'Average reduction in carbon operational load',
  },
  {
    id: 'stat-3',
    label: 'Smart Flow',
    badge: 'Verified',
    targetNumber: 98,
    suffix: '%',
    subtext: 'Client lifetime satisfaction rating',
  },
  {
    id: 'stat-4',
    label: 'Smart Flow',
    badge: 'Global',
    targetNumber: 12,
    suffix: '',
    subtext: 'Metropolitan cultural capitals served',
  },
];

export const Frame5Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current || !cardsRef.current) return;

      const cardElements = cardsRef.current.querySelectorAll('.stat-card-item');
      if (!cardElements || cardElements.length === 0) return;

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

          // 1. Cards rise in staggered
          tl.fromTo(
            cardElements,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power2.out',
            },
            0
          );

          // 2. Numbers count up scrubbed with scroll
          STATS.forEach((stat, idx) => {
            const counterObj = { val: 0 };
            const el = countRefs.current[idx];

            tl.to(
              counterObj,
              {
                val: stat.targetNumber,
                duration: 0.9,
                ease: 'power1.out',
                onUpdate: () => {
                  if (el) {
                    el.textContent = Math.round(counterObj.val).toString();
                  }
                },
              },
              0.1 + idx * 0.1
            );
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="frame-impact"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-[#2B2B2D] text-white flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 z-10"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E8803A]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
              04 / PROVEN IMPACT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
            Engineered Excellence
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Every metric reflects our obsession with precision, structural integrity, and living peace.
          </p>
        </div>

        {/* 4 White Rounded Smart Flow Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className="stat-card-item bg-white text-zinc-900 rounded-[24px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                    {stat.label}
                  </span>
                  <span className="bg-[#E8803A] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                    {stat.badge}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 mb-3 flex items-baseline">
                  <span
                    ref={(el) => {
                      countRefs.current[idx] = el;
                    }}
                  >
                    {stat.targetNumber}
                  </span>
                  <span>{stat.suffix}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 font-normal leading-relaxed border-t border-zinc-100 pt-3">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
