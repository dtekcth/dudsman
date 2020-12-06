import React from 'react';

const Circular: React.FC<{ radius?: number }> = ({ children, radius = 40 }) => (
  <>
    {React.Children.map(children, (c, i) => {
      const a = (i / React.Children.count(children)) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(a) * radius;
      const y = 50 + Math.sin(a) * radius;

      return (
        <div
          key={i}
          tw="absolute"
          css={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
          }}>
          {c}
        </div>
      );
    })}
  </>
);

export default Circular;
