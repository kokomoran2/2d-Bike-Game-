export const collisionSystem = (entities, setIsGameOver) => {
    const player = entities.player;
    const obstacles = entities.obstacles;
    const collectibles = entities.collectibles;
    const powerUps = entities.powerUps;
    
    // Check obstacle collisions
    for (let obs of obstacles) {
      const collided =
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y;
      
      if (collided) {
        setIsGameOver(true);
        return entities;
      }
    }

    // Check collectible collisions
    const newCollectibles = collectibles.filter(collectible => {
      const collected =
        player.x < collectible.x + collectible.width &&
        player.x + player.width > collectible.x &&
        player.y < collectible.y + collectible.height &&
        player.y + player.height > collectible.y;
      
      if (collected) {
        // Add points based on combo
        entities.score += 10 * (entities.combo || 1);
        return false;
      }
      return true;
    });

    // Check power-up collisions
    const newPowerUps = powerUps.filter(powerUp => {
      const collected =
        player.x < powerUp.x + powerUp.width &&
        player.x + player.width > powerUp.x &&
        player.y < powerUp.y + powerUp.height &&
        player.y + player.height > powerUp.y;
      
      if (collected) {
        if (powerUp.type === 'speedBoost') {
          entities.player.hasSpeedBoost = true;
          entities.player.speedBoostTime = 5000; // 5 seconds
        }
        return false;
      }
      return true;
    });

    return {
      ...entities,
      collectibles: newCollectibles,
      powerUps: newPowerUps
    };
};