import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import 'twin.macro';
import Player from '../../../server/player';
import { DieElement } from '../../components/Die';
import Heading from '../../components/Heading';
import Loader from '../../components/Loader';
import socket from '../../socket';
import { AppState } from '../../store/reducers';
import { RoomState } from '../../store/reducers/room';
import { useTimeout } from '../../utils';
import { ClientModels } from '../../models';
import HostView from '../../components/views/HostView';
import PlayerView from '../../components/views/PlayerView';

const RoomPage = () => {
  const router = useRouter();

  const [num1, setNum1] = useState<number>();
  const [num2, setNum2] = useState<number>();
  const [rollTime, setRollTime] = useState<number>();
  const timeout = useTimeout();
  const [rolling, setRolling] = useState<boolean>(false);

  const room = useSelector<AppState, RoomState>((state) => state.room);

  const dieRef1 = useRef<DieElement>();
  const dieRef2 = useRef<DieElement>();

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
    socket.emit('room_kick_player', { id: ply.id });
  };

  const handleGiveTurn = (ply: Player) => {
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

  const viewState: ClientModels.RoomViewState = {
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
