import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import 'twin.macro';
import Heading from './Heading';

export interface ClickAreaProps {
  size?: number | string;
  count?: number;
  onClick?: () => void;
}

const ClickArea = ({ size = 100, count = 0, onClick }) => {
  const [clicks, setClicks] = useState(0);

  const [pos, setPos] = useState({
    left: Math.random(),
    top: Math.random()
  });

  const handleClick = useCallback(() => {
    if (count > 0 && clicks >= count) return;

    setPos({
      left: Math.random(),
      top: Math.random()
    });

    setClicks(clicks + 1);
    onClick?.();
  }, [clicks]);

  return (
    <>
      {count > 0 && clicks >= count ? (
        <>
          <Heading tw="text-white text-center" size="2xl">
            Well done!
          </Heading>
          <Heading tw="text-white text-center mt-8" size="xl">
            Wait for the other players to finish!
          </Heading>
        </>
      ) : (
        <Heading tw="text-white text-center" size="2xl">
          Click the dots as fast as you can!
        </Heading>
      )}
      <AnimatePresence exitBeforeEnter>
        {(count === 0 || clicks < count) && (
          <div
            tw="absolute"
            key={`${pos.left}-${pos.top}`}
            css={{
              left: pos.left * 100 + '%',
              top: pos.top * 100 + '%',
              width: size,
              height: size
            }}>
            <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              exit={{
                scale: 0
              }}
              transition={{
                duration: 0.2,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              tw="bg-white bg-opacity-60 rounded-full h-full w-full"
              onClick={handleClick}></motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
transform: 'translate(-50%, -50%)';

export default ClickArea;
