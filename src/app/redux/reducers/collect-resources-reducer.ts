import { cardCollection } from './../../game/cards/card';
import { addResources } from "./resources-reducer";
import { IState } from "../interfaces";
import { nextTurn } from "./next-turn-reducer";
import { clearTile } from "./tile-reducer";
import { Card } from "../../game/cards/card";
import { getCardByFamily } from './getCardByFamily-reducer';

export function collectResources(newState: IState): IState {
    let leftover: number = addResources(newState, newState.tileClicked)

    if (newState.tileClicked.card.collected == leftover) return newState;

    if (leftover) {
        newState.tileClicked.card.collected = leftover;

        /* let lvl: number = Math.floor(leftover / 9)+2;

        newState.tileClicked.card = getCardByFamily(newState.tileClicked.card.family.name, lvl)
        newState.tileClicked.card.collected = leftover; */
    } else {
        newState.cardCollected = Object.assign({}, newState.tileClicked.card);
        newState.tileClicked.movment = { dir: 'collect', img: newState.tileClicked.card.img };
        nextTurn(newState);
        clearTile(newState.tileClicked);
    }

    return newState;
} 