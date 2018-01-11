import { IResourceStorage } from "app/services/game-engine.service";

export interface IGameLevelData {
    goal: number,
    reward: IResourceStorage;
}

const gameLevelsData: IGameLevelData[] = [
    { goal: 6, reward: { coins: 1 } },
    { goal: 18, reward: { coins: 1 } },
    { goal: 42, reward: { coins: 1 } },
    { goal: 90, reward: { coins: 2 } },
    { goal: 186, reward: { coins: 2 } },
    { goal: 378, reward: { coins: 2} },
    { goal: 762, reward: { coins: 3 } },
    { goal: 1530, reward: { coins: 3 } },
    { goal: 3066, reward: { coins: 3 } },
    { goal: 6138, reward: { coins: 4 } },
]

export class GameLevel {
    index: number = 0;
    goal: number;
    reward:IResourceStorage;
    constructor(prevGameLevel: GameLevel) {
        if (prevGameLevel) {
            this.index = prevGameLevel.index + 1;
        }

        this.goal = gameLevelsData[this.index].goal;
        this.reward = gameLevelsData[this.index].reward;
    }
}
