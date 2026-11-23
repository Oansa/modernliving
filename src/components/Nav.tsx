import React from 'react';

const NAV_ITEMS = [
  'Home',
  'Contact',
  'Blog',
  'Portfolio',
  'About',
  'Analytics',
  'Orders',
  'Market',
  'Contact',
];

interface NavProps {
  isSticky?: boolean;
}

export const Nav: React.FC<NavProps> = ({ isSticky = false }) => {
  return (
    <header
      className={`w-full flex items-center justify-between z-30 transition-all duration-300 ${
        isSticky
          ? 'fixed top-4 left-0 right-0 px-6 max-w-6xl mx-auto'
          : 'relative px-2 sm:px-4 pt-2'
      }`}
    >
      {/* Top Left: Logo Mark */}
      <div className="flex items-center gap-2">
        <a href="#" className="flex items-center gap-2.5 group" aria-label="AURA Home">
          <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-sm">
            {/* Minimalist geometric architectural monogram */}
            <svg
              className="w-4 h-4 text-white"
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
          </div>
        </a>
      </div>

      {/* Top Center: Pill-Shaped Navigation */}
      <nav
        className="hidden md:flex items-center gap-0.5 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-full px-2 py-1 shadow-2xl overflow-x-auto max-w-[680px]"
        aria-label="Main Navigation"
      >
        {NAV_ITEMS.map((item, idx) => {
          const isActive = item === 'Analytics';
          return (
            <button
              key={`${item}-${idx}`}
              className={`text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-zinc-900 font-medium px-4 py-1.5 rounded-full shadow-md scale-100'
                  : 'text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-full font-normal'
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>

      {/* Mobile Nav Pill for Small Screens */}
      <nav className="flex md:hidden items-center gap-1 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-full px-2 py-1">
        <button className="bg-white text-zinc-900 font-medium px-3 py-1 rounded-full text-xs">
          Analytics
        </button>
        <button className="text-zinc-300 px-2 py-1 text-xs">
          Home
        </button>
        <button className="text-zinc-400 px-2 py-1 text-xs">
          Portfolio
        </button>
      </nav>

      {/* Top Right: Three circular icon buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Button 1: Notification circle with orange dot */}
        <button
          className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
          aria-label="Notifications"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Amber notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8803A] ring-2 ring-[#2B2B2D]" />
        </button>

        {/* Button 2: Chat icon circle */}
        <button
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
          aria-label="Messages"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        {/* Button 3: Orange avatar / square button */}
        <button
          className="w-9 h-9 rounded-full sm:rounded-xl bg-[#E8803A] hover:brightness-110 flex items-center justify-center text-white transition-all shadow-md"
          aria-label="User Profile"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
