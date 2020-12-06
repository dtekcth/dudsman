import { DieElement } from '../components/Die';
import { RoomState } from '../store/reducers/room';

export interface RoomViewState {
  num1: number;
  num2: number;
  room: RoomState;
  rolling: boolean;
  setRolling: (rolling: boolean) => void;
}

export interface RoomViewProps {
  dieRef1: React.RefObject<DieElement>;
  dieRef2: React.RefObject<DieElement>;
  state: RoomViewState;
}
