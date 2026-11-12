import React from 'react';

export const Monogram = ({ size = 32, className = '' }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center font-mono font-bold select-none group ${className}`}
      style={{ width: size, height: size }}
      title="Aditya Agarwal"
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        <rect width="40" height="40" rx="8" fill="#FFFFFF" stroke="#DCDAD3" strokeWidth="1.5" />
        {/* Subtle grid lines */}
        <line x1="8" y1="20" x2="32" y2="20" stroke="#EBE8E0" strokeDasharray="2 2" />
        <line x1="20" y1="8" x2="20" y2="32" stroke="#EBE8E0" strokeDasharray="2 2" />
        {/* Monogram A A glyphs */}
        <path 
          d="M12 28L17 12L22 28M13.8 23.5H20.2" 
          stroke="#151515" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M20 28L25 12L30 28M21.8 23.5H28.2" 
          stroke="#315BFF" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Status dot in top right */}
        <circle cx="33" cy="8" r="2" fill="#315BFF" />
      </svg>
    </div>
  );
};

export default Monogram;
