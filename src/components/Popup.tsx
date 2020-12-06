import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import 'twin.macro';
import { Dice } from '../../server/rooms';
import { RoomState } from '../store/reducers/room';
import { useNextFrame } from '../utils/hooks';
import Button from './Button';
import Heading from './Heading';
import TwoDice from './TwoDice';

export type PopupState =
  | {
      type: 'game_lost';
      message: string;
      drinks: number;
      dice: Dice;
    }
  | {
      type: 'drink';
      drinks: number;
      dice: Dice;
    };

export interface PopupProps {
  state: PopupState;
  room: RoomState;
  onDone?: () => void;
}

const Popup: React.FC<PopupProps> = ({ state: stateIn, room, onDone }) => {
  const stateFrame = useNextFrame(stateIn);

  const state = stateIn ?? stateFrame;
  return (
    <div
      tw="absolute left-1/2 top-1/2 transition duration-200"
      css={{
        minWidth: '24rem',
        width: '110%',
        pointerEvents: state ? 'auto' : 'none',
        transform: 'translate(-50%, -50%)'
      }}>
      <AnimatePresence exitBeforeEnter>
        {state && (
          <motion.div
            css={{
              paddingTop: '100%'
            }}
            tw="w-full h-full relative bg-white rounded-full"
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
              duration: stateIn ? 0.5 : 0.2,
              ease: stateIn ? [0.34, 1.56, 0.64, 1] : 'easeInOut'
            }}>
            <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center space-y-4 w-1/2">
              {(state.type === 'drink' || state.type === 'game_lost') && (
                <TwoDice
                  size="56px"
                  num1={state.dice[0]}
                  num2={state.dice[1]}
                  tw="text-dtek"
                  color="currentColor"
                  animated={false}
                />
              )}

              {state.type === 'drink' ? (
                <Heading size="3xl" tw="text-dtek text-center">
                  Drink {state.drinks}
                </Heading>
              ) : state.type === 'game_lost' ? (
                <div>
                  <Heading size="3xl" tw="text-dtek text-center">
                    {state.message}
                  </Heading>
                  <Heading size="2xl" tw="text-dtek text-center">
                    Drink {state.drinks}
                  </Heading>
                </div>
              ) : null}

              <Button onClick={() => onDone?.()}>Done</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popup;
