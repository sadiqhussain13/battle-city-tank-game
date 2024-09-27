import React from 'react';
import './Projectile.css';

const Projectile = ({ x, y, direction }) => {
  return (
    <div
      className={`projectile ${direction}`}
      style={{ top: `${y * 40}px`, left: `${x * 40}px` }}
    ></div>
  );
};

export default Projectile;