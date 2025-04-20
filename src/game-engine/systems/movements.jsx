export const movementSystem = (entities, delta) => {
    // Horizontal background movement
    const newBackgroundX = (entities.backgroundX - entities.speed) % 800;
    
    // Update obstacles
    const newObstacles = entities.obstacles.map(obstacle => {
      const newX = obstacle.x - entities.speed;
      if (newX < -100) { // When obstacle goes off screen
        return {
          ...obstacle,
          x: 800 + Math.random() * 400,
          y: 420 // Fixed ground position
        };
      }
      return { ...obstacle, x: newX };
    });
  
    // Handle player jumping physics
    let newY = entities.player.y;
    let newJumpVelocity = entities.player.jumpVelocity;
    let isJumping = entities.player.isJumping;
  
    if (entities.player.isJumping) {
      newY += newJumpVelocity;
      newJumpVelocity += entities.gravity;
      
      // Land on ground
      if (newY >= 400) {
        newY = 400;
        isJumping = false;
        newJumpVelocity = 0;
      }
    }
  
    const newScore = entities.score + 1;
  
    return {
      ...entities,
      backgroundX: newBackgroundX,
      obstacles: newObstacles,
      player: {
        ...entities.player,
        y: newY,
        jumpVelocity: newJumpVelocity,
        isJumping
      },
      score: newScore
    };
};