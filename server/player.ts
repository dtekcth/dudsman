import { AppSocket } from '.';

const avatars = ['cocktail', 'whiskey', 'keg', 'wine'] as const;
export type AvatarType = typeof avatars[number];

class Player {
  score = 0;
  pendingDrinks = 0;
  active = false;

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

  addDrinks(drinks: number) {
    this.pendingDrinks += drinks;
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
