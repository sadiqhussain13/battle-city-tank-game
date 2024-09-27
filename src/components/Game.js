import React, { useState } from 'react';
import './Game.css';

const gridSize = 10;  // Define the grid size (10x10 for now)

const Game = () => {
  const [grid, setGrid] = useState(Array(gridSize).fill(Array(gridSize).fill(0)));  // 2D array for the grid

  return (
    <div className="game-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="cell"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
