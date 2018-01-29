import { IState } from './main-reducer';
import { CityLevel, GameLevel } from '../game/levels/game-level';
import { TerrainEnum } from '../enums/terrain.enum';
import { MessageType } from '../enums/message-type.enum';

export function checkIfLevelCompleted(state: IState): IState {
    let newState = state;

    //city level
    if (newState.population >= newState.cityLevel.goal) {
        let temp: string = newState.cityLevel.name;
        newState.cityLevel = new CityLevel(newState.cityLevel);
        newState.currentMessage = { title: "Congratulations!", isWow:true,delay:5000,
        message: "your " + temp + " is now " + newState.cityLevel.name, type: MessageType.CURTAIN }
    }

    //game goal level
    if (newState.level.goal.population && newState.population >= newState.level.goal.population) {
        newState.level = new GameLevel(newState.level);
    }

    if (newState.level.goal.building) {
        let foundGoal: any = newState.tiles.find(a => a.card && a.card.family.name == newState.level.goal.building.type)
        if (foundGoal) newState.level = new GameLevel(newState.level);
    }

    if (newState.level.goal.roads) {
        let foundGoal: any = newState.tiles.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD);
        if (foundGoal) newState.level = new GameLevel(newState.level);
    }

    if (newState.level.goal.resources) {
        let foundGoal: any = (
            (newState.resources.bricks >= newState.level.goal.resources.bricks) &&
            (newState.resources.lumber >= newState.level.goal.resources.lumber) &&
            (newState.resources.coins >= newState.level.goal.resources.coins)
        );
        if (foundGoal) {
            newState.level = new GameLevel(newState.level);
        }
    }

    return newState;
}