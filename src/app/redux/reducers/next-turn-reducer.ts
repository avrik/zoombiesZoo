import { IState } from "../interfaces";
import { moveWalkers } from "./move-walkers-reducer";
import { checkBombs } from "./check-bombs-reducer";
import { CardTypeEnum } from "../../enums/card-type-enum.enum";
import { CardState } from "../../enums/card-state.enum";
import { Tile } from "../../game/board/tile/tile";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { checkIfLevelCompleted } from "./levels-reducer";
import { TerrainEnum } from "../../enums/terrain.enum";
import { getFloatTile } from "./tile-reducer";
import { message_game_over } from "./messages-reducer";
import { Messages } from "../../enums/messages.enum";
import { MessageType } from "../../enums/message-type.enum";
import { Action } from "../actions/action.enum";


export function nextTurn(newState: IState) {
    newState.currentMessage = null;
    newState.turn++;

    moveWalkers(newState);
    checkBombs(newState);

    newState.tiles.filter(a => a.card).forEach(b => {
        if (b.card.type == CardTypeEnum.WALKER) b.card.state = CardState.REGULAR;
        b.card.age++;
    })
    newState.floatTile = getFloatTile(newState);

    let houses: Tile[] = newState.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE)
    if (houses.length) {
        newState.population = houses.map(a => a.card.collected).reduce((prev, cur) => prev + cur);
    }

    newState.score += newState.tileClicked.card ? newState.tileClicked.card.value : 0;

    checkIfLevelCompleted(newState);
    checkIfGameOver(newState);
}

function checkIfGameOver(newState: IState) {
    let relevantTiles: Tile[] = newState.tiles.filter(a => !a.terrain.locked && !a.card);
    let emptyInCity: number = relevantTiles.filter(a => a.terrain.type == TerrainEnum.CITY).length;
    let emptyInResources: number = relevantTiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES).length;

    if (!emptyInCity || !emptyInResources) {
        newState.gameOver = true;


        let years = Math.round(newState.turn / 360) + 1;
        let days = newState.turn;

        let message: string = `Nice JOB! \n your kingdom lasted for ${days} days. you reached the population of ${newState.population}, and got ${newState.score} score`;
 
        newState.currentMessage = { type: MessageType.POPUP, title: Messages.GAME_OVER_TITLE, message: message, butns: [{ label: Messages.GAME_OVER_BUTN1,actionType:Action.RESTART_GAME}] }
    }
}