import _ from 'lodash';
import { AppSocket } from '.';
import { CommonModels } from '../common/models';
import { avatars, AvatarType } from '../common/models/common';

/* prettier-ignore */
const avatarMap: {
  [avatar in AvatarType]: (RegExp | string)[];
} = {
  slots: [
    /^delta/, 'slots', 'najs',
    // Delta 18
    'brev', 'azco', 'nora', 'gustav', 'gutsfav', 'lurre', 'algot',

    // Delta 19
    'bella', 'adler', 'greven', 'tbobbe', 'poly', 'vidar',

    // Delta 20
    'zelda', 'herman', 'aw', 'windisch', 'älgen', 'sjöcrona'
  ],
  whiskey: [],
  cocktail: [],
  keg: [],
  wine: []
};

const avatarFilter: Set<AvatarType> = new Set(['slots']);

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

    const checkName = name.toLowerCase();
    _.forEach(avatarMap, (map, avatar: AvatarType) => {
      _.forEach(avatarMap[avatar], (match) => {
        if ((_.isRegExp(match) && checkName.match(match)) || match === checkName) {
          this.avatar = avatar;

          return false;
        }
      });
      if (this.avatar) return false;
    });

    if (!this.avatar) {
      const list = avatars.filter((a) => !avatarFilter.has(a));

      this.avatar = list[Math.floor(Math.random() * list.length)];
    }
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
