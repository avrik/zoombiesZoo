
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { UrlConst } from '../../consts/url-const';
import { IResourceStorage } from 'app/redux/interfaces';
import { Card } from 'app/game/cards/card';

export interface IBuildingGoalType {
    type: number;
    level: number;
}

export interface IGoal {
    score?: number;
    population?: number;
    building?: IBuildingGoalType;
    collect?: IBuildingGoalType;
    roads?: number;
    resources?: IResourceStorage;
    amount: number;
    img: string;
    verb?: string;
}

export interface ICityLevelData {
    goal: number,
    reward: IResourceStorage;
    name: string;
}

export interface IGameLevelData {
    goal: IGoal,
    reward: IResourceStorage;
    text?: string;
}
const basePop: number = 6;

const cityLevelsData: ICityLevelData[] = [
    { name: "the wilderness", goal: basePop, reward: { coins: 1 } },//6
    { name: "camp", goal: basePop * 2 + basePop, reward: { coins: 1 } },//18
    { name: "tribe", goal: basePop * 8 + basePop, reward: { coins: 1 } },//54
    { name: "small village", goal: basePop * 16 + basePop, reward: { coins: 2 } },//134
    { name: "village", goal: basePop * 32 + basePop, reward: { coins: 2 } },//198
    { name: "small town", goal: basePop * 64 + basePop, reward: { coins: 2 } },//390
    { name: "town", goal: basePop * 128 + basePop, reward: { coins: 3 } },
    { name: "small city", goal: basePop * 256 + basePop, reward: { coins: 3 } },
    { name: "city", goal: basePop * 512 + basePop, reward: { coins: 3 } },
    { name: "metropolis", goal: basePop * 1024 + basePop, reward: { coins: 4 } },
    { name: "megapolis", goal: basePop * 2048 + basePop, reward: { coins: 5 } },//12294
]

const gameLevelsData: IGameLevelData[] = [
    { goal: { verb: "collect", img: UrlConst.BRICK_IMG, collect:{ type: CardFamilyTypeEnum.BRICK, level:2 }, amount: 3 }, reward: { coins: 1 } },
    // { goal: { verb:"build", img: UrlConst.ROAD, roads: 1, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "build", img: UrlConst.SAWMILL1, building: { type: CardFamilyTypeEnum.SAWMILL, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "build", img: UrlConst.HOUSE1, building: { type: CardFamilyTypeEnum.HOUSE, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    // { goal: { verb: "populate", img: UrlConst.PERSON1, population: 6, amount: 6 }, reward: { coins: 2 } },
    { goal: { verb: "populate", img: UrlConst.PERSON1, population: 12, amount: 12 }, reward: { coins: 2 } },
    { goal: { verb: "collect", img: UrlConst.BRICK3, collect: { type: CardFamilyTypeEnum.BRICK, level: 2 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "build", img: UrlConst.HOUSE2, building: { type: CardFamilyTypeEnum.HOUSE, level: 2 }, amount: 1 }, reward: { coins: 1 } },
    //{ goal: { verb: "build", img: UrlConst.LABORATORY, building: { type: CardFamilyTypeEnum.LABORATORY, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "build", img: UrlConst.CHURCH1, building: { type: CardFamilyTypeEnum.CHURCH, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "collect", img: UrlConst.BRICK4, collect: { type: CardFamilyTypeEnum.BRICK, level: 3 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "get", img: "", score: 100000, amount: 100000 }, reward: { coins: 3 } },
    { goal: { verb: "collect", img: UrlConst.BRICK5, collect: { type: CardFamilyTypeEnum.BRICK, level: 4 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "build", img: UrlConst.HOUSE3, building: { type: CardFamilyTypeEnum.HOUSE, level: 3 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "get", img: "", score: 300000, amount: 300000 }, reward: { coins: 3 } },
    { goal: { verb: "populate", img: UrlConst.PERSON1, population: 120, amount: 120 }, reward: { coins: 3 } },
    { goal: { verb: "get", img: "", score: 1000000, amount: 1000000 }, reward: { coins: 3 } },
    { goal: { verb: "collect", img: UrlConst.BRICK6, collect: { type: CardFamilyTypeEnum.BRICK, level: 5 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb: "get", img: "", score: 3000000, amount: 3000000 }, reward: { coins: 3 } },
]

export class CityLevel {
    index: number = 0;
    goal: number;
    reward: IResourceStorage;
    name: string;
    prevLevel:CityLevel;

    constructor(prevCityLevel: CityLevel = null) {

        /* for (let i = 0; i < 10; i++) {
            console.log(Math.floor(Math.exp((i) + basePop)));
        } */
        this.prevLevel = prevCityLevel;
        if (prevCityLevel) {
            this.index = prevCityLevel.index + 1;
        }

        if (this.index < cityLevelsData.length) {
            let levelData: ICityLevelData = cityLevelsData[this.index];
            this.goal = levelData.goal;
            //this.goal = Math.exp((this.index * basePop))
            this.reward = levelData.reward;
            this.name = levelData.name;
        } else {
            console.log('NO MORE CITY LEVELS!!!')
        }
    }
}

export class GameLevel {
    index: number = 0;
    goal: IGoal;
    reward: IResourceStorage;

    constructor(prevGameLevel: GameLevel = null) {
        if (prevGameLevel) {
            this.index = prevGameLevel.index + 1;
        }

        if (this.index < gameLevelsData.length) {
            let levelData: IGameLevelData = gameLevelsData[this.index];
            this.goal = levelData.goal;
            this.reward = levelData.reward;
        } else {
            console.log('NO MORE GAME LEVELS!!!')
        }

    }
}
