import { Reducer } from 'redux';

export interface RoomState {
  error?: string;
  data: any;
  joined: boolean;
  ready: boolean;
  playerId?: string;
  host: boolean;
}

const roomReducer: Reducer<RoomState> = (
  state = {
    data: {},
    joined: false,
    ready: false,
    host: false
  },
  action
) => {
  switch (action.type) {
    case 'ROOM_UPDATE':
      return {
        ...state,
        error: action.error,
        data: action.data || {},
        joined: action.joined,
        ready: action.ready
      };

    case 'ROOM_HOST':
      return {
        ...state,
        host: action.host
      };

    case 'ROOM_RESET':
      return {
        ...state,
        error: null,
        data: {},
        joined: false,
        ready: false,
        host: false
      };

    case 'PLAYER_ID':
      return {
        ...state,
        playerId: action.id
      };
    default:
      return state;
  }
};

export default roomReducer;
