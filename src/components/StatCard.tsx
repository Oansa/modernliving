import React from 'react';

interface StatCardProps {
  label?: string;
  badge?: string;
  value?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label = 'Smart Flow',
  badge = '+12%',
  value = '85%',
}) => {
  return (
    <div className="bg-white text-zinc-900 rounded-[20px] p-4 sm:p-5 shadow-2xl w-36 sm:w-44 md:w-48 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          {label}
        </span>
        <span className="bg-[#E8803A] text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          {badge}
        </span>
      </div>
      <div className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
        {value}
      </div>
    </div>
  );
};
