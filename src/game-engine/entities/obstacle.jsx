import React from 'react';
import bs1 from '../assets/bs1.png';

const Obstacle = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                zIndex: 2
            }}
        >
            <img
                src={bs1}
                alt="Obstacle"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};

export default Obstacle;