import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import 'twin.macro';
import { css } from 'twin.macro';
import { Dice, PopupResult, PopupState, PopupType } from '../../common/models/common';
import Player from '../../server/player';
import { RoomState } from '../store/reducers/room';
import { useNextFrame } from '../utils/hooks';
import Avatar from './Avatar';
import Button from './Button';
import Die from './Die';
import Heading from './Heading';
import TwoDice from './TwoDice';
export interface PopupProps {
  delay?: number;
  state: PopupState;
  room: RoomState;
  onDone?: (state: PopupState, result?: PopupResult) => void;
}

const PlayerGiveList: React.FC<PopupProps & { onChange: (given: string[]) => void }> = ({
  state,
  room,
  onChange
}) => {
  if (state.type !== PopupType.Give) {
    throw new Error('Popup state must be give state');
  }

  const [given, setGiven] = useState<string[]>([]);

  const handleClick = useCallback(
    (ply: Player) => {
      let newGiven = [...given];
      if (given[0] === ply.id && given[1] === ply.id) {
        newGiven = [];
      } else {
        if (newGiven.length == 2) newGiven.pop();

        if (given.find((i) => i == ply.id)) {
          newGiven = [ply.id, ply.id];
        } else {
          newGiven.push(ply.id);
        }
      }

      setGiven(newGiven);
      onChange?.(newGiven);
    },
    [given]
  );

  return (
    <div tw="overflow-y-auto p-2 h-40 mb-2 mt-2">
      {room.data.players.map((ply, index) => (
        <div
          key={ply.id}
          tw="flex items-center space-x-2 border-b border-black border-opacity-10 py-1 last-of-type:border-b-0"
          onClick={() => handleClick(ply)}>
          <Avatar size={32} type={ply.avatar} animated={false} />
          <span
            css={css`
              padding: 0.1rem 0.5rem;
              line-height: 22px;
            `}
            tw="text-sm text-center uppercase font-bold text-white tracking-widest rounded bg-black bg-opacity-50">
            {ply.name}
          </span>
          <div tw="flex-grow" />
          <div tw="flex flex-row-reverse">
            {given[0] === ply.id && (
              <Die
                number={state.amount[0]}
                size={24}
                tw="text-dtek ml-2"
                color="currentColor"
                animated={false}
              />
            )}
            {given[1] === ply.id && (
              <Die
                number={state.amount[1]}
                size={24}
                tw="text-dtek"
                color="currentColor"
                animated={false}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Popup: React.FC<PopupProps> = ({ state: stateIn, room, onDone, delay }) => {
  const [given, setGiven] = useState<string[]>([]);

  const stateFrame = useNextFrame(stateIn);
  const state = stateIn ?? stateFrame;

  const handleDone = useCallback(() => {
    switch (state.type) {
      case PopupType.Give:
        return onDone?.(state, {
          type: state.type,
          targetIds: given
        });
    }

    onDone?.(state);
  }, [state, given]);

  return (
    <div
      tw="absolute left-1/2 top-1/2 transition duration-200"
      css={{
        minWidth: '24rem',
        width: '120%',
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
              delay: delay && stateIn ? delay : 0,
              duration: stateIn ? 0.5 : 0.2,
              ease: stateIn ? [0.34, 1.56, 0.64, 1] : 'easeInOut'
            }}>
            <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center space-y-2 w-2/3">
              {state.type === PopupType.Drink && state.message && (
                <Heading size="xl" tw="text-dtek text-center">
                  {state.message}
                </Heading>
              )}

              {(state.type === PopupType.Drink || state.type === PopupType.GameLost) && (
                <TwoDice
                  size="56px"
                  num1={state.dice[0]}
                  num2={state.dice[1]}
                  tw="text-dtek"
                  color="currentColor"
                  animated={false}
                />
              )}

              {state.type === PopupType.Give && (
                <TwoDice
                  size="48px"
                  num1={state.amount[0]}
                  num2={state.amount[1]}
                  tw="text-dtek"
                  color="currentColor"
                  animated={false}
                />
              )}

              {state.type === PopupType.Drink ? (
                <Heading size="3xl" tw="text-dtek text-center">
                  Drink {state.drinks}
                </Heading>
              ) : state.type === PopupType.GameLost ? (
                <div>
                  <Heading size="3xl" tw="text-dtek text-center">
                    {state.message}
                  </Heading>
                  <Heading size="2xl" tw="text-dtek text-center">
                    Drink {state.drinks}
                  </Heading>
                </div>
              ) : state.type === PopupType.Give ? (
                <div>
                  <Heading size="xl" tw="text-dtek text-center">
                    Give out {state.amount.join('+')} drinks
                  </Heading>

                  <PlayerGiveList state={state} room={room} onChange={(given) => setGiven(given)} />
                </div>
              ) : null}

              <Button
                disabled={state.type === PopupType.Give && given.length !== state.amount.length}
                tw="w-1/2 mx-auto"
                onClick={handleDone}>
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popup;
