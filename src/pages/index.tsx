import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'twin.macro';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import Heading from '../components/Heading';
import socket from '../socket';
import { roomHost, roomReset } from '../store/actions';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { AppState } from '../store/reducers';
import { RoomState } from '../store/reducers/room';
import RoomError from '../components/RoomError';

const HomePage = () => {
  const router = useRouter();
  const [entering, setEntering] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>();

  const dispatch = useDispatch();
  const room = useSelector<AppState, RoomState>((state) => state.room);

  const handleEnterRoom = useCallback((data) => {
    dispatch(roomReset());

    setEntering(true);
    setError(undefined);

    socket.emit('room_enter', data, (err?: Error, success?: boolean) => {
      setEntering(false);

      if (success) {
        router.push('/room/' + data.code);
      } else {
        setError('not_found');
      }
    });
  }, []);

  const handleCreateRoom = useCallback(() => {
    dispatch(roomReset());

    setCreating(true);
    setError(undefined);

    socket.emit('room_create', {}, (err?: Error, code?: boolean) => {
      setCreating(false);

      if (err) {
        console.error(err);
        return;
      }

      dispatch(roomHost(true));

      router.push('/room/' + code);
    });
  }, []);

  const { handleSubmit, register } = useForm();

  return (
    <div tw="bg-dtek h-screen flex justify-center items-center">
      <div tw="w-full max-w-xs">
        <Heading size="2xl" tw="text-center text-white tracking-widest uppercase">
          Dödsman
        </Heading>

        <form tw="mx-auto bg-white p-5 mt-1 space-y-2" onSubmit={handleSubmit(handleEnterRoom)}>
          {(error ?? room?.error) && <RoomError error={error ?? room.error} />}

          <input
            name="name"
            tw="bg-gray-200 rounded p-3 w-full focus:outline-none"
            placeholder="Name"
            ref={register({
              required: true
            })}
            maxLength={8}
          />

          <input
            name="code"
            tw="bg-gray-200 rounded p-3 w-full focus:outline-none"
            ref={register({
              required: true
            })}
            placeholder="Room code"
            maxLength={4}
          />

          <Button tw="w-full" loading={entering}>
            Enter room
          </Button>
        </form>

        <div tw="mx-auto bg-white p-5 mt-4">
          <Button tw="w-full" onClick={handleCreateRoom} loading={creating}>
            Create room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
