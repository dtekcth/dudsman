import { AppSocket } from '.';
import { CommonModels } from '../common/models';
import { avatars, AvatarType } from '../common/models/common';

class Player implements CommonModels.Player {
  score = 0;
  pendingDrinks = 0;
  active = false;
  clickCount = 0;

  public avatar: AvatarType;
  public socket: AppSocket;

  constructor(public name: string, public id: string, socket: AppSocket) {
    this.name = name;
    this.id = id;
    this.setSocket(socket);

    this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
  }

  setSocket(socket: AppSocket) {
    this.socket = socket;
  }

  addScore(score: number) {
    this.score += score;
  }

  addPendingDrinks(drinks: number) {
    this.pendingDrinks += drinks;
  }

  resetPendingDrinks() {
    this.pendingDrinks = 0;
  }

  setActive(active: boolean) {
    this.active = active;
  }

  serialize() {
    return {
      id: this.id,
      score: this.score,
      active: this.active,
      name: this.name,
      avatar: this.avatar
    };
  }
}

export default Player;
