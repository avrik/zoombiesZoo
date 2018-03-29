import { addResources } from "./resources-reducer";
import { IState } from "../interfaces";
import { nextTurn } from "./next-turn-reducer";
import { clearTile } from "./tile-reducer";

export function collectResources(newState: IState): IState {
    let leftover: number = addResources(newState, newState.tileClicked)
    if (leftover) {
        newState.tileClicked.card.collected = leftover;
    } else {
        newState.cardCollected = Object.assign({}, newState.tileClicked.card);
        newState.tileClicked.movment = { dir: 'collect', img: newState.tileClicked.card.img };
        nextTurn(newState);
        clearTile(newState.tileClicked);
    }

    return newState;
} 