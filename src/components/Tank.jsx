import React from 'react';
import './Tank.css';

const Tank = ({ x, y, direction }) => {
  return (
    <div
      className={`tank ${direction}`}
      style={{ top: `${y * 40}px`, left: `${x * 40}px` }}
    ></div>
  );
};

export default Tank;