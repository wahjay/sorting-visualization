import React from 'react';
import './Bar.css';

export default function Bar({ height, width, barRef, correct, wrong }) {
    return (
      <div
        className="bar"
        ref={barRef}
        style={{
          height: `${height*3}px`,
          width: `${width}px`,
          fontSize: `${width < 15 ? 0 : width/2}px`,
          marginLeft: `${width <= 20 ? 3 : 5}px`
        }}
      >
        {height}
      </div>
    );
}
