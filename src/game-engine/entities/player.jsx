import React from 'react';
import bk3 from '../assets/bk3.png';

const Player = ({ x, y, width, height, isJumping, isDucking }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                transition: 'transform 0.1s',
                transform: `${isDucking ? 'scale(1, 0.7)' : 'scale(1, 1)'}`,
                zIndex: 2
            }}
        >
            <img
                src={bk3}
                alt="Player"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: `${isJumping ? 'rotate(-10deg)' : 'rotate(0deg)'}`,
                    transition: 'transform 0.2s'
                }}
            />
        </div>
    );
};

export default Player;