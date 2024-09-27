import React, { useState, useEffect } from 'react';
import './Game.css';
import Tank from './Tank';
import Projectile from './Projectile';
import EnemyTank from './EnemyTank';

const gridSize = 10;

const Game = () => {
  // Tank position and direction
  const [tankPosition, setTankPosition] = useState({ x: 0, y: 0 });
  const [tankDirection, setTankDirection] = useState('up');

  // Enemy tanks
  const [enemyTanks, setEnemyTanks] = useState([
    { x: 5, y: 5, direction: 'down', id: 1 },
    { x: 7, y: 2, direction: 'left', id: 2 },
  ]);

  // Track projectile position and active status
  const [projectile, setProjectile] = useState(null);

  // Handle key press to move the tank and fire
  useEffect(() => {
    const handleKeyPress = (event) => {
      let newX = tankPosition.x;
      let newY = tankPosition.y;

      if (event.key === 'ArrowUp' || event.key === 'w') {
        newY = Math.max(0, tankPosition.y - 1);
        setTankDirection('up');
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        newY = Math.min(gridSize - 1, tankPosition.y + 1);
        setTankDirection('down');
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        newX = Math.max(0, tankPosition.x - 1);
        setTankDirection('left');
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        newX = Math.min(gridSize - 1, tankPosition.x + 1);
        setTankDirection('right');
      } else if (event.key === ' ' && !projectile) { // Fire projectile on spacebar press
        setProjectile({ x: tankPosition.x, y: tankPosition.y, direction: tankDirection });
      }

      setTankPosition({ x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [tankPosition, tankDirection, projectile]);

  // Move the projectile based on its direction
  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      setProjectile((prevProjectile) => {
        if (!prevProjectile) return null;

        let newX = prevProjectile.x;
        let newY = prevProjectile.y;

        if (prevProjectile.direction === 'up') newY--;
        if (prevProjectile.direction === 'down') newY++;
        if (prevProjectile.direction === 'left') newX--;
        if (prevProjectile.direction === 'right') newX++;

        // Stop projectile if it goes out of bounds
        if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
          return null;
        }

        return { ...prevProjectile, x: newX, y: newY };
      });
    }, 100); // Move the projectile every 100ms

    return () => clearInterval(interval);
  }, [projectile]);

  // Detect collisions between projectiles and enemy tanks
  useEffect(() => {
    if (!projectile) return;
  
    const interval = setInterval(() => {
      // Check if any enemy tank has been hit
      const hitEnemy = enemyTanks.find(
        (enemy) => enemy.x === projectile.x && enemy.y === projectile.y
      );
  
      // If an enemy tank is hit, remove it and reset the projectile
      if (hitEnemy) {
        setEnemyTanks((prevEnemyTanks) =>
          prevEnemyTanks.filter((enemy) => enemy.id !== hitEnemy.id)
        );
        setProjectile(null);
      } else {
        // Check if the projectile should be removed because it's out of bounds
        setProjectile((prevProjectile) => {
          if (!prevProjectile) return null;
          if (prevProjectile.x < 0 || prevProjectile.x >= gridSize || prevProjectile.y < 0 || prevProjectile.y >= gridSize) {
            return null;
          }
          return prevProjectile;
        });
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, [projectile, enemyTanks]);
  

  return (
    <div className="game-grid">
      {/* Render the grid */}
      {[...Array(gridSize)].map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {[...Array(gridSize)].map((_, cellIndex) => (
            <div key={cellIndex} className="cell"></div>
          ))}
        </div>
      ))}

      {/* Render the player's tank */}
      <Tank x={tankPosition.x} y={tankPosition.y} direction={tankDirection} />

      {/* Render the projectile if it's active */}
      {projectile && (
        <Projectile x={projectile.x} y={projectile.y} direction={projectile.direction} />
      )}

      {/* Render enemy tanks */}
      {enemyTanks.map((enemy) => (
        <EnemyTank key={enemy.id} x={enemy.x} y={enemy.y} direction={enemy.direction} />
      ))}
    </div>
  );
};

export default Game;