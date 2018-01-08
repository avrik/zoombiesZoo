import { IResourceStorage } from "app/services/game-engine.service";


export interface IGameLevelData {
    goal: number,
    reward: IResourceStorage;
}




const gameLevelsData: IGameLevelData[] = [
    { goal: 6, reward: { coins: 1 } },
    { goal: 18, reward: { coins: 1 } },
    { goal: 54, reward: { coins: 1 } },
    { goal: 108, reward: { coins: 1 } },
    { goal: 200, reward: { coins: 1 } },
    { goal: 400, reward: { coins: 1 } },
    { goal: 800, reward: { coins: 1 } },
    { goal: 1600, reward: { coins: 1 } },
    { goal: 3200, reward: { coins: 1 } },
    { goal: 6400, reward: { coins: 1 } },
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
