
import { CityLevel, GameLevel } from '../game/levels/game-level';
import { TerrainEnum } from '../enums/terrain.enum';
import { MessageType } from '../enums/message-type.enum';
import { addResources } from 'app/redux/resources-reducer';
import { CardFamilyTypeEnum } from '../enums/card-family-type-enum.enum';
import { Card } from 'app/game/cards/card';
import { state } from '@angular/core';
import { IState } from './interfaces';
import { getNewCard } from 'app/redux/common-reducer';

export function checkIfLevelCompleted(state: IState): IState {
    let newState = state;
    let newGameLevel:GameLevel;

    //city level
    if (newState.population >= newState.cityLevel.goal) {
        let temp: string = newState.cityLevel.name;
        let newCityLevel: CityLevel = new CityLevel(newState.cityLevel);
        newState.cityLevel = newCityLevel
        newState.currentMessage = {
            title: "Congratulations!", isWow: true, delay: 5000,
            message: "your " + temp + " is now " + newState.cityLevel.name, type: MessageType.CURTAIN
        }

        if (newCityLevel.reward) {
            if (newCityLevel.reward.coins) {
                //for (let i = 0; i < newCityLevel.reward.coins; i++) {
                let coinCard: Card = getNewCard(CardFamilyTypeEnum.COIN);
                coinCard.collected = newCityLevel.reward.coins;
                newState.tiles.find(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card).card = coinCard
                //}
            }
        }
    }

    //game goal level
    if (newState.level.goal.score && newState.score >= newState.level.goal.score) {
        newGameLevel = new GameLevel(newState.level);
    }

    if (newState.level.goal.population && newState.population >= newState.level.goal.population) {
        newGameLevel = new GameLevel(newState.level);
    }

    if (newState.level.goal.building) {
        let foundGoal: any = newState.tiles.find(a => a.card && a.card.family.name == newState.level.goal.building.type)
        if (foundGoal) newGameLevel = new GameLevel(newState.level);
    }

    if (newState.level.goal.roads) {
        let foundGoal: any = newState.tiles.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD);
        if (foundGoal) newGameLevel = new GameLevel(newState.level);
    }

    if (newState.level.goal.resources) {
        let foundGoal: any = (
            (newState.resources.bricks >= newState.level.goal.resources.bricks) &&
            (newState.resources.lumber >= newState.level.goal.resources.lumber) &&
            (newState.resources.coins >= newState.level.goal.resources.coins)
        );
        if (foundGoal) {
            newGameLevel = new GameLevel(newState.level);
        }
    }

    if (newGameLevel) {

        newState.currentMessage = {
            type: MessageType.CURTAIN, title: "Well done! ", message: `achievement ${newGameLevel.index} completed!\n${newGameLevel.reward.coins} coin rewarded`
            , butns: [{ label: 'next level' }]
        };
        newState.level = newGameLevel;
    }

    
    return newState;
}