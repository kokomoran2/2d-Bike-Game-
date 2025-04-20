import React from 'react';

const PowerUp = ({ x, y, type }) => {
  return (
    <div
      style={{ 
        position: 'absolute', 
        top: `${y}px`, 
        left: `${x}px`, 
        width: '40px', 
        height: '40px',
        zIndex: 1,
        animation: 'pulse 1s ease-in-out infinite',
        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        transform: 'rotate(180deg)',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
      }}
    />
  );
};

export default PowerUp; 