import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import 'twin.macro';
import { css } from 'twin.macro';
import Player from '../../../server/player';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Die, { DieElement } from '../../components/Die';
import Heading from '../../components/Heading';
import Loader from '../../components/Loader';
import socket from '../../socket';
import { AppState } from '../../store/reducers';
import { RoomState } from '../../store/reducers/room';
import { useTimeout } from '../../utils';
import animations from '../../utils/animations';
import Swipeable, { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';

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

const HorizontalScroll: React.FC<{ direction: 'vertical' | 'horizontal' }> = ({
  children,
  direction
}) => {
  const onMouseWheel = useCallback((event) => {
    // if (direction === 'horizontal') {
    //   const list = event.currentTarget;
    //   const delta = event.deltaX == 0 ? event.deltaY : event.deltaX;
    //   list.scrollLeft -= delta;
    //   event.preventDefault();
    // }
  }, []);

  return (
    <div onWheel={onMouseWheel} tw="overflow-x-auto" className="hide-scroll">
      {children}
    </div>
  );
};

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

const Dice: React.FC<{
  className?: string;
  num1: number;
  num2: number;
  ref1?: React.RefObject<DieElement>;
  ref2?: React.RefObject<DieElement>;
}> = ({ className, num1, num2, ref1, ref2 }) => (
  <div {...{ className }} tw="flex justify-center -mx-2">
    <div tw="w-1/3 p-2">
      <Die ref={ref1} number={num1} />
    </div>

    <div tw="w-1/3 p-2">
      <Die ref={ref2} right number={num2} delay={0.25} />
    </div>
  </div>
);

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
            <Avatar key={p.name} type={p.avatar} name={p.name} />
          </div>
        ))
        .value()}
    </div>
  );
};

interface RoomViewState {
  num1: number;
  num2: number;
  room: RoomState;
  rolling: boolean;
  setRolling: (rolling: boolean) => void;
}

interface RoomViewProps {
  dieRef1: React.RefObject<DieElement>;
  dieRef2: React.RefObject<DieElement>;
  state: RoomViewState;
}

const PlayerView: React.FC<{} & RoomViewProps> = ({ state, dieRef1, dieRef2 }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const room = state.room;

  console.log('turn', room.data.turn, room.playerId);

  let rollBtn: React.ReactNode;
  if (room.data.turn == room.playerId) {
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
      console.log(eventData);
      if (eventData.absY < eventData.absX) return;
      if (eventData.deltaY < 0) setMenuOpen(true);
      if (eventData.deltaY > 0) setMenuOpen(false);
    }
  });

  const currentPlayer = room.data.players.find((p) => room.data.turn === p.id);
  return (
    <div tw="max-w-sm w-full mx-auto h-full relative border-b-4 border-blue-500">
      <motion.div
        tw="relative h-full"
        animate={{ y: menuOpen ? -50 : 0 }}
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
                      size="200"
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
                        size="180"
                        css={css`
                          animation: ${animations.hostStar} 20s infinite reverse;
                          animation-timing-function: linear;
                        `}
                      />
                    </div>
                  </div>

                  <Avatar size={70} type={currentPlayer.avatar} name={currentPlayer.name} />
                </div>
              </>
            )}

            <Dice tw="mt-4" ref1={dieRef1} ref2={dieRef2} num1={state.num1} num2={state.num2} />

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
    </div>
  );
};

const HostView: React.FC<
  { onKickPlayer?: (ply: Player) => void; onGiveTurn?: (ply: Player) => void } & RoomViewProps
