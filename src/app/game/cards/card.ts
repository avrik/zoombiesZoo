import { Tile } from './../board/tile/tile';
import { UrlConst } from './../../consts/url-const';
import { MergeTypeEnum } from '../../enums/merge-type-enum.enum';
import { CardTypeEnum } from '../../enums/card-type-enum.enum';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';

interface ICardFamily {
  name: number;
  label?: string;
  value: number;
}

export interface ICardData {
  mergeBy?: number;
  level?: number;
  family: ICardFamily;
  type?: number;
  minForNextLevel?: number;
  nextCard?: ICardData;
  chance?: number;
  img?: string;
  imgs?: string[];
  imgOptions?: string[];
  collect?: number;
  collected?: number;
  reward?: number;
  availableFromLevel?: number;
}

const familyBrick: ICardFamily = { name: CardFamilyTypeEnum.BRICK, value: 5 };
const familyLumber: ICardFamily = { name: CardFamilyTypeEnum.LUMBER, value: 12 };
const familyCoin: ICardFamily = { name: CardFamilyTypeEnum.COIN, value: 100 };
const familyCoinSilver: ICardFamily = { name: CardFamilyTypeEnum.COIN_SILVER, value: 1 };
const familyOil: ICardFamily = { name: CardFamilyTypeEnum.OIL, value: 500 };

const familyPerson: ICardFamily = { name: CardFamilyTypeEnum.PERSON, value: 100 };
//const familyPersonHoly: ICardFamily = { name: CardFamilyTypeEnum.PERSON_HOLY, value: 300 };
//const familyPersonRoyal: ICardFamily = { name: CardFamilyTypeEnum.PERSON_ROYAL, value: 900 };

const familyRoad: ICardFamily = { label: 'road', name: CardFamilyTypeEnum.ROAD, value: 90 };
const familyHouse: ICardFamily = { label: 'house', name: CardFamilyTypeEnum.HOUSE, value: 1200 };
const familyStorage: ICardFamily = { label: 'storage', name: CardFamilyTypeEnum.STORAGE, value: 900 };
const familySawmill: ICardFamily = { label: 'sawmill', name: CardFamilyTypeEnum.SAWMILL, value: 950 };
const familyLaboratory: ICardFamily = { label: 'laboratory', name: CardFamilyTypeEnum.LABORATORY, value: 1800 };
const familyChurch: ICardFamily = { label: 'church', name: CardFamilyTypeEnum.CHURCH, value: 2700 };
const familyPalace: ICardFamily = { label: 'palace', name: CardFamilyTypeEnum.PALACE, value: 5400 };

//[3,8,27,81,243,72,2187,6561,19683,59049]
const coinCard: ICardData = { level: 0, family: familyCoin, mergeBy: MergeTypeEnum.NONE, collect: 1, img: UrlConst.COIN };
const coinSilverCard: ICardData = { level: 0, family: familyCoinSilver, mergeBy: MergeTypeEnum.NONE, collect: 1, img: UrlConst.COIN_SILVER };
//const goldChest: ICardData = { level: 1, family: { name: CardFamilyTypeEnum.GOLD_CHEST, value: 1250 }, mergeBy: MergeTypeEnum.NONE, collect: 10, type: CardTypeEnum.BUILDING, img: "assets/resources/Chest Closed.png" }

const bonesCard: ICardData = {
  level: 3, family: familyOil, img: UrlConst.BONES,
  nextCard: {
    level: 4, family: familyOil, img: UrlConst.OIL1,
    nextCard: {
      level: 5, family: familyOil, collect: 100, img: UrlConst.OIL2,
      nextCard: {
        level: 6, family: familyOil, collect: 900, img: UrlConst.OIL3
      }
    }
  }
}

/* const zoombieCard: ICardData = {
  level: 3, family: { name: CardFamilyTypeEnum.ZOOMBIE, value: 0 }, mergeBy: MergeTypeEnum.TRAP_IN_CITY, type: CardTypeEnum.WALKER, img: UrlConst.ZOOMBIE,
} */

const graveCard: ICardData = {
  level: 0, family: { name: CardFamilyTypeEnum.GRAVE, value: 1 }, img: UrlConst.GRAVE,
  nextCard: bonesCard
  //nextCard: zoombieCard
}

