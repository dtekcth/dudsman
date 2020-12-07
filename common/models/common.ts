import { CommonModels } from '.';
import { Rule } from '../../server/rules';

export type Dice = number[];

export enum PopupType {
  GameLost = 'GAME_LOST',
  Drink = 'DRINK',
  Give = 'GIVE',
  ClickGameFinished = 'CLICK_GAME_FINISHED',
  NotImplemented = 'NOT_IMPLEMENTED'
}

export const avatars = ['cocktail', 'whiskey', 'keg', 'wine', 'slots'] as const;
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
  Give = 'GIVE',
  Click = 'Click'
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
      delay?: number;
    }
  | {
      type: GameStateType.Click;
      count: number;
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
      message?: string;
      dice: Dice;
    }
  | {
      type: PopupType.Give;
      delay?: number;
      amount: number[];
      total: number;
      playerId: string;
    }
  | {
      type: PopupType.ClickGameFinished;
      delay?: number;
      message: string;
      drinks: number;
      dice: Dice;
    }
  | {
      type: PopupType.NotImplemented;
      delay?: number;
      message: string;
      dice: Dice;
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
