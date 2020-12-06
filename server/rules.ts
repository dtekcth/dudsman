import _ from 'lodash';
import { Dice, GameStateType } from '../common/models/common';
import { mod } from '../src/utils';
import Player from './player';
import { Room, RoomManager } from './rooms';

export enum RuleType {
  Text = 'TEXT',
  Add = 'ADD',
  Multiply = 'MULTIPLY',
  Give = 'GIVE',
  Click = 'CLICK',
  Challenge = 'CHALLENGE',
  New = 'NEW'
}

export type TargetFunction = (currentPlayer: Player, players: Player[]) => Player[];

export const targetFunction = Object.freeze({
  current: (): TargetFunction => (currentPlayer) => [currentPlayer],

  relative: (offset: number): TargetFunction => (currentPlayer, players) => {
    const index = players.findIndex((ply) => ply === currentPlayer);

    if (index === -1) return [];

    const target = players[mod(index + offset, players.length)];
    return [target];
  },
  player: (): TargetFunction => (currentPlayer, players) => {
    return _.filter(players, (p) => p == currentPlayer);
  },

  all: (): TargetFunction => (currentPlayer, players) => {
    return players;
  }
});

class Rule {
  constructor(
    public name: string,
    public type: RuleType,
    public link: Link,
    public targetFunc?: TargetFunction
  ) {
    this.name = name;
    this.type = type;
    this.link = link;
    this.targetFunc = targetFunc;
  }

  getName() {
    return this.name;
  }

  matches(dice: Dice) {
    return this.link.matches(dice);
  }

  execute(manager: RoomManager, room: Room, currentPlayer: Player, players: Player[]) {}
}

class TextRule extends Rule {
  constructor(name: string, link: Link, target: Player, public text: string) {
    super(name, RuleType.Text, link);

    this.text = text;
  }
}

class AddRule extends Rule {
  constructor(name: string, link: Link, targetFunc: TargetFunction, public num: number) {
    super(name, RuleType.Add, link, targetFunc);

    this.num = num;
  }

  execute(manager: RoomManager, room: Room, currentPlayer: Player, players: Player[]) {
    if (!this.targetFunc) return;

    const filtered = this.targetFunc(currentPlayer, players);
    console.log(filtered);

    _.each(filtered, (p) => {
      p.addPendingDrinks(this.num);
    });
  }
}

class MultRule extends Rule {
  constructor(name: string, link: Link, targetFunc: TargetFunction, public num: number) {
    super(name, RuleType.Multiply, link, targetFunc);

    this.num = num;
  }
}

class GiveRule extends Rule {
  public total: number = 0;

  constructor(name: string, link: Link, targetFunc: TargetFunction, public nums: number[]) {
    super(name, RuleType.Give, link, targetFunc);

    this.nums = nums;
    this.total = _.sum(nums);
  }

  execute(manager: RoomManager, room: Room, currentPlayer: Player, players: Player[]) {
    manager.setGameState(room, {
      type: GameStateType.Give,
      amount: this.nums,
      dice: room.dice,
      playerId: currentPlayer.id,
      total: this.total
    });
  }
}

class ClickRule extends Rule {
  constructor(name: string, link: Link) {
    super(name, RuleType.Click, link, targetFunction.all());
  }

  execute(manager: RoomManager, room: Room, currentPlayer: Player, players: Player[]) {
    manager.startClickGameState(room);
  }
}

class ChallengeRule extends Rule {
  constructor(name: string, link: Link, targetFunc: TargetFunction) {
    super(name, RuleType.Challenge, link, targetFunc);
  }
}

class NewRule extends Rule {
  constructor(name: string, link: Link) {
    super(name, RuleType.New, link);
  }
}

/*
 * Links
 */
class Link {
  constructor() {}

  matches(dice: Dice) {
    return false;
  }
}

class SumLink extends Link {
  constructor(public sum: number) {
    super();

    this.sum = sum;
  }

  matches(dice: Dice) {
    return _.sum(dice) == this.sum;
  }
}

class DiceLink extends Link {
  constructor(public dice: Dice) {
    super();

    this.dice = dice;
  }

  matches(dice: Dice) {
    const newDice = [...dice];

    for (let i = 0; i < this.dice.length; i++) {
      const d = this.dice[i];

      if (!_.includes(newDice, d)) return false;

      _.pullAt(
        newDice,
        _.findIndex(newDice, (n) => n == d)
      );
    }

    return true;
  }
}

class OrLink extends Link {
  constructor(public link1: Link, public link2: Link) {
    super();

    this.link1 = link1;
    this.link2 = link2;
  }

  matches(dice: Dice) {
    return this.link1.matches(dice) || this.link2.matches(dice);
  }
}

class AndLink extends Link {
  constructor(public link1: Link, public link2: Link) {
    super();

    this.link1 = link1;
    this.link2 = link2;
  }

  matches(dice) {
    return this.link1.matches(dice) && this.link2.matches(dice);
  }
}

const standardRules: Rule[] = [
  // Challenge
  new ChallengeRule('Challenge', new DiceLink([1, 2]), targetFunction.player()),

  // Snake eyes
  new GiveRule('Snake Eyes', new DiceLink([1, 1]), targetFunction.player(), [1, 1]),
  // 2 + 2 give out
  new GiveRule('Double Twos', new DiceLink([2, 2]), targetFunction.player(), [2, 2]),

  // Dödsman
  new AddRule('Dödsman', new DiceLink([3]), targetFunction.all(), 1),
  // Double Dödsman (this will trigger with normal Dödsman, therefore it only gives 2)
  new AddRule('Double Dödsman', new DiceLink([3, 3]), targetFunction.all(), 2),

  // 4 + 4 give out
  new GiveRule('Double Fours', new DiceLink([4, 4]), targetFunction.player(), [4, 4]),

  // Click rule
  new ClickRule('Click Rule', new SumLink(5)),
  // 5 + 5 give out
  new GiveRule('Double Fives', new DiceLink([5, 5]), targetFunction.all(), [5, 5]),

  // 7 ahead
  new AddRule('Seven Ahead', new SumLink(7), targetFunction.relative(1), 1),
  // 9 behind
  new AddRule('Nine Behind', new SumLink(9), targetFunction.relative(-1), 1),

  // Everyone drinks
  new AddRule('Cheers', new SumLink(10), targetFunction.all(), 1),

  // New rule
  new NewRule('New Rule', new DiceLink([6, 6]))
];

export {
  Rule,
  TextRule,
  AddRule,
  MultRule,
  GiveRule,
  ClickRule,
  ChallengeRule,
  NewRule,
  SumLink,
  DiceLink,
  OrLink,
  AndLink,
  standardRules
};
