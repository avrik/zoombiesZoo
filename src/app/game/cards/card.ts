import { Resources } from '../../enums/resources.enum';

interface ICardFamily {
  name: string;
  value: number;
}

export interface ICardData {
  mergeBy: string;
  id: number;
  level?: number;
  family: ICardFamily;
  name: string;
  type: string;
  minForNextLevel: number;
  //value: number;
  //symbol?: string;
  color?: string;
  nextCard?: ICardData;
  chance?: number;
  img?: string;
  collect?: number;
  bonus?: number;
}

export const WILD_CARD = "wild-card";
export const MATCH = "match";
export const TRAP = "trap";
export const ENEMY = "enemy";
export const WALKING = "walking";

const familyBrick: ICardFamily = { name: Resources.BLOCK, value: 10 };
const familyWheat: ICardFamily = { name: Resources.WHEAT, value: 20 };
const familyLumber: ICardFamily = { name: Resources.LUMBER, value: 30 };
const familyCoin: ICardFamily = { name: Resources.COIN, value: 50 };

const familyWall: ICardFamily = { name: Resources.WALL, value: 1000 };
const familyTower: ICardFamily = { name: Resources.TOWER, value: 2000 };
const familyHouse: ICardFamily = { name: Resources.HOUSE, value: 3000 };
const familyStorage: ICardFamily = { name: Resources.STORAGE, value: 4000 };

export const cardCityCollection: ICardData[] = [
  {
    //id: 1000, level: 0, family: familyHouse, name: Resources.HOUSE, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", img: "assets/buildings/house.png",
    id: 1000, level: 0, family: familyHouse, name: Resources.HOUSE, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", img: "assets/buildings/Wall Block.png",
    nextCard: {
      id: 1001, level: 1, family: familyHouse, name: `${Resources.HOUSE}2`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/house.png",
      nextCard: {
        id: 1002, level: 2, family: familyHouse, name: `${Resources.HOUSE}3`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/house.png",
        nextCard: {
          id: 1003, level: 3, family: familyHouse, name: `${Resources.HOUSE}4`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/house.png",
        }
      }
    }
  },

  {
    id: 2000, level: 0, family: familyWall, name: Resources.WALL, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", img: "assets/buildings/wall2.png",
    nextCard: {
      id: 2001, level: 1, family: familyWall, name: `${Resources.WALL}2`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/wall2.png",
      nextCard: {
        id: 2002, level: 2, family: familyWall, name: `${Resources.WALL}3`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/wall2.png",
        nextCard: {
          id: 2003, level: 3, family: familyWall, name: `${Resources.WALL}4`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/wall2.png",
        }
      }
    }
  },

  {
    id: 3000, level: 0, family: familyTower, name: Resources.TOWER, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", img: "assets/buildings/fortress.png",
    nextCard: {
      id: 3001, level: 1, family: familyTower, name: `${Resources.TOWER}2`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
      nextCard: {
        id: 3002, level: 2, family: familyTower, name: `${Resources.TOWER}3`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
        nextCard: {
          id: 3003, level: 3, family: familyTower, name: `${Resources.TOWER}4`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
        }
      }
    }
  },
  {
    id: 4000, level: 0, family: familyStorage, name: Resources.STORAGE, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", img: "assets/buildings/fortress.png",
    nextCard: {
      id: 4001, level: 1, family: familyStorage, name: `${Resources.STORAGE}2`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
      nextCard: {
        id: 4002, level: 2, family: familyStorage, name: `${Resources.STORAGE}3`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
        nextCard: {
          id: 4003, level: 3, family: familyStorage, name: `${Resources.STORAGE}4`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", img: "assets/buildings/fortress.png",
        }
      }
    }
  },
]

