import React from 'react';
import c1 from '../assets/c1.png';

const Collectible = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                zIndex: 2,
                animation: 'spin 1s linear infinite'
            }}
        >
            <img
                src={c1}
                alt="Coin"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Collectible; 