import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PropertyCard, PropertyData } from '../PropertyCard';

const PROPERTIES: PropertyData[] = [
  {
    id: 'prop-1',
    name: 'Villa Curva',
    location: 'Geneva, Switzerland',
    specs: '4 Beds · 5.5 Baths · 6,400 sq ft',
    price: '$14,200,000',
    image: '/properties/prop-1.webp',
    status: 'Private Treaty',
  },
  {
    id: 'prop-2',
    name: 'The Glasshouse Pavilion',
    location: 'Kyoto Highlands, Japan',
    specs: '3 Beds · 4 Baths · 5,100 sq ft',
    price: '$11,800,000',
    image: '/properties/prop-2.webp',
    status: 'Available',
  },
  {
    id: 'prop-3',
    name: 'Solarium Ridge',
    location: 'Aspen, Colorado',
    specs: '5 Beds · 6 Baths · 7,800 sq ft',
    price: '$18,900,000',
    image: '/properties/prop-3.webp',
    status: 'New Release',
  },
  {
    id: 'prop-4',
    name: 'Aura Sanctum',
    location: 'Lake Como, Italy',
    specs: '4 Beds · 5 Baths · 5,900 sq ft',
    price: '$16,500,000',
    image: '/properties/prop-4.webp',
    status: 'Exclusive',
  },
  {
    id: 'prop-5',
    name: 'Nordic Monolith',
    location: 'Reykjavik Coast, Iceland',
    specs: '3 Beds · 3.5 Baths · 4,800 sq ft',
    price: '$9,750,000',
    image: '/properties/prop-5.webp',
    status: 'Reserved',
  },
];

export const Frame3Residences: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth + 60);
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const pinDistance = isDesktop ? '+=240%' : '+=150%';

          gsap.to(track, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: pinDistance,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="frame-residences"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-[#2B2B2D] text-white flex flex-col justify-center overflow-hidden z-10 py-10"
    >
      <div className="w-full px-6 sm:px-10 md:px-16 mb-8 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 max-w-7xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E8803A]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
              02 / PORTFOLIO
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
            Featured Residences
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm font-light">
          Sculptural masterpieces created in bespoke collaboration with international architectural icons.
        </p>
      </div>

      {/* Horizontal Translating Track */}
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 sm:gap-8 px-6 sm:px-10 md:px-16 w-max will-change-transform"
        >
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};