> = ({ state, dieRef1, dieRef2, onKickPlayer, onGiveTurn }) => {
  const room = state.room;

  const players = _.chain(room.data.players)
    .sortBy((p) => p.name)
    .map((p) => (
      <div
        key={p.id}
        css={{
          backgroundColor: room.data.turn === p.id && 'rgba(0, 0, 0, 0.1)'
        }}
        tw="rounded-full p-2 transition duration-200">
        <Avatar
          key={p.name}
          type={p.avatar}
          name={p.name}
          score={p.score}
          onKick={() => onKickPlayer(p)}
          onGiveTurn={() => onGiveTurn(p)}
        />
      </div>
    ))
    .value();

  players.unshift(
    <div>
      <div tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Star
          alternative
          color="rgba(255, 255, 200, 0.3)"
          size="200"
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
            size="180"
            css={css`
              animation: ${animations.hostStar} 20s infinite reverse;
              animation-timing-function: linear;
            `}
          />
        </div>
      </div>

      <Avatar key={0} size={140} type="whiskey" name="Dödsman" />
    </div>
  );

  return (
    <div tw="bg-dtek h-screen relative">
      <div tw="absolute top-0 inset-x-0 p-2">
        <Heading size="2xl" tw="text-center text-white tracking-widest uppercase">
          Dödsman
        </Heading>
      </div>

      <div
        tw="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        css={{ width: 200 }}>
        <Heading size="xl" tw="text-center text-white tracking-widest uppercase">
          Room code
        </Heading>

        <Heading size="3xl" tw="text-center text-white tracking-widest uppercase">
          {room.data.code}
        </Heading>

        <Dice ref1={dieRef1} ref2={dieRef2} tw="mt-2" num1={state.num1} num2={state.num2} />
      </div>

      <div
        tw="absolute left-1/2 top-1/2"
        css={{ width: 500, height: 500, transform: 'translate(-50%, calc(-50% + 30px))' }}>
        <Circular>{players}</Circular>
      </div>
    </div>
  );
};

const RoomPage = () => {
  const router = useRouter();

  const [num1, setNum1] = useState<number>();
  const [num2, setNum2] = useState<number>();
  const [rollTime, setRollTime] = useState<Date>();
  const timeout = useTimeout();
  const [rolling, setRolling] = useState<boolean>(false);

  const room = useSelector<AppState, RoomState>((state) => state.room);

  const dieRef1 = useRef<DieElement>();
  const dieRef2 = useRef<DieElement>();

  console.log(room);
  // Mount
  useEffect(() => {
    socket.emit('room_info');

    return () => socket.emit('room_leave');
  }, []);

  // Room update
  const prevRoomRef = useRef<RoomState>();
  useEffect(() => {
    const prevRoom = prevRoomRef.current;

    if (room.error) {
      router.replace('/');
      return;
    }

    if (!prevRoom?.ready && room.ready) {
      const dice = [num1, num2];

      if (room.data.dice[0] != null && room.data.dice[1] != null) {
        if (dice[0] == null && dice[1] == null) {
          setNum1(room.data.dice[0]);
          setNum2(room.data.dice[1]);
          setRollTime(room.data.rollTime);
          dieRef1.current?.roll?.();
          dieRef2.current?.roll?.();

          timeout(() => {
            setRolling(false);
          }, 2000);
        } else if (
          !_.isEqual(dice, room.data.dice) ||
          (rollTime && room.data.rollTime != rollTime)
        ) {
          setNum1(room.data.dice[0]);
          setNum2(room.data.dice[1]);
          setRollTime(room.data.rollTime);

          dieRef1.current?.roll?.();
          dieRef2.current?.roll?.();

          timeout(() => {
            setRolling(false);
          }, 2000);
        }
      }
    }
  }, [room]);

  const handleKickPlayer = (ply: Player) => {
    console.log('Kicking player', ply.name);

    socket.emit('room_kick_player', { id: ply.id });
  };

  const handleGiveTurn = (ply: Player) => {
    console.log('Giving turn to player', ply.name);

    socket.emit('room_give_turn', { id: ply.id });
  };

  if (!room.ready) {
    return (
      <div tw="bg-dtek h-screen flex justify-center items-center ">
        <Loader color="white" size="5rem" thickness="0.5em" />
      </div>
    );
  } else if (room.error) {
    return (
      <div tw="bg-dtek h-screen flex justify-center items-center">
        <Heading size="xl" tw="text-white font-bold">
          You are not part of this room
        </Heading>
      </div>
    );
  }

  const viewState: RoomViewState = {
    num1,
    num2,
    room,
    rolling,
    setRolling
  };
  const content = room.host ? (
    <HostView
      state={viewState}
      {...{ dieRef1, dieRef2 }}
      onKickPlayer={handleKickPlayer}
      onGiveTurn={handleGiveTurn}
    />
  ) : (
    <PlayerView state={viewState} {...{ dieRef1, dieRef2 }} />
  );

  return (
    <div tw="bg-dtek h-screen relative">
      <div tw="absolute top-0 inset-x-0 p-2">
        <Heading size="2xl" tw="text-center text-white tracking-widest uppercase">
          Dödsman
        </Heading>
      </div>

      {content}
    </div>
  );
};

export default RoomPage;
