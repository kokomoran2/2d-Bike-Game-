import React from 'react';
import Player from '../entities/player';
import Obstacle from '../entities/obstacle';
import Collectible from '../entities/collectible';
import Background from '../entities/background';

const Renderer = ({ entities }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Background x={entities.backgroundX} />
            
            {entities.obstacles.map((obstacle, index) => (
                <Obstacle
                    key={`obstacle-${index}`}
                    x={obstacle.x}
                    y={obstacle.y}
                    width={obstacle.width}
                    height={obstacle.height}
                />
            ))}

            {entities.collectibles.map((collectible, index) => (
                <Collectible
                    key={`collectible-${index}`}
                    x={collectible.x}
                    y={collectible.y}
                    width={collectible.width}
                    height={collectible.height}
                />
            ))}

            <Player
                x={entities.player.x}
                y={entities.player.y}
                width={entities.player.width}
                height={entities.player.height}
                isJumping={entities.player.isJumping}
                isDucking={entities.player.isDucking}
            />
        </div>
    );
};

export default Renderer;