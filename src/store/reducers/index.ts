import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers, Reducer, Store } from 'redux';
import roomReducer, { RoomState } from './room';

export interface ServerState {}

/* Create state interface */
export interface AppState {
  room: RoomState;
  server: ServerState;
}

/* Declare union types */
export type AppStore = Store<AppState, AppAction>;
export type AppAction = AnyAction;

export type ServerAction = AnyAction;

const serverReducer: Reducer<ServerState> = (state = {}) => state;

// Reducer for room data

/* Define reducers */
export const reducers: Reducer<AppState, AppAction> = combineReducers<AppState, AppAction>({
  room: roomReducer,
  server: serverReducer
});

const rootReducer = (state: AppState | undefined, action: AppAction): AppState => {
  switch (action.type) {
    case HYDRATE:
      const { _firebase, _firestore, ..._newState } = action.payload;

      return {
        ...(state as AppState),
        server: {
          ...state?.server,
          ...action.payload.server
        }
      };
  }

  return reducers(state, action);
};

export default rootReducer;
