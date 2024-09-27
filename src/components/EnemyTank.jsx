import React from 'react';
import './EnemyTank.css';

const EnemyTank = ({ x, y, direction }) => {
  return (
    <div
      className={`enemy-tank ${direction}`}
      style={{ top: `${y * 40}px`, left: `${x * 40}px` }}
    ></div>
  );
};

export default EnemyTank;