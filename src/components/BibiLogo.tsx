import React from 'react';

interface BibiLogoProps {
  className?: string;
  mode?: 'full' | 'horizontal' | 'icon';
  height?: number | string;
}

export default function BibiLogo({ className = '', mode = 'horizontal', height }: BibiLogoProps) {
  // Deep Chili Red: #C62828
  // Warm Gold: #F4B400
  // Charcoal: #222222
  
  // Custom height calculation for flexibility
  const containerStyle = height ? { height } : undefined;

  // Mode: Just the stylized icon (Capital 'B' with steam and bowl)
  if (mode === 'icon') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block select-none ${className}`}
        style={containerStyle}
        aria-label="Bibi Food Icon"
      >
        {/* Outer Circular Boundary - Red Ring */}
        <circle
          cx="60"
          cy="52"
          r="46"
          stroke="#C62828"
          strokeWidth="4"
          fill="none"
        />

        {/* The Stylized 'B' that arcs up from the bowl and loops */}
        <path
          d="M 33 55 C 33 24, 48 14, 74 14 C 92 14, 98 28, 92 41 C 100 48, 98 62, 85 64"
          stroke="#C62828"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Deep Red Bowl at the bottom */}
        <path
          d="M 27 58 C 27 86, 93 86, 93 58"
          stroke="#C62828"
          strokeWidth="1"
          fill="#C62828"
        />
        <path
          d="M 27 58 C 45 64, 75 64, 93 58 C 75 52, 45 52, 27 58 Z"
          fill="#C62828"
        />

        {/* Soup Inner Rim Golden Highlight */}
        <path
          d="M 34 57 C 46 62, 74 62, 86 57 C 74 54, 46 54, 34 57 Z"
          fill="#F4B400"
        />

        {/* Elegant Golden Steam Flame Wisps rising from the bowl */}
        {/* Left main wisp */}
        <path
          d="M 52 53 C 45 42, 48 30, 56 22 C 48 30, 52 42, 57 53 Z"
          fill="#F4B400"
        />
        {/* Right secondary wisp */}
        <path
          d="M 59 53 C 56 45, 58 37, 63 30 C 58 36, 59 44, 61 53 Z"
          fill="#F4B400"
        />
      </svg>
    );
  }

  // Horizontal logo (Stylized icon + Text "Bibi Food")
  if (mode === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 select-none ${className}`} style={containerStyle}>
        {/* Stylized Icon - scaled proportionally and optimized for alignment */}
        <BibiLogo mode="icon" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
        
        {/* Premium Text Assembly */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline font-display font-extrabold text-xl sm:text-2xl tracking-tight leading-none">
            {/* Bibi Text */}
            <span className="text-[#C62828] relative flex items-center">
              B
              <span className="relative">i</span>
              b
              {/* The second 'i' with a heart dot and steam waves */}
              <span className="relative inline-block">
                i
                {/* Heart Dot */}
                <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 text-[8px] text-[#C62828]">❤️</span>
                {/* Steaming waves */}
                <span className="absolute -top-[17px] left-1/2 -translate-x-1/2 flex gap-[2px]">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="animate-pulse">
                    <path d="M1 9C3 7 1 4 4 1" stroke="#C62828" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="animate-pulse" style={{ animationDelay: '0.3s' }}>
                    <path d="M2 9C4 6 2 3 5 1" stroke="#C62828" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </span>
 
            {/* Food Text */}
            <span className="text-[#F4B400] ml-1.5 font-bold">Food</span>
          </div>
          
          <span className="text-[6.5px] sm:text-[7px] font-mono font-black tracking-[0.14em] text-[#222222] uppercase mt-1 leading-none">
            FRESHLY MADE. DELIVERED FAST.
          </span>
        </div>
      </div>
    );
  }
 
  // Full brand presentation (Icon + Text + Elegant Tagline underneath with rules)
  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`} style={containerStyle}>
      {/* Upper horizontal group */}
      <div className="flex items-center gap-4">
        <BibiLogo mode="icon" className="w-11 h-11 shrink-0 animate-fade-in" />
        
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-baseline font-display font-black text-2xl sm:text-3xl tracking-tight leading-none">
            <span className="text-[#C62828] relative flex items-center">
              B
              <span>i</span>
              b
              <span className="relative inline-block">
                i
                <span className="absolute -top-[8px] left-1/2 -translate-x-1/2 text-[9px] text-[#C62828]">❤️</span>
              </span>
            </span>
            <span className="text-[#F4B400] ml-2 font-extrabold">Food</span>
          </div>
          
          <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.16em] text-[#222222] uppercase mt-1.5 leading-none">
            FRESHLY MADE. DELIVERED FAST.
          </span>
        </div>
      </div>
 
      {/* Styled Tagline with elegant side rules */}
      <div className="w-full flex items-center justify-center gap-3 mt-4">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#222222]" />
        <span className="font-mono font-extrabold text-[9px] sm:text-[10px] tracking-[0.18em] text-[#222222] uppercase whitespace-nowrap">
          FRESHLY MADE. DELIVERED FAST.
        </span>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#222222]" />
      </div>
    </div>
  );
}
