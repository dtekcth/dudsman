import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { css } from 'twin.macro';
import { ClientModels } from '../../models';
import socket from '../../socket';
import animations from '../../utils/animations';
import Popup from '../Popup';
import 'twin.macro';
import Avatar from '../Avatar';
import Button from '../Button';
import Heading from '../Heading';
import TwoDice from '../TwoDice';
import Star from '../Star';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/reducers';
import { roomClosePopup } from '../../store/actions';
import {
  GameStateType,
  Player,
  PopupResult,
  PopupState,
  PopupType
} from '../../../common/models/common';
import ClickArea from '../ClickArea';

const Players: React.FC<{ players: Player[]; turn: string }> = ({ players, turn }) => {
  return (
    <div tw="space-x-1 flex items-center w-full p-2">
      {_.chain(players)
        .sortBy((p) => p.name)
        .map((p) => (
          <div
            key={p.id}
            css={{
              backgroundColor: turn === p.id && 'rgba(0, 0, 0, 0.1)'
            }}
            tw="rounded-full p-2 transition duration-200">
            <Avatar key={p.name} type={p.avatar} name={p.name} score={p.score} />
          </div>
        ))
        .value()}
    </div>
  );
};

const PlayerView: React.FC<{} & ClientModels.RoomViewProps> = ({ state, dieRef1, dieRef2 }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const popup = useSelector<AppState, PopupState>((state) => state.room.popup);
  const playerId = useSelector<AppState, string>((state) => state.room.playerId);
  const dispatch = useDispatch();

  const room = state.room;
  const gameState = room.data.gameState;

  let rollBtn: React.ReactNode;
  if (!state.rolling && gameState.type === GameStateType.Give) {
    rollBtn = (
      <div tw="h-14 text-white flex justify-center items-center font-bold text-xl">
        Waiting for player to give out drinks
      </div>
    );
  } else if (room.data.turn == room.playerId) {
    rollBtn = (
      <Button
        tw="w-full h-14"
        loading={state.rolling}
        outline
        onClick={() => {
          if (room) {
            state.setRolling(true);
            socket.emit('room_roll_dice');
          }
        }}>
        ROLL
      </Button>
    );
  } else {
    rollBtn = (
      <div tw="h-14 text-white flex justify-center items-center font-bold text-xl">
        Wait for your turn to roll...
      </div>
    );
  }

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.absY < eventData.absX) return;
      if (eventData.deltaY < 0) setMenuOpen(true);
      if (eventData.deltaY > 0) setMenuOpen(false);
    }
  });

  const handleGiveDrinks = useCallback((state: PopupState, result: PopupResult) => {
    if (result.type !== PopupType.Give) return;

    socket.emit('room_give_drinks', {
      targetIds: result.targetIds
    });
  }, []);

  const handleClickDot = useCallback(() => {
    socket.emit('room_click_dot');
  }, []);

  const currentPlayer = room.data.players.find((p) => room.data.turn === p.id);
  return (
    <div tw="max-w-sm w-full mx-auto h-full relative border-b-4 border-blue-500">
      <motion.div
        tw="relative h-full"
        animate={{
          y: menuOpen ? -50 : 0,
          opacity: gameState.type === GameStateType.Click ? 0.2 : 1
        }}
        transition={{ duration: 0.2 }}>
        <div tw="absolute inset-x-0 top-1/2 transform -translate-y-1/2 w-full">
          <div tw="px-2 mt-4">
            {currentPlayer && (
              <>
                <Heading size="xl" tw="text-white text-center">
                  Current player turn
                </Heading>
                <div tw="flex justify-center mt-1 relative">
                  <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Star
                      alternative
                      color="rgba(255, 255, 200, 0.3)"
                      size="140"
                      css={css`
                        animation: ${animations.hostStar} 20s infinite;
                        animation-timing-function: linear;
                      `}
                    />
                  </div>

                  <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div css={{ transform: 'rotate(30deg)' }}>
                      <Star
                        color="rgba(255, 255, 200, 0.3)"
                        size="140"
                        css={css`
                          animation: ${animations.hostStar} 20s infinite reverse;
                          animation-timing-function: linear;
                        `}
                      />
                    </div>
                  </div>

                  <Avatar
                    size={70}
                    type={currentPlayer.avatar}
                    name={currentPlayer.name}
                    score={currentPlayer.score}
                  />
                </div>
              </>
            )}

            <TwoDice tw="mt-4" ref1={dieRef1} ref2={dieRef2} num1={state.num1} num2={state.num2} />

            <div tw="mt-4 sm:mt-5 mb-2 sm:mb-5">{rollBtn}</div>
          </div>

          <div tw="overflow-x-auto" className="hide-scroll">
            <Players players={room.data.players} turn={room.data.turn} />
          </div>
        </div>
      </motion.div>

      <div tw="fixed bottom-0 inset-x-0" {...handlers}>
        <div tw="max-w-sm mx-auto w-full bg-white rounded-t-3xl">
          <div tw="mx-auto flex justify-center p-3">
            <button tw="p-1 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
              <motion.div animate={{ scaleY: menuOpen ? -1 : 1 }} transition={{ duration: 0.2 }}>
                <svg
                  width="1em"
                  height="1em"
                  tw="text-gray-600"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512">
                  <path
                    fill="currentColor"
                    d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                </svg>
              </motion.div>

              {/* <FontAwesomeIcon
                        className="text-grey-darker"
                        icon={this.state.menuOpen ? 'chevron-down' : 'chevron-up'}
                      /> */}
            </button>
          </div>

          <motion.div
            tw="overflow-hidden"
            animate={{
              height: menuOpen ? 'auto' : 0
            }}
            transition={{
              duration: 0.2
            }}>
            <div tw="p-5">Hello!</div>
          </motion.div>
        </div>
      </div>

      {gameState.type === GameStateType.Click && (
        <div tw="absolute inset-x-8" css={{ bottom: '15%', top: '10%' }}>
          <ClickArea onClick={handleClickDot} count={gameState.count} />
        </div>
      )}

      {!popup && gameState.type === GameStateType.Give && playerId === gameState.playerId && (
        <Popup
          delay={2.5}
          state={{
            amount: gameState.amount,
            total: 10,
            type: PopupType.Give,
            playerId: gameState.playerId
          }}
          room={room}
          onDone={handleGiveDrinks}
        />
      )}

      <Popup
        delay={popup?.delay ?? 0}
        state={popup}
        room={room}
        onDone={() => dispatch(roomClosePopup())}
      />
    </div>
  );
};

export default PlayerView;
