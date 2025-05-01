import React, { useState } from 'react';

// Social Icon component (reusable)
const SocialIcon = ({ platform, href, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = {
    Discord: '#5865F2',
    Twitter: '#1DA1F2',
    Instagram: '#E1306C',
    Facebook: '#1877F2' // <-- Incluye Facebook
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative block"
      aria-label={platform}
    >
      <div
        className={`p-2 rounded-full transition-all duration-300 ${isHovered ? 'bg-white/10' : 'bg-white/5'}`}
        style={{
          // Slightly less prominent shadow for this context
          boxShadow: isHovered ? `0 0 6px ${colors[platform]}40` : 'none',
          color: isHovered ? colors[platform] : 'rgba(255, 255, 255, 0.7)'
        }}
      >
        {children}
      </div>
    </a>
  );
};

export default SocialIcon; 