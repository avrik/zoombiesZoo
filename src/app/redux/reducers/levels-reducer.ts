import { GameLevel, CityLevel } from "../../game/levels/game-level";
import { IState } from "../interfaces";
import { getCardByFamily } from "./getCardByFamily-reducer";
import { Card } from "../../game/cards/card";
import { MessageType } from "../../enums/message-type.enum";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { TerrainEnum } from "../../enums/terrain.enum";

export function checkIfLevelCompleted(state: IState): IState {
    let newState = state;
    let newGameLevel: GameLevel;

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
                let coinCard: Card = getCardByFamily(CardFamilyTypeEnum.COIN);
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
        //let foundGoal: any = newState.tiles.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD);
        let foundGoal: any = newState.tiles.find(a => a.terrain.type == TerrainEnum.ROAD);
        if (foundGoal) newGameLevel = new GameLevel(newState.level);
    }

    if (newState.level.goal.collect) {

        let foundGoal: any = (
            (
                newState.cardCollected && newState.cardCollected.family &&
                newState.cardCollected.family.name == newState.level.goal.collect.type &&
                newState.cardCollected.level >= newState.level.goal.collect.level
            )
        );
        if (foundGoal) {
            newGameLevel = new GameLevel(newState.level);
        }
    }

    if (newGameLevel) {

        newState.currentMessage = {
            type: MessageType.CURTAIN, title: "Well done! ", message: `achievement ${newGameLevel.index} completed!\n${newGameLevel.reward.coins} silver coin rewarded`
            , butns: [{ label: 'next level' }]
        };
        newState.level = newGameLevel;

        if (newGameLevel.reward) {
            if (newGameLevel.reward.coins) {
                let coinCard: Card = getCardByFamily(CardFamilyTypeEnum.COIN_SILVER);
                coinCard.collected = newGameLevel.reward.coins;
                newState.tiles.find(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card).card = coinCard
            }
        }
    }





    return newState;
}