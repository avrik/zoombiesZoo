import { MergeTypeEnum } from '../../enums/merge-type-enum.enum';
import { CardTypeEnum } from '../../enums/card-type-enum.enum';
import { ResourceEnum } from '../../enums/resource-enum.enum';
import { BuildingEnum } from '../../enums/building-enum.enum';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';

interface ICardFamily {
  name: number;
  value: number;
}

export interface ICardData {
  mergeBy: number;
  id: number;
  level?: number;
  family: ICardFamily;
  type: number;
  minForNextLevel?: number;
  nextCard?: ICardData;
  chance?: number;
  img?: string;
  collect?: number;
  bonus?: number;
}


const familyBrick: ICardFamily = { name: CardFamilyTypeEnum.BRICK, value: 5 };
const familyLumber: ICardFamily = { name: CardFamilyTypeEnum.LUMBER, value: 10 };
const familyCoin: ICardFamily = { name: CardFamilyTypeEnum.COIN, value: 50 };

const familyRoad: ICardFamily = { name: CardFamilyTypeEnum.ROAD, value: 200 };
const familyWall: ICardFamily = { name: CardFamilyTypeEnum.WALL, value: 500 };
const familyTower: ICardFamily = { name: CardFamilyTypeEnum.TOWER, value: 2000 };
const familyHouse: ICardFamily = { name: CardFamilyTypeEnum.HOUSE, value: 1000 };
const familyStorage: ICardFamily = { name: CardFamilyTypeEnum.STORAGE, value: 1500 };


const coinCard: ICardData = { id: 400, level: 0, family: familyCoin, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, img: "assets/resources/coin.png" };

const zoombieCard: ICardData = {
  id: -100, level: 3, family: { name: CardFamilyTypeEnum.ZOOMBIE, value: 0 }, mergeBy: MergeTypeEnum.TRAP_IN_CITY, type: CardTypeEnum.WALKER, img: "assets/people/zombiePig.png",
  nextCard: coinCard
}

const graveCard: ICardData = {
  id: 500, level: 2, family: { name: CardFamilyTypeEnum.GRAVE, value: 100 }, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, img: "assets/resources/grave.png",
  nextCard: zoombieCard
}


export const cardCollection: ICardData[] = [
  {
    id: 500, level: 0, family: familyWall, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BUILDING, img: ""
  },
  {
    id: 500, level: 0, family: familyRoad, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BUILDING, img: ""
  },
  {
    id: 1000, level: 0, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 6, img: "assets/buildings/house.png",
    nextCard: {
      id: 1001, level: 1, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 24, bonus:3, img: "assets/buildings/house2.png",
      nextCard: {
        id: 1002, level: 2, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 78, bonus:6, img: "assets/buildings/house3.png",
        nextCard: {
          id: 1003, level: 3, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 300, bonus:9, img: "assets/buildings/house3.png",
          nextCard: {
            id: 1004, level: 5, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 1200, bonus:12, img: "assets/buildings/house3.png",
            nextCard: {
              id: 1005, level: 6, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 3000, bonus:15, img: "assets/buildings/house3.png",
            }
          }
        }
      }
    }
  },
  {
    id: 2000, level: 0, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 27, img: "assets/buildings/storage.png",
    nextCard: {
      id: 2001, level: 1, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 54, bonus:3,img: "assets/buildings/storage.png",
      nextCard: {
        id: 2002, level: 2, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 150,bonus:6, img: "assets/buildings/storage.png",
        nextCard: {
          id: 2003, level: 3, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 450,bonus:9, img: "assets/buildings/storage.png",
          nextCard: {
            id: 2004, level: 5, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 5000, bonus:12,img: "assets/buildings/storage.png",
            nextCard: {
              id: 2005, level: 6, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 15000,bonus:15, img: "assets/buildings/storage.png",
            }
          }
        }
      }
    }
  },
  {
    id: 100, level: 0, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 100, img: "assets/resources/rock.png",
    nextCard: {
      id: 102, level: 1, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 5, img: "assets/resources/brick.png",
      nextCard: {
        id: 103, level: 2, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 3, img: "assets/resources/bricks.png",
        nextCard: {
          id: 104, level: 3, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, bonus: 1, img: "assets/resources/bricks.png",
          nextCard: {
            id: 105, level: 4, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, bonus: 3, img: "assets/resources/bricks.png",
            nextCard: {
              id: 106, level: 5, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, bonus: 9, img: "assets/resources/bricks.png",
            }
          }
        }
      }
    }
  },
  {
    id: 300, level: 0, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 70, img: "assets/resources/tree.png",
    nextCard: {
      id: 301, level: 1, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 5, img: "assets/resources/lumber1.png",
      nextCard: {
        id: 302, level: 2, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 3, img: "assets/resources/wood.png",
        nextCard: {
          id: 303, level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, bonus: 1, img: "assets/resources/lumber3.png",
          nextCard: {
            id: 303, level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, bonus: 3, img: "assets/resources/lumber3.png",
            nextCard: {
              id: 303, level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, bonus: 9, img: "assets/resources/lumber3.png"
            }
          }
        }
      }
    }
  },
  { id: 0, level: 0, family: { name: CardFamilyTypeEnum.PERSON, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: "assets/people/Character Boy.png", },
  { id: 0, level: 0, family: { name: CardFamilyTypeEnum.PERSON, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: "assets/people/Character Cat Girl.png", },
  { id: 0, level: 0, family: { name: CardFamilyTypeEnum.PERSON, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: "assets/people/Character Horn Girl.png", },
  { id: 0, level: 0, family: { name: CardFamilyTypeEnum.PERSON, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: "assets/people/Character Pink Girl.png", },
  {
    id: -1, level: 0, family: { name: CardFamilyTypeEnum.WILD, value: -1 }, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 30, img: "assets/resources/diamond.png",
    nextCard: {
      id: 0, level: 1, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: "assets/people/pig.png",
      nextCard: graveCard,
    },
  },
  zoombieCard,
  coinCard,
  graveCard,
]



export class Card implements ICardData {
  level: number;
  family: ICardFamily;
  type: number;
  minForNextLevel: number;
  value: number;
  nextCard?: ICardData;
  chance?: number;
  age: number;
  bonus: number;
  img: string;
  moved: boolean;
  collect: number;
  id: number;
  mergeBy: number;
  collected: number;
  state: string = "inactive";
  autoPlaced:boolean=false;

  constructor(data: ICardData) {
    if (!data) return;
    this.id = data.id;
    this.mergeBy = data.mergeBy;
    this.level = data.level ? data.level : 0;
    this.family = data.family;
    this.type = data.type;
    this.age = 0;
    this.minForNextLevel = data.minForNextLevel ? data.minForNextLevel : 3;
    this.nextCard = data.nextCard;
    this.chance = data.chance;
    this.img = data.img;
    this.collect = data.collect;
    this.bonus = data.bonus ? data.bonus : 0;
    this.moved = false;
    this.value = (Math.max((this.level * this.level*10),1) * this.family.value);
    this.collected = 0;
  }
}