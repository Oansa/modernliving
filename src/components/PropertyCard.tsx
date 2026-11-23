import React from 'react';

export interface PropertyData {
  id: string;
  name: string;
  location: string;
  specs: string;
  price: string;
  image: string;
  status?: string;
}

interface PropertyCardProps {
  property: PropertyData;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <article className="group relative w-[320px] sm:w-[380px] md:w-[420px] flex-shrink-0 bg-[#212123] rounded-[24px] overflow-hidden border border-white/10 shadow-xl transition-all duration-300 hover:border-white/25">
      {/* Property Image Container with hover zoom */}
      <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden bg-black/40">
        <img
          src={property.image}
          alt={`${property.name} in ${property.location}`}
          className="w-full h-full object-cover object-center filter grayscale contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Small Glass Info Chip (reveals / brightens on hover) */}
        <div className="absolute top-4 right-4 glass-panel rounded-full px-3 py-1.5 text-xs text-white opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8803A]" />
          <span>{property.status || 'Exclusive'}</span>
        </div>

        {/* Price tag positioned cleanly over lower image */}
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-wider uppercase text-zinc-400">
              {property.location}
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight mt-0.5">
              {property.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block font-normal">Inquire from</span>
            <span className="text-base sm:text-lg font-medium text-white tracking-tight">
              {property.price}
            </span>
          </div>
        </div>
      </div>

      {/* Property Specs Footer */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/5 bg-[#1F1F21]">
        <span className="text-xs sm:text-sm text-zinc-400 font-normal">
          {property.specs}
        </span>
        <button
          type="button"
          className="text-xs text-zinc-300 hover:text-white font-medium inline-flex items-center gap-1 group/link transition-colors cursor-pointer"
        >
          <span>View Dossier</span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
};
