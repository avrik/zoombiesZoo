
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { IResourceStorage } from 'app/services/game-engine.service';
import { GameLevel } from './../game/levels/game-level';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { cardCollection, ICardData, Card } from './../game/cards/card';
import { NEXT_TURN_ACTION, PLACE_CARD_ON_TILE_ACTION, GENERATE_WORLD_ACTION, ADD_RESOURCES_ACTION, NEXT_LEVEL_ACTION, ADD_TO_POPULATION, NEW_GAME_ACTION, COLLECT_RESOURCES_ACTION } from './actions/actions';
import { generateWorld, findMatch, moveWalkers } from 'app/redux/board-reducer';
import { addResources } from 'app/redux/resources-reducer';

export class MainReducer {

}

export interface IAction {
    payload: any;
    type: string;
}

export interface IState {
    tiles: Tile[];
    tileClicked: Tile;
    nextCard: Card;
    level: GameLevel;
    resources: IResourceStorage;
    turn: number;
    score: number;
    population: number;
    prevState: IState;
    floatTile: Tile;
}

const initState: IState = {
    tiles: [],
    turn: 0,
    tileClicked: null,
    nextCard: null,
    level: new GameLevel(),
    resources: { bricks: 0, lumber: 0, coins: 0, maxStorage: 0 },
    score: 0,
    population: 0,
    prevState: null,
    floatTile: null,
}


function getNextCard(): Card {
    let rand: number = Math.round(Math.random() * 100);
    let pickFrom: ICardData[] = [];
    cardCollection.filter(item => item.chance).forEach(a => {
        pickFrom.push(a);
        if (a.nextCard && a.nextCard.chance) {
            pickFrom.push(a.nextCard);
        }
    })

    pickFrom = pickFrom.filter(item => item.chance >= rand)
    let randCard: ICardData = pickFrom[Math.floor(Math.random() * pickFrom.length)];

    return new Card(randCard);
}


export function mainReducerFunc(state: IState = initState, action: IAction): IState {

    let newState: IState = Object.assign({}, state);
    let tile: Tile;
    if (action.payload && action.payload instanceof Tile) {
        tile = action.payload;
    }
    console.log('new action ' + action.type);
    // console.log('new state '+newState);
    switch (action.type) {
        case "from_saved":
            return action.payload;
        case NEW_GAME_ACTION:
            newState.tiles = generateWorld(11, 5);
            newState.nextCard = getNextCard();
            newState.floatTile = newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
            return newState;

        case ADD_TO_POPULATION:
            newState.population = action.payload;
            return newState;

        case NEXT_LEVEL_ACTION:
            newState.level = new GameLevel(newState.level);
            return newState;

        case NEXT_TURN_ACTION:
            newState.prevState = state;
            return newState;

        case PLACE_CARD_ON_TILE_ACTION:

            if (newState.nextCard.family.name != CardFamilyTypeEnum.ROAD) {
                tile.setCard(newState.nextCard);
            }
            newState.turn++;
            newState.tileClicked = tile;
            newState.tiles = moveWalkers(newState.tiles);
            findMatch(tile);
            newState.nextCard = getNextCard();
            let found:Tile = newState.tileClicked.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES)
            newState.floatTile = found?found:newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
            return newState;

        case "undo":
            return newState.prevState;

        case COLLECT_RESOURCES_ACTION:

            tile = action.payload;
            newState.resources = addResources(newState, tile.card.family.name, tile.card.collect);
            tile.clear();
            return newState;
        case ADD_RESOURCES_ACTION:
            newState.resources = Object.assign({}, action.payload);
            return newState;
        default:
            return newState;
    }
}







