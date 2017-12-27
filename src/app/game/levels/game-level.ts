
export interface IGameLevelData {
    goal: number,
}




const gameLevelsData: IGameLevelData[] = [
    { goal: 5 },
    { goal: 25 },
    { goal: 50 },
    { goal: 100 },
    { goal: 200 },
    { goal: 400 },
    { goal: 800 },
    { goal: 1600 },
    { goal: 3200 },
    { goal: 6400 },
]



export class GameLevel {
    index: number = 0;
    goal: number;

    constructor(prevGameLevel: GameLevel) {
        if (prevGameLevel) {
            this.index = prevGameLevel.index + 1;
        }

        this.goal = gameLevelsData[this.index].goal;
    }
}
