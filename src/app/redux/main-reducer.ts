
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
import { PLACE_CARD_ON_TILE_ACTION, GENERATE_WORLD_ACTION, NEW_GAME_ACTION, COLLECT_RESOURCES_ACTION, INIT_GAME_ACTION, CLICK_TILE, PLACE_CARD_ON_STASH_ACTION, PLACE_BUILDING, UNDO_ACTION, SET_NEXT_CARD, MOVE_BUILDING_ACTION, PLACE_MOVE_BUILDING_ACTION } from './actions/actions';
import { generateWorld, findMatch, moveWalkers, getNextCard, nextTurn } from 'app/redux/board-reducer';
import { addResources, removeFromResourcesSawmill } from 'app/redux/resources-reducer';
import { clickTileOnBoard, getNewCard } from './board-reducer';
import { IBuyItem } from '../game/tile-buy-popup/buy-item/buy-item';
import { removeFromResourcesStorage } from './resources-reducer';
import { UrlConst } from '../consts/url-const';
import { IMessage } from 'app/services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { CityLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { clearTile } from './tile-reducer';

export class MainReducer {

}

export interface IAction {
    payload: any;
    type: string;
}

export interface IState {
    pendingMoveCard: Card;
    tiles: Tile[];
    tileClicked: Tile;
    nextCard: Card;
    cardHint: Card;
    level: GameLevel;
    cityLevel: CityLevel;
    resources: IResourceStorage;
    turn: number;
    score: number;
    population: number;
    prevState: IState;
    floatTile: Tile;
    cityBuyItems: IBuyItem[];
    currentMessage: IMessage;
    gameOver: boolean;
}

const initState: IState = {
    gameOver: false,
    tiles: [],
    turn: 0,
    tileClicked: null,
    pendingMoveCard: null,
    nextCard: null,
    cardHint: null,
    level: new GameLevel(),
    cityLevel: new CityLevel(),
    resources: { bricks: 0, lumber: 0, coins: 0, maxStorage: 0 },
    score: 0,
    population: 0,
    prevState: null,
    floatTile: null,
    cityBuyItems: [
        { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
        { label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
        { label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
        { label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.SAWMILL, description: "cathedrals are used to trap the undead" },
        { label: 'laboratory', cost: { block: 18, lumber: 6, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.LABORATORY, description: "cathedrals are used to trap the undead" },
        { label: 'church', cost: { block: 21, lumber: 12, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
    ],
    currentMessage: null
}


let prevGameState: IState;
let states: IState[] = []
export let currentGameState: IState;

export function mainReducerFunc(state: IState = initState, action: IAction): IState {
    prevGameState = Object.assign({}, state);
    let newState: IState = Object.assign({}, state);
    currentGameState = newState;


    states.push(newState);
    newState.currentMessage = null;

    let tile: Tile;
    if (action.payload && action.payload instanceof Tile) {
        tile = action.payload;
    }

    console.info('new action ' + action.type);

    switch (action.type) {
        case "from_saved":
            return action.payload;

        case INIT_GAME_ACTION:
            newState = Object.assign({}, initState);
            newState.tiles = generateWorld(11, 5);
            newState.nextCard = getNextCard();
            return newState;

        case NEW_GAME_ACTION:

            newState.floatTile = newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
            return newState;

        case PLACE_CARD_ON_STASH_ACTION:
            stashCard(newState, tile);
            return newState;

        case PLACE_BUILDING:
            newState.tileClicked = action.payload.tile;
            if (buyBuilding(newState, action.payload.buyItem)) {
                nextTurn(newState);
            }
            return newState;

        case SET_NEXT_CARD:
            if (action.payload) newState.nextCard = getNewCard(action.payload);
            return newState;

        case CLICK_TILE:
            newState.tileClicked = tile;
            clickTileOnBoard(newState);
            nextTurn(newState);
            newState.nextCard = getNextCard();
            return newState;

        case COLLECT_RESOURCES_ACTION:
            if (addResources(newState, tile, tile.card.collected))
            {
                newState.tileClicked = tile;
                nextTurn(newState);
            }
            
            return newState;

        case PLACE_MOVE_BUILDING_ACTION:
            //moveTileBuilding(newState, tile);
            tile.card = newState.pendingMoveCard;
            newState.pendingMoveCard = null;
            newState.tiles.forEach(a => a.state = TileState.REGULAR);
            return newState;

        case MOVE_BUILDING_ACTION:
            moveTileBuilding(newState, tile);
            return newState;

        case UNDO_ACTION:
            //return prevGameState;
            return states[states.length - 2];
        default:
            return newState;
    }
}


function stashCard(newState: IState, tile: Tile) {
    let temp: Card = tile.card;
    tile.card = newState.nextCard;
    newState.nextCard = temp ? temp : getNextCard();
}

function moveTileBuilding(newState: IState, tile: Tile) {
    newState.tiles.forEach(a => a.state = TileState.DISABLED);

    let moveOptions: Tile[] = newState.tiles.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card);
    moveOptions.forEach(a => { a.state = TileState.WAIT_FOR_MOVE });
    newState.pendingMoveCard = Object.assign({}, tile.card);
    clearTile(tile);
}

function buyBuilding(newState: IState, buyItem: IBuyItem): boolean {

    if (buyItem.type == CardFamilyTypeEnum.ROAD) {
        newState.tileClicked.terrainTop = new Terrain(TerrainEnum.ROAD)
    }
    else {
        let roadNear = newState.tileClicked.linked.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD)
        if (buyItem.type == CardFamilyTypeEnum.HOUSE && !roadNear) {
            newState.currentMessage = { title: "houses needs roads!", type: MessageType.TOOLBAR }
            return false;
        }

        newState.tileClicked.card = getNewCard(buyItem.type);
        findMatch(newState.tileClicked);
        //newState.score += newState.tileClicked.card.value;
    }

    newState.resources.coins -= buyItem.cost.coin;
    if (buyItem.cost.block) {
        removeFromResourcesStorage(newState, buyItem.cost.block);
    }

    if (buyItem.cost.lumber) {
        removeFromResourcesSawmill(newState, buyItem.cost.lumber);
    }

    return true;
}






