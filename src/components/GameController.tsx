import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import socket from '../socket';
import { roomUpdate, playerUpdateId, socketUpdate, roomOpenPopup } from '../store/actions';
import { PopupState } from './Popup';

const GameController: React.FC = () => {
  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('room_info', (data) => {
      if (data.error) {
        dispatch(roomUpdate(data.error, data, false, true));
        return;
      }

      dispatch(roomUpdate(null, data, true, true));
    });

    socket.on('room_popup', (state: PopupState) => {
      dispatch(roomOpenPopup(state));
    });

    socket.on('player_id', (data) => {
      dispatch(playerUpdateId(data.id));
    });

    socket.on('connect', () => {
      const state = store.getState();

      dispatch(
        socketUpdate(null, {
          reconnecting: false,
          connected: true
        })
      );

      if (state.room.ready && state.room.joined && state.room.playerId) {
        socket.emit('room_reconnect', {
          id: state.room.playerId,
          code: state.room.data.code
        });
      }
    });

    socket.on('reconnecting', (attemptNumber) => {
      dispatch(
        socketUpdate(null, {
          reconnecting: true,
          connected: false
        })
      );
    });

    socket.on('disconnect', () => {
      dispatch(
        socketUpdate(null, {
          connected: false
        })
      );
    });
  }, []);

  return null;
};

export default GameController;
