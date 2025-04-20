export const movementSystem = ({ player, delta, gravity, jumpPower, groundLevel }) => {
    let updatedPlayer = { ...player };

    // Handle jumping physics
    if (updatedPlayer.isJumping) {
        updatedPlayer.y += updatedPlayer.jumpVelocity;
        updatedPlayer.jumpVelocity += gravity;

        // Check if player has landed
        if (updatedPlayer.y >= groundLevel) {
            updatedPlayer.y = groundLevel;
            updatedPlayer.isJumping = false;
            updatedPlayer.jumpVelocity = 0;
        }
    }

    // Handle horizontal movement
    if (updatedPlayer.isMovingRight) {
        updatedPlayer.x += 40 * delta * 0.01;
    }
    if (updatedPlayer.isMovingLeft) {
        updatedPlayer.x -= 40 * delta * 0.01;
    }

    // Keep player within screen bounds
    updatedPlayer.x = Math.max(0, Math.min(800 - updatedPlayer.width, updatedPlayer.x));

    // Initialize jump if requested
    if (!updatedPlayer.isJumping && updatedPlayer.shouldJump) {
        updatedPlayer.isJumping = true;
        updatedPlayer.jumpVelocity = jumpPower;
        updatedPlayer.shouldJump = false;
    }

    return {
        player: updatedPlayer
    };
}; 