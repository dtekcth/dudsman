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

  const dispatch = useDispatch();
  const room = useSelector<AppState, RoomState>((state) => state.room);

  const handleEnterRoom = useCallback((data) => {
    console.log(data);
    dispatch(roomReset());
    setEntering(true);

    socket.emit('room_enter', data, (err?: Error, success?: boolean) => {
      console.log(success);
      setEntering(false);
      if (success) {
        router.push('/room/' + data.code);
      }
    });
  }, []);

  const handleCreateRoom = useCallback(() => {
    dispatch(roomReset());

    socket.emit('room_create', {}, (err?: Error, code?: boolean) => {
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
          {room?.error && <RoomError error={room.error} />}

          <input
            name="name"
            tw="bg-gray-200 rounded p-3 w-full focus:outline-none"
            placeholder="Name"
            ref={register({
              required: true
            })}
            defaultValue="Najs"
          />

          <InputMask
            name="code"
            tw="bg-gray-200 rounded p-3 w-full focus:outline-none"
            inputRef={register({
              required: true
            })}
            mask="9999"
            maskChar={null}
            placeholder="Room code"
            defaultValue="0000"
          />

          <Button tw="w-full" loading={entering}>
            Enter room
          </Button>
        </form>

        <div tw="mx-auto bg-white p-5 mt-4">
          <Button tw="w-full" onClick={handleCreateRoom}>
            Create room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
