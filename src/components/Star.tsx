import React from 'react';

const Star: React.FC<{
  className?: string;
  size: number | string;
  alternative?: boolean;
  color?: string;
}> = ({ className, size, alternative, color }) => (
  <svg {...{ className }} width={size} height={size} x="0px" y="0px" viewBox="0 0 100 100">
    {alternative ? (
      <polygon
        fill={color}
        id="XMLID_1_"
        points="50,0 59.706,13.778 75,6.699 76.517,23.483 93.301,25 86.222,40.294 100,50 86.222,59.706 93.301,75 76.517,76.517 75,93.301 59.706,86.222 50,100 40.294,86.222 25,93.301 23.483,76.517 6.699,75 13.778,59.706 0,50 13.778,40.294 6.699,25 23.483,23.483 25,6.699 40.294,13.778"
      />
    ) : (
      <polygon
        fill={color}
        points="50,0 62.437,19.974 85.355,14.645 80.026,37.563 100,50 80.026,62.437 85.355,85.355 62.437,80.026 50,100 37.563,80.026 14.645,85.355 19.974,62.437 0,50 19.974,37.563 14.645,14.645 37.563,19.974"
      />
    )}
  </svg>
);

export default Star;
