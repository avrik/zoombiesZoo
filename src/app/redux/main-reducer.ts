import { IResourceStorage } from 'app/services/game-engine.service';
import { GameLevel } from './../game/levels/game-level';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { cardCollection, ICardData, Card } from './../game/cards/card';
import { NEXT_CARD_ACTION, SET_TILES_CARD_ACTION, GENERATE_WORLD_ACTION, ADD_RESOURCES_ACTION, NEXT_LEVEL_ACTION, ADD_TO_POPULATION, NEW_GAME_ACTION } from './actions/actions';
import { IState } from './initialState';

export class MainReducer {

}

export interface IState {
    tiles: any[];
    tileClicked: Tile;
    nextCard: Card;
    level: GameLevel;
    resources: IResourceStorage;
    turn: number;
    score: number;
    population: number;
}

export interface IAction {
    payload: any;
    type: string;
}

const initState: IState = {
    tiles: [],
    turn: 0,
    tileClicked: null,
    nextCard: null,
    level: new GameLevel(),
    resources: { bricks: 0, lumber: 0, coins: 0, maxStorage: 0 },
    score: 0,
    population: 0
}

export function mainReducerFunc(state: IState = initState, action: IAction) {
    let newState: IState = Object.assign({}, state)
    switch (action.type) {
        case NEW_GAME_ACTION:
            return newState;

        case ADD_TO_POPULATION:
            newState.population = action.payload;
            return newState;

        case NEXT_LEVEL_ACTION:
            newState.level = new GameLevel(newState.level);
            return newState;

        case ADD_RESOURCES_ACTION:
            newState.resources = Object.assign({}, action.payload);
            return newState;

        case GENERATE_WORLD_ACTION:
            newState.tiles = [...action.payload];
            return newState;

        case NEXT_CARD_ACTION:
            let rand: number = Math.round(Math.random() * 100);
            let pickFrom: ICardData[] = [];
            cardCollection.filter(item => item.chance).forEach(a => {
                pickFrom.push(a);
                if (a.nextCard && a.nextCard.chance) {
                    pickFrom.push(a.nextCard);
                }
            })

            pickFrom = pickFrom.filter(item => item.chance >= rand)
            let randCard: ICardData = pickFrom[Math.floor(Math.random() * (pickFrom.length))];

            newState.nextCard = new Card(randCard);
            return newState;

        case SET_TILES_CARD_ACTION:

            // this.roundCompleted = false;

            let card: Card = newState.nextCard;
            let tile: Tile = action.payload;
            if (card.family.name != CardFamilyTypeEnum.ROAD) {

                tile.setCard(card);
                /* if (tile.card.mergeBy == MergeTypeEnum.MATCH) {
                  this.findMatch(tile);
                } */
            }

            /* this.moveWalkers();
            this.gameState.tiles.filter(tile => tile.card && tile.card.state == CardState.REGULAR).forEach(tile => tile.card.state = CardState.DONE);
            this.checkBombs();
        
            this.updateBoard();
        
            this.gameState.turn++;
            this._years$.next(this.gameState.turn); */
            //newState.tiles.filter(tile => tile.card && tile.card.state == CardState.REGULAR).forEach(tile => tile.card.state = CardState.DONE);
            newState.turn++;
            newState.tileClicked = tile;
            return newState
        default:
            return newState
    }
}
