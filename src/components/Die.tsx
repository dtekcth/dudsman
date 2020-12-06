import React, { useImperativeHandle } from 'react';
import { useState } from 'react';
import { AnimatePresence, createDomMotionComponent, motion } from 'framer-motion';
import { css } from 'twin.macro';

export interface DieProps {
  size?: number | string;
  number: number;
  delay?: number;
  right?: boolean;
  color?: string;
  animated?: boolean;
  rollTime?: number;
}

export interface DieElement {
  roll: (initial?: boolean) => void;
}

const Die = React.forwardRef<DieElement, React.PropsWithChildren<DieProps>>(
  ({ size, number, delay, right, color = 'white', animated = true, rollTime }, forwardRef) => {
    const mult = right ? 1 : -1;
    const [rolling, setRolling] = useState(false);

    useImperativeHandle(forwardRef, () => ({
      roll: () => setRolling(true)
    }));

    const inner =
      number === 1 ? (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zm-8 14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      ) : number === 2 ? (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM4.752 21.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm14.5-14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      ) : number === 3 ? (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM4.752 21.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm7.25-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm7.25-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      ) : number === 4 ? (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM4.752 21.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm14.5 14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      ) : number === 5 ? (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM4.752 21.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm7.25 7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm7.25 7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      ) : (
        <path d="M20.002 0h-16c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM4.752 21.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm14.5 14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5zm0-7.25a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      );

    const key = rollTime ? `${rollTime}-${number}` : number;
    if (!animated) {
      return (
        <motion.svg
          key={key}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={color}
          initial={{
            opacity: 0,
            y: '-100%'
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          exit={{
            opacity: 0,
            y: '-100%'
          }}
          transition={{
            duration: 1,
            x: { ease: [0.25, 1, 0.5, 1], duration: 1.5 },
            y: { type: 'spring', stiffness: 80, delay }
          }}>
          {inner}
        </motion.svg>
      );
    }

    return (
      <AnimatePresence exitBeforeEnter onExitComplete={() => setRolling(false)}>
        {!rolling && (
          <motion.svg
            key={key}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            css={css`
              transform-origin: 50% 50% !important;
            `}
            exit={{
              rotate: 180 * mult,
              x: 100 * mult + '%',
              opacity: 0
            }}
            initial={{
              y: '-100%',
              opacity: 0,
              rotate: 0
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0
            }}
            transition={{
              duration: 1,
              x: { ease: [0.25, 1, 0.5, 1], duration: 1.5 },
              rotate: { ease: [0.25, 1, 0.5, 1], duration: 1.5 },
              y: { type: 'spring', stiffness: 80, delay }
            }}>
            {inner}
          </motion.svg>
        )}
      </AnimatePresence>
    );
  }
);

export default Die;
