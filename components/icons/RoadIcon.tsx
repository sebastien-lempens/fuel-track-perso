
import React from 'react';

export const RoadIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V8m-4 8V8m-4 8h14M3 8h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);
