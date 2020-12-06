import { CommonModels } from '.';
import { Rule } from '../../server/rules';

export type Dice = number[];

export enum PopupType {
  GameLost = 'GAME_LOST',
  Drink = 'DRINK',
  Give = 'GIVE'
}

export const avatars = ['cocktail', 'whiskey', 'keg', 'wine'] as const;
export type AvatarType = typeof avatars[number];

export interface Player {
  id: string;
  name: string;
  score: number;
  pendingDrinks: number;
  active: boolean;
  avatar: AvatarType;
}

export enum GameStateType {
  Playing = 'IDLE',
  Give = 'GIVE'
}

export type GameState =
  | {
      type: GameStateType.Playing;
    }
  | {
      type: GameStateType.Give;
      playerId: string;
      amount: number[];
      dice: CommonModels.Dice;
      total: number;
    };

export interface Room {
  players: Player[];
  activePlayers: Player[];
  turn?: string;
  dice: Dice;
  destroyed: boolean;
  gameState: GameState;
  rollTime: Date;
}

export type PopupState =
  | {
      type: PopupType.GameLost;
      delay?: number;
      message: string;
      drinks: number;
      dice: Dice;
    }
  | {
      type: PopupType.Drink;
      delay?: number;
      drinks: number;
      dice: Dice;
    }
  | {
      type: PopupType.Give;
      delay?: number;
      amount: number[];
      total: number;
      playerId: string;
    };

export type PopupResult =
  | {
      type: PopupType.GameLost;
    }
  | {
      type: PopupType.Drink;
    }
  | {
      type: PopupType.Give;
      targetIds: string[];
    };

export const POPUP_STANDARD_DELAY = 2.5;
