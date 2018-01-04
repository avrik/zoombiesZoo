import { Tile } from './../board/tile/tile';
import { UrlConst } from './../../consts/url-const';
import { MergeTypeEnum } from '../../enums/merge-type-enum.enum';
import { CardTypeEnum } from '../../enums/card-type-enum.enum';
import { ResourceEnum } from '../../enums/resource-enum.enum';
import { BuildingEnum } from '../../enums/building-enum.enum';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';

interface ICardFamily {
  name: number;
  label?: string;
  value: number;
}

export interface ICardData {
  mergeBy: number;
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
const familyPerson: ICardFamily = { name: CardFamilyTypeEnum.PERSON, value: 100 };

const familyRoad: ICardFamily = { label: 'road', name: CardFamilyTypeEnum.ROAD, value: 90 };
const familyHouse: ICardFamily = { label: 'house', name: CardFamilyTypeEnum.HOUSE, value: 1200 };
const familyStorage: ICardFamily = { label: 'storage', name: CardFamilyTypeEnum.STORAGE, value: 900 };
const familyChurch: ICardFamily = { label: 'church', name: CardFamilyTypeEnum.CHURCH, value: 5000 };

//[3,8,27,81,243,72,2187,6561,19683,59049]
const coinCard: ICardData = { level: 0, family: familyCoin, mergeBy: MergeTypeEnum.MATCH, collect: 1, type: CardTypeEnum.RESOURCE, img: UrlConst.COIN };
//const goldChest: ICardData = { level: 1, family: { name: CardFamilyTypeEnum.GOLD_CHEST, value: 1250 }, mergeBy: MergeTypeEnum.NONE, collect: 10, type: CardTypeEnum.BUILDING, img: "assets/resources/Chest Closed.png" }
const churchCard: ICardData = {
  level: 0, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 1, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH1,
  nextCard: {
    level: 1, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 6, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH2,
    nextCard: {
      level: 2, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 24, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH3,
      nextCard: {
        level: 3, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 84, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH4,
        nextCard: {
          level: 4, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 241, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH5,
          nextCard: {
            level: 5, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 723, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH6,
          }
        }
      }
    }
  }
}

const zoombieCard: ICardData = {
  level: 3, family: { name: CardFamilyTypeEnum.ZOOMBIE, value: 0 }, mergeBy: MergeTypeEnum.TRAP_IN_CITY, type: CardTypeEnum.WALKER, img: UrlConst.ZOOMBIE,
}

const graveCard: ICardData = {
  level: 2, family: { name: CardFamilyTypeEnum.GRAVE, value: 1 }, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, img: UrlConst.GRAVE,
  nextCard: zoombieCard
}

export const cardCollection: ICardData[] = [
  /* {
     level: 0, family: familyWall, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BUILDING, img: ""
  }, */
  {
    level: 0, family: familyRoad, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.TERRAIN, img: ""
  },
  {
    level: 0, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 6, img: UrlConst.HOUSE1,
    nextCard: {
      level: 1, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 24, img: UrlConst.HOUSE2,
      nextCard: {
        level: 2, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 78, img: UrlConst.HOUSE3,
        nextCard: {
          level: 3, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 300, img: UrlConst.HOUSE4,
          nextCard: {
            level: 5, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 1200, img: UrlConst.HOUSE5,
            nextCard: {
              level: 6, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 3000, img: UrlConst.HOUSE6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 27, img: UrlConst.STORAGE1,
    nextCard: {
      level: 1, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 81, img: UrlConst.STORAGE2,
      nextCard: {
        level: 2, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 243, img: UrlConst.STORAGE3,
        nextCard: {
          level: 3, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 729, img: UrlConst.STORAGE4,
          nextCard: {
            level: 5, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 5000, img: UrlConst.STORAGE5,
            nextCard: {
              level: 6, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 15000, img: UrlConst.STORAGE6,
            }
          }
        }
      }
    }
  },
  churchCard,
  {
    level: 0, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 100, img: UrlConst.BRICK1,
    nextCard: {
      level: 1, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 5, img: UrlConst.BRICK2,
      nextCard: {
        level: 2, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 3, img: UrlConst.BRICK3,
        nextCard: {
          level: 3, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, bonus: 1, img: UrlConst.BRICK4,
          nextCard: {
            level: 4, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, bonus: 3, img: UrlConst.BRICK5,
            nextCard: {
              level: 5, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, bonus: 9, img: UrlConst.BRICK6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 70, img: UrlConst.LUMBER1,
    nextCard: {
      level: 1, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 5, img: UrlConst.LUMBER2,
      nextCard: {
        level: 2, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 3, img: UrlConst.LUMBER3,
        nextCard: {
          level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, bonus: 1, img: UrlConst.LUMBER4,
          nextCard: {
            level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, bonus: 3, img: UrlConst.LUMBER5,
            nextCard: {
              level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, bonus: 9, img: UrlConst.LUMBER6
            }
          }
        }
      }
    }
  },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: UrlConst.PERSON1, },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: UrlConst.PERSON2, },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: UrlConst.PERSON3, },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: UrlConst.PERSON4, },
  {
    level: 0, family: { name: CardFamilyTypeEnum.WILD, value: -1 }, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 30, img: UrlConst.WILD,
    nextCard: graveCard,
  },
  {
    level: 1, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 20, img: UrlConst.ANIMAL,
    nextCard: graveCard,
  },
  zoombieCard,
  coinCard,
  graveCard,
  //goldChest
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
  autoPlaced: boolean = false;
  preTile: Tile;

  constructor(data: ICardData) {
    if (!data) return;

    this.mergeBy = data.mergeBy;
    this.level = data.level ? data.level : 0;
    this.family = data.family;
    this.type = data.type;
    this.age = 0;
    this.minForNextLevel = data.minForNextLevel ? data.minForNextLevel : 3;
    this.nextCard = data.nextCard;
    this.chance = data.chance;
    this.img = data.img;
    this.collect = data.collect ? data.collect : 0;
    this.bonus = data.bonus ? data.bonus : 0;
    this.moved = false;
    this.value = (Math.max((this.level * this.level * 10), 1) * this.family.value);
    this.collected = 0;
  }
}