const tntCard: ICardData = {
  level: 0, family: { name: CardFamilyTypeEnum.BOMB, value: 0 }, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BOMB, img: UrlConst.BOMB, collect: 3, collected: 3
}
export const cardCollection: ICardData[] = [
  /* {
    level: 0, family: familyLaboratory, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BUILDING, img: UrlConst.LABORATORY,
  }, */
  {
    level: 0, family: familyRoad, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.TERRAIN, img: ""
  },
  {
    level: 0, family: familyPalace, collect: 3, type: CardTypeEnum.BUILDING, img: UrlConst.PALACE,
  },
  {
    level: 0, family: familyChurch, collect: 3, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH1,
    nextCard: {
      level: 1, family: familyChurch, collect: 9, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH2,
      nextCard: {
        level: 2, family: familyChurch, collect: 27, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH3,
        nextCard: {
          level: 3, family: familyChurch, collect: 81, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH4,
          nextCard: {
            level: 4, family: familyChurch, collect: 243, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH5,
            nextCard: {
              level: 5, family: familyChurch, collect: 729, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 6, img: UrlConst.HOUSE1,
    nextCard: {
      level: 1, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 18, img: UrlConst.HOUSE2,
      nextCard: {
        level: 2, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 54, img: UrlConst.HOUSE3,
        nextCard: {
          level: 3, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 162, img: UrlConst.HOUSE4,
          nextCard: {
            level: 5, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 486, img: UrlConst.HOUSE5,
            nextCard: {
              level: 6, family: familyHouse, type: CardTypeEnum.BUILDING, collect: 1458, img: UrlConst.HOUSE6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 12, img: UrlConst.STORAGE1,
    nextCard: {
      level: 1, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 36, img: UrlConst.STORAGE2,
      nextCard: {
        level: 2, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 108, img: UrlConst.STORAGE3,
        nextCard: {
          level: 3, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 324, img: UrlConst.STORAGE4,
          nextCard: {
            level: 5, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 972, img: UrlConst.STORAGE5,
            nextCard: {
              level: 6, family: familyStorage, type: CardTypeEnum.BUILDING, collect: 2916, img: UrlConst.STORAGE6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familySawmill, collect: 12, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL1,
    nextCard: {
      level: 1, family: familySawmill, collect: 36, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL2,
      nextCard: {
        level: 2, family: familySawmill, collect: 108, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL3,
        nextCard: {
          level: 3, family: familySawmill, collect: 324, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL4,
        }
      }
    }
  },
  {
    level: 0, family: familyBrick, chance: 100, img: UrlConst.BRICK1, imgOptions: [UrlConst.BRICK1, UrlConst.BRICK1_2],
    nextCard: {
      level: 1, family: familyBrick, chance: 5, img: UrlConst.BRICK2, imgs: [UrlConst.BRICK2, UrlConst.BRICK2_2],
      nextCard: {
        level: 2, family: familyBrick, collect: 3, img: UrlConst.BRICK3, imgs: [UrlConst.BRICK3, UrlConst.BRICK3_4, UrlConst.BRICK3_5, UrlConst.BRICK3_6],
        nextCard: {
          level: 3, family: familyBrick, collect: 9, reward: 1, img: UrlConst.BRICK4,
          nextCard: {
            level: 4, family: familyBrick, collect: 27, reward: 3, img: UrlConst.BRICK5,
            nextCard: {
              level: 5, family: familyBrick, collect: 81, reward: 9, img: UrlConst.BRICK6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyLumber, chance: 70, img: UrlConst.LUMBER1, imgOptions: [UrlConst.LUMBER1, UrlConst.LUMBER1_2],
    nextCard: {
      level: 1, family: familyLumber, chance: 5, img: UrlConst.LUMBER2, imgs: [UrlConst.LUMBER2, UrlConst.LUMBER2_2],
      nextCard: {
        level: 2, family: familyLumber, collect: 3, img: UrlConst.LUMBER3, imgs: [UrlConst.LUMBER3, UrlConst.LUMBER3_4, UrlConst.LUMBER3_5, UrlConst.LUMBER3_6],
        nextCard: {
          level: 3, family: familyLumber, collect: 9, reward: 1, img: UrlConst.LUMBER4,
          nextCard: {
            level: 4, family: familyLumber, collect: 27, reward: 3, img: UrlConst.LUMBER5,
            nextCard: {
              level: 5, family: familyLumber, collect: 81, reward: 9, img: UrlConst.LUMBER6
            }
          }
        }
      }
    }
  },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 5, img: UrlConst.PERSON1, imgOptions: [UrlConst.PERSON1, UrlConst.PERSON2, UrlConst.PERSON3, UrlConst.PERSON4] },
  { level: 1, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 2, img: UrlConst.PERSON_HOLY1 },
  { level: 2, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 1, img: UrlConst.PERSON_ROYAL1 },
  {
    level: 0, family: { name: CardFamilyTypeEnum.WILD, value: -1 }, chance: 10, img: UrlConst.WILD
   // nextCard: graveCard,
  },
  {
    level: 0, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, img: UrlConst.ANIMAL, availableFromLevel: 2, chance: 0, imgOptions: [UrlConst.ANIMAL, UrlConst.ANIMAL2],
    //level: 1, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 15, img: UrlConst.ANIMAL,
    nextCard: graveCard,
  },
  bonesCard,
  coinCard,
  coinSilverCard,
  graveCard,
  tntCard,
]

export class Card implements ICardData {
  availableFromLevel: number;
  level: number;
  family: ICardFamily;
  type: number;
  minForNextLevel: number;
  value: number;
  nextCard?: ICardData;
  chance?: number;
  age: number;
  reward: number;
  img: string;
  collect: number;
  id: number;
  mergeBy: number;
  collected: number;
  state: number = 0;
  autoPlaced: boolean = false;
  energyCost: number = 1;
  showDelay: number = 0;
  // preTile: Tile;

  constructor(data: ICardData, imgIndex: number = -1) {
    if (!data) return;

    this.availableFromLevel = data.availableFromLevel || 0;
    this.mergeBy = data.mergeBy || MergeTypeEnum.MATCH;
    this.level = data.level || 0;
    this.family = data.family;
    this.type = data.type || CardTypeEnum.RESOURCE;

    if (this.type == CardTypeEnum.BUILDING) {
      this.energyCost = 5;
    }

    this.age = 0;
    this.minForNextLevel = data.minForNextLevel || 3;
    this.nextCard = data.nextCard;

    this.chance = data.chance;

    if (data.imgOptions) {
      this.img = data.imgOptions[Math.floor(Math.random() * data.imgOptions.length)];
    } else
      if (data.imgs && imgIndex >= 0) {
        this.img = data.imgs[imgIndex];
      } else {
        this.img = data.img;
      }

    this.collect = data.collect || 0;
    this.reward = data.reward || 0;
    this.value = (Math.max((this.level * this.level * 10), 1) * this.family.value);
    this.collected = data.collected || 0;
  }

  toString() {
    return JSON.stringify(this);
  }
}