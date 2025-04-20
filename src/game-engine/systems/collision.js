// Check collision between two rectangles with tolerance
const checkCollision = (rect1, rect2, tolerance = 0.8) => {
    // Apply tolerance to make collision detection more forgiving
    const adjustedRect1 = {
        x: rect1.x + rect1.width * (1 - tolerance) / 2,
        y: rect1.y + rect1.height * (1 - tolerance) / 2,
        width: rect1.width * tolerance,
        height: rect1.height * tolerance
    };

    const adjustedRect2 = {
        x: rect2.x + rect2.width * (1 - tolerance) / 2,
        y: rect2.y + rect2.height * (1 - tolerance) / 2,
        width: rect2.width * tolerance,
        height: rect2.height * tolerance
    };

    return adjustedRect1.x < adjustedRect2.x + adjustedRect2.width &&
           adjustedRect1.x + adjustedRect1.width > adjustedRect2.x &&
           adjustedRect1.y < adjustedRect2.y + adjustedRect2.height &&
           adjustedRect1.y + adjustedRect1.height > adjustedRect2.y;
};

export const collisionSystem = ({ player, obstacles, collectibles }) => {
    let score = 0;
    let hasCollision = false;

    // Check for collisions with obstacles
    for (const obstacle of obstacles) {
        // Use a stricter tolerance for obstacles
        if (checkCollision(player, obstacle, 0.7)) {
            hasCollision = true;
            break;
        }
    }

    // If there's a collision with an obstacle, return immediately
    if (hasCollision) {
        return {
            hasCollision: true,
            collectedCoins: 0,
            remainingCollectibles: collectibles,
            score: score
        };
    }

    // Check for collisions with collectibles
    let collectedCoins = 0;
    const remainingCollectibles = collectibles.filter(collectible => {
        // Use a more forgiving tolerance for collectibles
        if (checkCollision(player, collectible, 0.9)) {
            collectedCoins++;
            score += 100; // Add points for collecting coins
            return false; // Remove collected coin
        }
        return true;
    });

    return {
        hasCollision: false,
        collectedCoins,
        remainingCollectibles,
        score: score
    };
}; 