export const cardCollection: ICardData[] = [
  {
    id: 1000, level: 0, family: familyHouse, name: Resources.HOUSE, mergeBy: MATCH, type: MATCH, minForNextLevel: 3,  img: "assets/buildings/Door Tall Closed.png",
    nextCard: {
      id: 1001, level: 1, family: familyHouse, name: `${Resources.HOUSE}2`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3,  img: "assets/buildings/Door Tall Closed.png",
      nextCard: {
        id: 1002, level: 2, family: familyHouse, name: `${Resources.HOUSE}3`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3,  img: "assets/buildings/house.png",
        nextCard: {
          id: 1003, level: 3, family: familyHouse, name: `${Resources.HOUSE}4`, mergeBy: MATCH, type: MATCH, minForNextLevel: 3,  img: "assets/buildings/house.png",
        }
      }
    }
  },
  {
    id: 100, level: 0, family: familyBrick, name: Resources.ROCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#9DCAB5", chance: 100, img: "assets/resources/rock.png",
    nextCard: {
      id: 102, level: 1, family: familyBrick, name: Resources.BLOCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#AFE0C9", chance: 5, img: "assets/resources/brick.png",
      nextCard: {
        id: 103, level: 2, family: familyBrick, name: Resources.BLOCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 3, bonus: 1, color: "#AFE0C9", img: "assets/resources/bricks.png",
        nextCard: {
          id: 104, level: 3, family: familyBrick, name: Resources.BLOCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 27, bonus: 3, color: "#AFE0C9", img: "assets/resources/bricks.png",
          nextCard: {
            id: 105, level: 4, family: familyBrick, name: Resources.BLOCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 81, bonus: 9, color: "#AFE0C9", img: "assets/resources/bricks.png",
            nextCard: {
              id: 106, level: 5, family: familyBrick, name: Resources.BLOCK, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 243, bonus: 27, color: "#AFE0C9", img: "assets/resources/bricks.png",
            }
          }
        }
      }
    }
  },
  {
    id: 200, level: 0, family: familyWheat, name: Resources.WHEAT, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "rgb(222, 245, 210)", img: "assets/resources/wheat.png",
    nextCard: {
      id: 201, level: 1, family: familyWheat, name: Resources.WHEAT + '2', mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "rgb(222, 245, 210)", img: "assets/resources/wheat2.png",
      nextCard: {
        id: 202, level: 2, family: familyWheat, name: Resources.WHEAT + '2', mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 1, color: "rgb(222, 245, 210)", img: "assets/resources/bread.png",
        nextCard: {
          id: 203, level: 3, family: familyWheat, name: Resources.WHEAT + '2', mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 3, bonus: 1, color: "rgb(222, 245, 210)", img: "assets/resources/bread.png",
        }
      }
    }
  },
  {
    id: 300, level: 0, family: familyLumber, name: "seedling", mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "#FC9F5B", chance: 100, img: "assets/resources/tree.png",
    nextCard: {
      id: 301, level: 1, family: familyLumber, name: Resources.TREE, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, chance: 5, color: "#CE814A", img: "assets/resources/lumber1.png",
      nextCard: {
        id: 302, level: 2, family: familyLumber, name: Resources.LUMBER, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 3, bonus: 1, color: "#CE814A", img: "assets/resources/wood.png",
        nextCard: {
          id: 303, level: 3, family: familyLumber, name: Resources.LUMBER, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 27, bonus: 3, color: "#CE814A", img: "assets/resources/lumber3.png",
          nextCard: {
            id: 303, level: 3, family: familyLumber, name: Resources.LUMBER, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 81, bonus: 9, color: "#CE814A", img: "assets/resources/lumber3.png",
            nextCard: {
              id: 303, level: 3, family: familyLumber, name: Resources.LUMBER, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, collect: 243, bonus: 27, color: "#CE814A", img: "assets/resources/lumber3.png"
            }
          }
        }
      }
    }
  },
  {
    id: 400, level: 0, family: familyCoin, name: Resources.COIN, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, color: "gray", img: "assets/resources/coin.png"
  },
  /* {
    id: 500, level: 0, family: { name: Resources.GRAVE, value: 100 }, name: Resources.GRAVE, mergeBy:MATCH, type: MATCH, minForNextLevel: 3, color: "gray", img: "assets/resources/grave.png",
    nextCard: {
      id: -2, level: 1, family: { name: Resources.ZOOMBIE, value: 100 }, name: ENEMY, mergeBy:TRAP, type: WALKING, minForNextLevel: 3, img: "assets/resources/zoombie.gif",
      nextCard: {
        id: 1000, level: 1, family: familyCoin, name: Resources.COIN, mergeBy:MATCH, type: Resources.COIN, minForNextLevel: 3, img: "assets/resources/coin.gif"
      }
    }
  }, */

  //{ id: 0, level: 0, family: { name: Resources.PERSON, value: 0 }, name: Resources.PERSON, mergeBy:TRAP, type: WALKING, minForNextLevel: 3, color: "gray", chance: 25, img: "assets/people/Character Boy.png", },
  {
    id: -1, level: 0, family: { name: Resources.WILD, value: -1 }, name: Resources.WILD, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, img: "assets/resources/diamond.png", color: "yellow", chance: 30, 
    nextCard: {
      id: 0, level: 1, family: { name: Resources.PERSON, value: 0 }, name: Resources.PERSON, mergeBy: TRAP, type: WALKING, minForNextLevel: 3, chance: 20, img: "assets/people/pig.png",
      nextCard: {
        id: 500, level: 2, family: { name: Resources.GRAVE, value: 100 }, name: Resources.GRAVE, mergeBy: MATCH, type: MATCH, minForNextLevel: 3, img: "assets/resources/grave.png",
        nextCard: {
          id: 800, level: 3, family: { name: Resources.ZOOMBIE, value: 100 }, name: ENEMY, mergeBy: TRAP, type: WALKING, minForNextLevel: 3, img: "assets/people/zombiePig.png",
          nextCard: {
            id: 1000, level: 4, family: familyCoin, name: Resources.COIN, mergeBy: MATCH, type: Resources.COIN, minForNextLevel: 3, img: "assets/resources/coin.png"
          }
        }
      },
    },
  }
]

export class Card implements ICardData {
  level: number;
  family: ICardFamily;
  name: string;
  type: string;
  minForNextLevel: number;
  value: number;
  //symbol: string;
  color: string;
  nextCard?: ICardData;
  chance?: number;
  age: number;
  bonus: number;
  img: string;
  moved: boolean;
  collect: number;
  id: number;
  mergeBy: string;

  constructor(data: ICardData) {
    if (!data) return;
    this.id = data.id;
    this.mergeBy = data.mergeBy;
    this.level = data.level ? data.level : 0;
    this.family = data.family;
    this.name = data.name;
    this.type = data.type;
    this.age = 0;
    this.minForNextLevel = data.minForNextLevel;
    this.color = data.color;
    this.nextCard = data.nextCard;
    this.chance = data.chance;
    this.img = data.img;
    this.collect = data.collect;
    this.bonus = data.bonus ? data.bonus : 0;
    this.moved = false;
    this.value = ((this.level * 100) + this.family.value);
  }
}