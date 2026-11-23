import React from 'react';

export const Frame6Footer: React.FC = () => {
  return (
    <section
      id="frame-inquire"
      className="relative w-full bg-[#212123] text-white pt-20 sm:pt-28 pb-12 sm:pb-16 px-6 sm:px-10 md:px-16 border-t border-white/10 z-10"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Brand Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#E8803A] shadow-[0_0_8px_#E8803A]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            PRIVATE COMMISSION & ACQUISITIONS
          </span>
        </div>

        {/* Large Lightweight Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em] text-white max-w-3xl leading-[1.08] mb-6">
          Step into the future of living.
        </h2>

        {/* Subtext */}
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-light max-w-xl leading-relaxed mb-10">
          Whether commissioning a bespoke architectural landmark or acquiring a curated residence,
          our advisory team welcomes your private inquiry.
        </p>

        {/* Dark Pill CTA Button Matching Hero Style */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 sm:mb-28">
          <button
            type="button"
            className="inline-flex items-center gap-3 bg-[#1A1A1C] hover:bg-black text-white px-8 sm:px-9 py-3.5 sm:py-4 rounded-full text-sm font-medium border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-white/40 cursor-pointer group"
          >
            <span>Schedule Private Consultation</span>
            <svg
              className="w-4 h-4 text-zinc-300 group-hover:text-white transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <a
            href="#frame-hero"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white px-5 py-3 rounded-full transition-colors"
          >
            <span>Back to Top</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>

        {/* Footer Navigation & Credits */}
        <footer className="w-full pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-light">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span>© {new Date().getFullYear()} AURA Architecture & Living. All rights reserved.</span>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Advisory
            </a>
            <a href="#instagram" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#linkedin" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};
