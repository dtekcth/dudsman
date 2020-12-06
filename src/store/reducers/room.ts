import { Reducer } from 'redux';
import { Dice, GameState } from '../../../common/models/common';
import Player from '../../../server/player';
import { PopupState } from '../../components/Popup';

export type ClientRoom = {
  rollTime: number;
  dice: Dice;
  code: string;
  players: Player[];
  turn?: string;
  gameState: GameState;
};

export interface RoomState {
  error?: string;
  data?: ClientRoom;
  joined: boolean;
  ready: boolean;
  playerId?: string;
  host: boolean;
  popup?: PopupState;
}

const roomReducer: Reducer<RoomState> = (
  state = {
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

    case 'ROOM_POPUP':
      return {
        ...state,
        popup: action.popup
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
