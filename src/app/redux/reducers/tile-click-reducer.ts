import { IState } from "./../interfaces";
import { getCardByFamily } from "./../reducers/getCardByFamily-reducer";
import { MergeTypeEnum } from "../../enums/merge-type-enum.enum";
import { TerrainEnum } from "../../enums/terrain.enum";
import { findMatch } from "./find-match-reducer";

export function clickTile(state: IState): IState {
    let newState: IState = state;
    if (!newState.tileClicked) return newState;

    if (newState.tileClicked.terrain && newState.tileClicked.terrain.type == TerrainEnum.CARD_HOLDER) {
        if (newState.tileClicked.card) {
            let temp = Object.assign({}, newState.tileClicked.card);
            newState.tileClicked.card = getCardByFamily(newState.nextCard.family.name);
            newState.nextCard = temp;
        } else {
            newState.tileClicked.card = getCardByFamily(newState.nextCard.family.name);
        }
    } else {
        newState.tileClicked.card = newState.nextCard;
        newState.energy -= newState.tileClicked.card.energyCost;
        if (newState.tileClicked.card.mergeBy == MergeTypeEnum.MATCH) {
            findMatch(newState.tileClicked);
        }

    }
    

    return newState;
}




