import React from 'react';
import backgroundImage from '../assets/b3.png';

const Background = ({ x }) => {
  return (
    <div style={{ position: 'relative', width: '1600px', height: '600px' }}>
      <img
        src={backgroundImage}
        alt="Road Background"
        style={{
          position: 'absolute',
          top: 0,
          left: -x,
          width: '800px',
          height: '600px',
          zIndex: 1
        }}
      />
      <img
        src={backgroundImage}
        alt="Road Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 800 - x,
          width: '800px',
          height: '600px',
          zIndex: 1
        }}
      />
    </div>
  );
};

export default Background;