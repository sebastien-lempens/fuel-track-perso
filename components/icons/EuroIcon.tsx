
import React from 'react';

export const EuroIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9.004 9.004 0 0112 16c-2.435 0-4.665-.94-6.364-2.464M14.121 15.536L15.536 14.121m-1.415 1.415a9.002 9.002 0 01-2.464 2.464M12 21a9.004 9.004 0 01-6.364-2.636M12 3c2.435 0 4.665.94 6.364 2.464m-6.364-2.464A9.004 9.004 0 0112 3m0 18c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-9h-4.5m4.5 0H9m3-3.75h-3m3 7.5h-3" />
  </svg>
);
