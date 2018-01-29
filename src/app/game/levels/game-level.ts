import { IResourceStorage } from "app/services/game-engine.service";
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { UrlConst } from '../../consts/url-const';

export interface IBuildingGoalType {
    type: number;
    level: number;
}

export interface IGoal {
    score?: number;
    population?: number;
    building?: IBuildingGoalType;
    roads?: number;
    resources?: IResourceStorage;
    amount: number;
    img: string;
    verb?:string;
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
const cityLevelsData: ICityLevelData[] = [
    { name: "tribe", goal: 6, reward: { coins: 1 } },
    { name: "village", goal: 24, reward: { coins: 1 } },
    { name: "town", goal: 56, reward: { coins: 1 } },
    { name: "city", goal: 168, reward: { coins: 2 } },
    { name: "metropolis", goal: 336, reward: { coins: 2 } },
    { name: "megapolis", goal: 772, reward: { coins: 3 } },
]

const gameLevelsData: IGameLevelData[] = [
    { goal: { verb:"collect", img: UrlConst.BRICK2, resources: { bricks: 3, lumber: 0, coins: 0 }, amount: 3 }, reward: { coins: 1 } },
    // { goal: { verb:"build", img: UrlConst.ROAD, roads: 1, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb:"build", img: UrlConst.SAWMILL1, building: { type: CardFamilyTypeEnum.SAWMILL, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb:"build", img: UrlConst.HOUSE1, building: { type: CardFamilyTypeEnum.HOUSE, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb:"populate", img: UrlConst.PERSON1, population: 6, amount: 6 }, reward: { coins: 2 } },
    { goal: { verb:"populate", img: UrlConst.PERSON1, population: 18, amount: 18 }, reward: { coins: 2 } },
    { goal: { verb:"build", img: UrlConst.HOUSE2, building: { type: CardFamilyTypeEnum.HOUSE, level: 2 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb:"build", img: UrlConst.CHURCH1, building: { type: CardFamilyTypeEnum.CHURCH, level: 1 }, amount: 1 }, reward: { coins: 1 } },
    { goal: { verb:"get", img: "", score: 100000, amount: 100000 }, reward: { coins: 3 } },
    { goal: { verb:"get", img: "", score: 300000, amount: 300000 }, reward: { coins: 3 } },
    { goal: { verb:"get", img: "", score: 1000000, amount: 1000000 }, reward: { coins: 3 } },
]

export class CityLevel {
    index: number = 0;
    goal: number;
    reward: IResourceStorage;
    name:string

    constructor(prevCityLevel: CityLevel = null) {
        if (prevCityLevel) {
            this.index = prevCityLevel.index + 1;
        }

        if (this.index < cityLevelsData.length) {
            let levelData: ICityLevelData = cityLevelsData[this.index];
            this.goal = levelData.goal;
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
