import React, { useEffect, useState } from 'react';

const NAV_ITEMS = [
  'Philosophy',
  'Residences',
  'Living',
  'Impact',
  'Inquire',
];

export const FloatingNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal floating nav after scrolling past initial hero (e.g. 500px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-400 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <nav
        className="glass-nav rounded-full px-3 py-2 flex items-center gap-1 sm:gap-2 shadow-2xl border border-white/15"
        aria-label="Floating Sticky Navigation"
      >
        {/* Brand Logo Monogram */}
        <a
          href="#frame-hero"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors mr-1 sm:mr-2"
          aria-label="Back to Top"
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </a>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#frame-${item.toLowerCase()}`}
              className="text-xs text-zinc-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full transition-colors font-normal hover:bg-white/10"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Orange Accent Action Button */}
        <a
          href="#frame-inquire"
          className="ml-1 sm:ml-2 bg-[#E8803A] hover:brightness-110 text-white text-xs font-medium px-3.5 sm:px-4 py-1.5 rounded-full shadow-sm transition-all"
        >
          Consult
        </a>
      </nav>
    </div>
  );
};
