import React, { useState, useEffect } from 'react';
import './Game.css';
import Tank from './Tank';
import Projectile from './Projectile';
import EnemyTank from './EnemyTank';

const gridSize = 10;
const directions = ['up', 'down', 'left', 'right'];

const Game = () => {
  // Tank position and direction
  const [tankPosition, setTankPosition] = useState({ x: 0, y: 0 });
  const [tankDirection, setTankDirection] = useState('up');

  // Enemy tanks
  const [enemyTanks, setEnemyTanks] = useState([
    { x: 100, y: 100, direction: 'up', id: 1 },
    { x: 200, y: 200, direction: 'down', id: 2 },
    // You can add more enemy tanks here
  ]);

  // Track projectile position and active status
  const [projectile, setProjectile] = useState(null);

  // Enemy tank movement
  useEffect(() => {
      const moveEnemies = () => {
        setEnemyTanks((prevTanks) =>
          prevTanks.map((tank) => {
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            let newX = tank.x;
            let newY = tank.y;
  
            // Move the tank based on the random direction
            switch (randomDirection) {
              case 'up':
                newY = Math.max(0, tank.y - 10); // Move up, but stay within bounds
                break;
              case 'down':
                newY = Math.min(400, tank.y + 10); // Move down
                break;
              case 'left':
                newX = Math.max(0, tank.x - 10); // Move left
                break;
              case 'right':
                newX = Math.min(400, tank.x + 10); // Move right
                break;
              default:
                break;
            }
  
            return { ...tank, x: newX, y: newY, direction: randomDirection };
          })
        );
      };
  
      // Move enemy tanks every second
      const intervalId = setInterval(moveEnemies, 1000);
  
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
  }, []);

  // Handle key press to move the tank and fire
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Prevent default scrolling behavior
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }
  
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

  const checkCollision = () => {
    setEnemyTanks((prevEnemyTanks) => {
      return prevEnemyTanks.filter((enemy) => {
        // Check if the projectile is near enough to the enemy tank
        const isHit =
          Math.abs(enemy.x - projectile.x * 40) < 20 &&
          Math.abs(enemy.y - projectile.y * 40) < 20;

        if (isHit) {
          setProjectile(null); // Reset the projectile after a hit
          return false; // Remove the enemy tank that was hit
        }
        return true; // Keep the enemy tanks that weren't hit
      });
    });
  };

  const interval = setInterval(checkCollision, 100);

  return () => clearInterval(interval);
  }, [projectile, enemyTanks]);

  // Adding Player-Enemy Collision Detection
  useEffect(() => {
    const checkPlayerEnemyCollision = () => {
      const hasCollision = enemyTanks.some((enemy) => {
        return (
          Math.abs(enemy.x - tankPosition.x * 40) < 20 &&
          Math.abs(enemy.y - tankPosition.y * 40) < 20
        );
      });

      if (hasCollision) {
        console.log('Collision detected! Game Over or health reduced');
        // Add game over logic or reduce player health here
      }
    };

    const interval = setInterval(checkPlayerEnemyCollision, 100);

    return () => clearInterval(interval);
  }, [tankPosition, enemyTanks]); // Dependencies for the player and enemy positions

  return (
    <div className="game-grid">
      {/* Render enemy tanks */}
      {enemyTanks.map((enemy) => (
        <div
          key={enemy.id}
          className="enemy-tank"
          style={{ top: enemy.y, left: enemy.x }}
        />
      ))}
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