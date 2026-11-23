import React from 'react';

export const GlassPanel: React.FC = () => {
  return (
    <div className="w-52 sm:w-60 rounded-[22px] p-3.5 glass-panel text-white shadow-2xl transition-all duration-300 hover:bg-white/[0.14]">
      {/* Cropped inset thumbnail of the architectural house */}
      <div className="w-full h-24 sm:h-28 rounded-[16px] overflow-hidden mb-3 relative bg-black/40">
        <img
          src="/hero.jpg"
          alt="Curvilinear residence inset"
          className="w-full h-full object-cover object-center filter grayscale-[30%] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="px-1">
        <p className="text-xs sm:text-sm text-zinc-200 font-light leading-snug mb-2">
          future with a platform
        </p>
        <a
          href="#learn-more"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-medium transition-colors group"
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
    </div>
  );
};
