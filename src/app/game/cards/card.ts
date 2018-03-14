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
  mergeBy: number;
  level?: number;
  family: ICardFamily;
  type: number;
  minForNextLevel?: number;
  nextCard?: ICardData;
  chance?: number;
  img?: string;
  imgs?: string[];
  collect?: number;
  collected?: number;
  reward?: number;
}


const familyBrick: ICardFamily = { name: CardFamilyTypeEnum.BRICK, value: 5 };
const familyLumber: ICardFamily = { name: CardFamilyTypeEnum.LUMBER, value: 10 };
const familyCoin: ICardFamily = { name: CardFamilyTypeEnum.COIN, value: 50 };
const familyCoinSilver: ICardFamily = { name: CardFamilyTypeEnum.COIN_SILVER, value: 1 };
const familyPerson: ICardFamily = { name: CardFamilyTypeEnum.PERSON, value: 100 };

const familyRoad: ICardFamily = { label: 'road', name: CardFamilyTypeEnum.ROAD, value: 90 };
const familyHouse: ICardFamily = { label: 'house', name: CardFamilyTypeEnum.HOUSE, value: 1200 };
const familyStorage: ICardFamily = { label: 'storage', name: CardFamilyTypeEnum.STORAGE, value: 900 };
const familySawmill: ICardFamily = { label: 'sawmill', name: CardFamilyTypeEnum.SAWMILL, value: 950 };
const familyLaboratory: ICardFamily = { label: 'laboratory', name: CardFamilyTypeEnum.LABORATORY, value: 1800 };
const familyChurch: ICardFamily = { label: 'church', name: CardFamilyTypeEnum.CHURCH, value: 2700 };
const familyPalace: ICardFamily = { label: 'palace', name: CardFamilyTypeEnum.PALACE, value: 5400 };

//[3,8,27,81,243,72,2187,6561,19683,59049]
const coinCard: ICardData = { level: 0, family: familyCoin, mergeBy: MergeTypeEnum.NONE, collect: 1, type: CardTypeEnum.RESOURCE, img: UrlConst.COIN };
const coinSilverCard: ICardData = { level: 0, family: familyCoinSilver, mergeBy: MergeTypeEnum.NONE, collect: 1, type: CardTypeEnum.RESOURCE, img: UrlConst.COIN_SILVER };
//const goldChest: ICardData = { level: 1, family: { name: CardFamilyTypeEnum.GOLD_CHEST, value: 1250 }, mergeBy: MergeTypeEnum.NONE, collect: 10, type: CardTypeEnum.BUILDING, img: "assets/resources/Chest Closed.png" }

const laboratoryCard: ICardData = {
  level: 0, family: familyLaboratory, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BUILDING, img: UrlConst.LABORATORY,
}

const sawmillCard: ICardData = {
  level: 0, family: familySawmill, mergeBy: MergeTypeEnum.MATCH, collect: 12, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL1,
  nextCard: {
    level: 1, family: familySawmill, mergeBy: MergeTypeEnum.MATCH, collect: 36, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL2,
    nextCard: {
      level: 2, family: familySawmill, mergeBy: MergeTypeEnum.MATCH, collect: 108, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL3,
      nextCard: {
        level: 3, family: familySawmill, mergeBy: MergeTypeEnum.MATCH, collect: 324, type: CardTypeEnum.BUILDING, img: UrlConst.SAWMILL4,
      }
    }

  }
}

const palaceCard: ICardData = {
  level: 0, family: familyPalace, mergeBy: MergeTypeEnum.MATCH, collect: 9, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH1,
}

