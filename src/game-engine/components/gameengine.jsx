import React, { useState, useEffect, useRef, useCallback } from 'react';
import Timer from './timer';
import Renderer from './renderer';
import { movementSystem } from '../systems/movements';
import { collisionSystem } from '../systems/collision';

const GameEngine = () => {
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved) : 0;
  });
  const [lastScore, setLastScore] = useState(() => {
    const saved = localStorage.getItem('lastScore');
    return saved ? parseInt(saved) : 0;
  });
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [isConqueror, setIsConqueror] = useState(false);

  const [entities, setEntities] = useState({
    player: { 
      x: 400,
      y: 520,
      width: 120,
      height: 90,
      isJumping: false,
      jumpVelocity: 0,
      isDucking: false,
      isMovingLeft: false,
      isMovingRight: false
    },
    backgroundX: 0,
    obstacles: [
      { x: 800, y: 520, width: 90, height: 90, type: 'bush' },
      { x: 1000, y: 520, width: 90, height: 90, type: 'bush' },
      { x: 1200, y: 520, width: 120, height: 150, type: 'highObstacle' },
      { x: 1400, y: 520, width: 90, height: 90, type: 'bush' }
    ],
    collectibles: [
      { x: 1000, y: 520, width: 45, height: 45, type: 'coin' },
      { x: 1400, y: 520, width: 45, height: 45, type: 'coin' }
    ],
    speed: 0.5,
    score: 0,
    gravity: 0.05,
    jumpPower: -6,
    maxSpeed: 12,
    gameTime: 0,
    lastJumpTime: 0,
    lastCollectTime: 0
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showJumpHint, setShowJumpHint] = useState(true);
  const timer = useRef(new Timer());

  // Check collision between two rectangles
  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const updateEntities = useCallback((time, delta) => {
    if (isStarted && !isPaused && !isGameOver && !isConqueror) {
      setEntities(prev => {
        let updated = { ...prev };

        // Apply movement system
        const movedEntities = movementSystem({
          player: updated.player,
          delta,
          gravity: updated.gravity,
          jumpPower: updated.jumpPower,
          groundLevel: 520
        });

        updated.player = movedEntities.player;

        // Handle player horizontal movement
        let playerX = updated.player.x;
        if (updated.player.isMovingRight) {
          playerX += 40 * delta * 0.01;
        }
        if (updated.player.isMovingLeft) {
          playerX -= 40 * delta * 0.01;
        }
        // Keep player within screen bounds
        playerX = Math.max(0, Math.min(800 - updated.player.width, playerX));
        
        // Update obstacles and track passed obstacles
        const newObstacles = updated.obstacles.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - updated.speed
        })).filter(obstacle => {
          if (obstacle.x + obstacle.width < 0) {
            // Count obstacle as passed when it goes off screen
            setObstaclesPassed(prev => {
              const newCount = prev + 1;
              if (newCount >= 1000) {
                setIsConqueror(true);
              }
              return newCount;
            });
            return false;
          }
          return true;
        });

        // Add new obstacles with high spawn rate for increased difficulty
        if (Math.random() < 0.003) {
          newObstacles.push({
            x: 1000 + Math.random() * 400,
            y: 520,
            width: 90,
            height: 90,
            type: 'bush'
          });
        }

        // Limit maximum number of obstacles on screen
        if (newObstacles.length > 5) { // Increased max obstacles for higher difficulty
          newObstacles.shift();
        }

        // Update collectibles
        const newCollectibles = updated.collectibles.map(collectible => ({
          ...collectible,
          x: collectible.x - updated.speed
        })).filter(collectible => collectible.x > -100);

        // Add new collectibles with original rate
        if (Math.random() < 0.01) {
          newCollectibles.push({
            x: 1000 + Math.random() * 200,
            y: 520,
            width: 30,
            height: 30,
            type: 'coin'
          });
        }

        // Apply collision system
        const collisionResult = collisionSystem({
          player: { ...updated.player, x: playerX },
          obstacles: newObstacles,
          collectibles: newCollectibles
        });

        // Handle collision results
        if (collisionResult.hasCollision) {
          setIsGameOver(true);
          return updated;
        }

        // Update coins collected
        if (collisionResult.collectedCoins > 0) {
          setCoinsCollected(prev => prev + collisionResult.collectedCoins);
        }
        
        // Update background position
        const newBackgroundX = (updated.backgroundX + updated.speed) % 800;
        
        // Update score based on survival time and coins
        const newScore = updated.score + (delta * 0.005) + (collisionResult.collectedCoins * 100);

        return {
          ...updated,
          player: {
            ...updated.player,
            x: playerX
          },
          backgroundX: newBackgroundX,
          obstacles: newObstacles,
          collectibles: collisionResult.remainingCollectibles,
          score: newScore,
          speed: Math.min(prev.maxSpeed, prev.speed + (delta * 0.00004))
        };
      });
    }
  }, [isStarted, isPaused, isGameOver, isConqueror]);

  useEffect(() => {
    if (isGameOver) {
      const finalScore = Math.floor(entities.score);
      setLastScore(finalScore);
      localStorage.setItem('lastScore', finalScore);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('highScore', finalScore);
      }
    }
  }, [isGameOver, entities.score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isStarted || isPaused || isGameOver) return;
      
      // Space bar or Up arrow to jump
      if ((e.code === 'Space' || e.key === 'ArrowUp') && !entities.player.isJumping) {
        setEntities(prev => ({
          ...prev,
          player: {
            ...prev.player,
            isJumping: true,
            jumpVelocity: prev.jumpPower
          }
        }));
        setShowJumpHint(false);
      }
      
      // Left arrow to move backward
      if (e.key === 'ArrowLeft') {
        setEntities(prev => ({
          ...prev,
          player: {
            ...prev.player,
            isMovingLeft: true
          }
        }));
      }

      // Right arrow to move forward
      if (e.key === 'ArrowRight') {
        setEntities(prev => ({
          ...prev,
          player: {
            ...prev.player,
            isMovingRight: true
          }
        }));
      }
    };

    const handleKeyUp = (e) => {
      // Stop moving left
      if (e.key === 'ArrowLeft') {
        setEntities(prev => ({
          ...prev,
          player: {
            ...prev.player,
            isMovingLeft: false
          }
        }));
      }

      // Stop moving right
      if (e.key === 'ArrowRight') {
        setEntities(prev => ({
          ...prev,
          player: {
            ...prev.player,
            isMovingRight: false
          }
        }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isStarted, isPaused, isGameOver, entities.player.isJumping]);

  useEffect(() => {
    const timerInstance = timer.current;
    timerInstance.start();
    timerInstance.subscribe(updateEntities);
    return () => {
      timerInstance.unsubscribe(updateEntities);
      timerInstance.stop();
    };
  }, [updateEntities]);

  const resetGame = () => {
    setEntities({
      player: { 
        x: 400,
        y: 520,
        width: 120,
        height: 90,
        isJumping: false,
        jumpVelocity: 0,
        isDucking: false,
        isMovingLeft: false,
        isMovingRight: false
      },
      backgroundX: 0,
      obstacles: [
        { x: 800, y: 520, width: 90, height: 90, type: 'bush' },
        { x: 1000, y: 520, width: 90, height: 90, type: 'bush' },
        { x: 1200, y: 520, width: 120, height: 150, type: 'highObstacle' },
        { x: 1400, y: 520, width: 90, height: 90, type: 'bush' }
      ],
      collectibles: [
        { x: 1000, y: 520, width: 45, height: 45, type: 'coin' },
        { x: 1400, y: 520, width: 45, height: 45, type: 'coin' }
      ],
      speed: 0.5,
      score: 0,
      gravity: 0.05,
      jumpPower: -6,
      maxSpeed: 12,
      gameTime: 0,
      lastJumpTime: 0,
      lastCollectTime: 0
    });
    setCoinsCollected(0);
    setObstaclesPassed(0);
    setIsConqueror(false);
    setIsStarted(false);
    setIsPaused(false);
    setIsGameOver(false);
    setShowJumpHint(true);
  };

  const handleStart = () => {
    resetGame();
    setIsStarted(true);
    setIsPaused(false);
    setIsGameOver(false);
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '800px', 
        height: '600px', 
        overflow: 'hidden', 
        border: '2px solid #1E90FF',
        backgroundColor: '#87CEEB'
      }}
      tabIndex="0"
    >
      <h1 style={{ 
        position: 'absolute', 
        top: 10, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        color: 'darkblue', 
        zIndex: 10,
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        KoKo Racing
      </h1>

      <div style={{ 
        position: 'absolute', 
        top: 50, 
        left: 10, 
        zIndex: 10, 
        color: '#fff', 
        fontSize: '20px', 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        padding: '5px 10px',
        borderRadius: '5px'
      }}>
        Score: {Math.floor(entities.score)}
        <div style={{ fontSize: '14px', marginTop: '5px' }}>
          Coins: {coinsCollected}
        </div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>
          Obstacles Passed: {obstaclesPassed}/1000
        </div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>
          High Score: {highScore}
        </div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>
          Last Score: {lastScore}
        </div>
      </div>

      {showJumpHint && isStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '10px 20px',
          borderRadius: '10px',
          zIndex: 15,
          textAlign: 'center'
        }}>
          Press UP or SPACE to jump!
        </div>
      )}

      {!isStarted && (
        <button 
          onClick={handleStart}
          style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            zIndex: 10,
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Start
        </button>
      )}

      {isStarted && !isGameOver && (
        <button 
          onClick={handlePauseResume}
          style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            zIndex: 10,
            padding: '8px 16px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}

      {isGameOver && (
        <div style={{
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          zIndex: 20,
          textAlign: 'center', 
          border: '2px solid black',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>Game Over</h2>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Final Score: {Math.floor(entities.score)}
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Coins Collected: {coinsCollected}
          </p>
          <button 
            onClick={handleStart}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {isConqueror && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255,215,0,0.9)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 20,
          textAlign: 'center',
          border: '3px solid gold',
          boxShadow: '0 0 20px gold'
        }}>
          <h2 style={{ color: '#8B0000', marginBottom: '10px' }}>CONQUEROR!</h2>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            You've passed 1000 obstacles!
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Final Score: {Math.floor(entities.score)}
          </p>
          <button 
            onClick={resetGame}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FFD700',
              color: '#8B0000',
              border: '2px solid #8B0000',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      <Renderer entities={entities} />
    </div>
  );
};

export default GameEngine;