const churchCard: ICardData = {
  level: 0, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 3, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH1,
  nextCard: {
    level: 1, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 9, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH2,
    nextCard: {
      level: 2, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 27, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH3,
      nextCard: {
        level: 3, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 81, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH4,
        nextCard: {
          level: 4, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 243, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH5,
          nextCard: {
            level: 5, family: familyChurch, mergeBy: MergeTypeEnum.MATCH, collect: 729, type: CardTypeEnum.BUILDING, img: UrlConst.CHURCH6,
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

const tntCard: ICardData = {
  level: 0, family: { name: CardFamilyTypeEnum.BOMB, value: 0 }, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.BOMB, img: UrlConst.BOMB, collect: 3, collected: 3
}
export const cardCollection: ICardData[] = [
  {
    level: 0, family: familyRoad, mergeBy: MergeTypeEnum.NONE, type: CardTypeEnum.TERRAIN, img: ""
  },
  {
    level: 0, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 6, img: UrlConst.HOUSE1,
    nextCard: {
      level: 1, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 18, img: UrlConst.HOUSE2,
      nextCard: {
        level: 2, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 54, img: UrlConst.HOUSE3,
        nextCard: {
          level: 3, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 162, img: UrlConst.HOUSE4,
          nextCard: {
            level: 5, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 486, img: UrlConst.HOUSE5,
            nextCard: {
              level: 6, family: familyHouse, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 1458, img: UrlConst.HOUSE6,
            }
          }
        }
      }
    }
  },
  {
    level: 0, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 12, img: UrlConst.STORAGE1,
    nextCard: {
      level: 1, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 36, img: UrlConst.STORAGE2,
      nextCard: {
        level: 2, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 108, img: UrlConst.STORAGE3,
        nextCard: {
          level: 3, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 324, img: UrlConst.STORAGE4,
          nextCard: {
            level: 5, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 972, img: UrlConst.STORAGE5,
            nextCard: {
              level: 6, family: familyStorage, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.BUILDING, collect: 2916, img: UrlConst.STORAGE6,
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
          level: 3, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, reward: 1, img: UrlConst.BRICK4,
          nextCard: {
            level: 4, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, reward: 3, img: UrlConst.BRICK5,
            nextCard: {
              level: 5, family: familyBrick, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, reward: 9, img: UrlConst.BRICK6,
            }
          }
        }
      }
    }
  },
  {
    //level: 0, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, img: UrlConst.LUMBER1,
    level: 0, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 70, img: UrlConst.LUMBER1,
    nextCard: {
      //level: 1, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE,img: UrlConst.LUMBER2,
      level: 1, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 5, img: UrlConst.LUMBER2,
      nextCard: {
        level: 2, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 3, img: UrlConst.LUMBER3,
        nextCard: {
          level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 9, reward: 1, img: UrlConst.LUMBER4,
          nextCard: {
            level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 27, reward: 3, img: UrlConst.LUMBER5,
            nextCard: {
              level: 3, family: familyLumber, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, collect: 81, reward: 9, img: UrlConst.LUMBER6
            }
          }
        }
      }
    }
  },
  { level: 0, family: familyPerson, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 5, imgs: [UrlConst.PERSON1, UrlConst.PERSON2, UrlConst.PERSON3, UrlConst.PERSON4] },
  {
    level: 0, family: { name: CardFamilyTypeEnum.WILD, value: -1 }, mergeBy: MergeTypeEnum.MATCH, type: CardTypeEnum.RESOURCE, chance: 10, img: UrlConst.WILD,
    nextCard: graveCard,
  },
  {
    level: 1, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 0, img: UrlConst.ANIMAL,
    //level: 1, family: { name: CardFamilyTypeEnum.ANIMAL, value: 0 }, mergeBy: MergeTypeEnum.TRAP, type: CardTypeEnum.WALKER, chance: 15, img: UrlConst.ANIMAL,
    nextCard: graveCard,
  },
  zoombieCard,
  coinCard,
  coinSilverCard,
  graveCard,
  tntCard,
  sawmillCard,
  laboratoryCard,
  palaceCard
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
  reward: number;
  img: string;
  collect: number;
  id: number;
  mergeBy: number;
  collected: number;
  state: number = 0;
  autoPlaced: boolean = false;
 // preTile: Tile;

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
    this.img = data.imgs ? data.imgs[Math.floor(Math.random() * data.imgs.length)] : data.img;
    this.collect = data.collect ? data.collect : 0;
    this.reward = data.reward ? data.reward : 0;
    this.value = (Math.max((this.level * this.level * 10), 1) * this.family.value);
    this.collected = data.collected ? data.collected : 0;
  }

  toString() {
    return JSON.stringify(this);
  }
}