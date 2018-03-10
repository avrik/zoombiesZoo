
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { GameLevel } from './../game/levels/game-level';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { cardCollection, ICardData, Card } from './../game/cards/card';
import { generateWorld, findMatch, moveWalkers } from 'app/redux/board-reducer';
import { addResources, removeFromResourcesSawmill } from 'app/redux/reducers/resources-reducer';
import { clickTileOnBoard, checkBombs } from './board-reducer';
import { removeFromResourcesStorage } from './reducers/resources-reducer';
import { UrlConst } from '../consts/url-const';
import { MessageType } from '../enums/message-type.enum';
import { CityLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { clearTile } from './tile-reducer';
import { IState, IAction, IBuyItem } from './interfaces';
import { StoreItemType } from 'app/enums/store-item-type.enum';
import { Action } from './actions/action.enum';
import { getNextCard } from './reducers/getNextCard-reducre';
import { getCardByFamily } from './reducers/getCardByFamily-reducer';
import { checkIfLevelCompleted } from './reducers/levels-reducer';

export class MainReducer {

}

export const tileStoreItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { store: StoreItemType.TILE_STORE, label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { store: StoreItemType.TILE_STORE, label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { store: StoreItemType.TILE_STORE, label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { store: StoreItemType.TILE_STORE, label: 'laboratory', cost: { block: 12, lumber: 6, coin: 3 }, icon: UrlConst.LABORATORY, type: CardFamilyTypeEnum.LABORATORY, description: "produce TNT!" },
    { store: StoreItemType.TILE_STORE, label: 'church', cost: { block: 15, lumber: 9, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
]

export const tileBuildingItems: IBuyItem[] = [
    { store: StoreItemType.TILE_CARD_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
    { store: StoreItemType.TILE_CARD_STORE, label: 'move', cost: { block: 0, lumber: 0, coin: 3 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
]

export const mainStoreItems: IBuyItem[] = [
    { store: StoreItemType.MAIN_STORE, label: "tree", cost: { coin: 1 }, icon: UrlConst.LUMBER1, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "plant tree" },
    { store: StoreItemType.MAIN_STORE, label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, level: 1, amount: 3, description: "buy brick" },
    { store: StoreItemType.MAIN_STORE, label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, level: 1, amount: 3, description: "buy lumber" },
    { store: StoreItemType.MAIN_STORE, label: "wild", cost: { coin: 4 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { store: StoreItemType.MAIN_STORE, label: "bomb", cost: { coin: 4 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { store: StoreItemType.MAIN_STORE, label: "undo", cost: { coin: 0 }, icon: UrlConst.UNDO, type: 99, amount: 9, description: "undo last action" },
]

const initState: IState = {
    gameOver: false,
    tiles: [],
    turn: 0,
    score: 0,
    population: 0,
    resources: { bricks: 0, lumber: 0, coins: 0, silver: 0, maxStorage: 0 },

    tileClicked: null,
    floatTile: null,
    pendingMoveCard: null,
    nextCard: null,
    level: new GameLevel(),
    cityLevel: new CityLevel(),
    prevState: null,
    showStoreItems: null,
    currentMessage: null,
    boardState: ""
}

let prevGameState: IState;
//let states: IState[] = []

export function mainReducerFunc(state: IState = initState, action: IAction): IState {
    // prevGameState = Object.assign({}, state);
    if (action.type == Action.CLICK_TILE) {
        prevGameState = {
            gameOver: state.gameOver,
            tiles: state.tiles.map(a => Object.assign({}, a)),
            turn: state.turn,
            score: state.score,
            population: state.population,
            resources: Object.assign({}, state.resources),

            tileClicked: Object.assign({}, state.tileClicked),
            floatTile: Object.assign({}, state.floatTile),
            pendingMoveCard: Object.assign({}, state.pendingMoveCard),
            nextCard: Object.assign({}, state.nextCard),
            level: Object.assign({}, state.level),
            cityLevel: Object.assign({}, state.cityLevel),
            showStoreItems: state.showStoreItems,
            currentMessage: Object.assign({}, state.currentMessage),
            boardState: state.boardState,
            prevState: state.prevState
        }



        let savedata = {
            gameOver: state.gameOver,
            tiles: state.tiles.map(a => Object.assign({}, a)),
            turn: state.turn,
            score: state.score,
            population: state.population,
            resources: Object.assign({}, state.resources),

            tileClicked: state.tileClicked ? state.tileClicked.toString() : null,
            floatTile: state.floatTile ? state.floatTile.toString() : null,
            pendingMoveCard: Object.assign({}, state.pendingMoveCard),
            nextCard: Object.assign({}, state.nextCard),
            level: Object.assign({}, state.level),
            cityLevel: Object.assign({}, state.cityLevel),
            showStoreItems: state.showStoreItems,
            currentMessage: Object.assign({}, state.currentMessage),
            boardState: state.boardState,
            prevState: state.prevState
        }

        savedata.tiles.forEach(a => a.linked = a.linked.map(b => b.toString()));



        localStorage.setItem('lastState', JSON.stringify(savedata));
    }




    let newState: IState = Object.assign({}, state);


    //states.push(newState);

    let tile: Tile;
    if (action.payload && action.payload instanceof Tile) {
        tile = action.payload;
    }

    console.info('new action ' + action.type);

    switch (action.type) {
        case Action.RESTORE_GAMESTATE:
            let lastState: string = localStorage.getItem('lastState');

            /* if (lastState) {
                let parsedState: IState = JSON.parse(lastState);
                if (parsedState && parsedState.tiles && parsedState.tiles.length) {
                    //debugger;
                    parsedState.nextCard = getNextCard(parsedState);
                    parsedState.floatTile = getFloatTile(parsedState);
                    //debugger;
                    return parsedState;
                }
            } */

            return newState;


        case Action.INIT_GAME:
            //newState = Object.assign({}, initState);
            newState.tiles = generateWorld(11, 5);

            return newState;

        case Action.NEW_GAME:
            newState.nextCard = getNextCard(newState);
            newState.floatTile = getFloatTile(newState);
            //newState.floatTile = getFloatTile(newState);
            return newState;

        case Action.CLICK_STASH_TILE:
            stashCard(newState, tile);
            return newState;

        case Action.SET_NEXT_CARD:
            if (action.payload) {
                newState.nextCard = getCardByFamily(action.payload.type, action.payload.level);

            }
            return newState;

        case Action.CLICK_TILE:
            newState.tileClicked = tile;
            clickTileOnBoard(newState);
            nextTurn(newState);
            newState.nextCard = getNextCard(newState);
            return newState;

        case Action.COLLECT_RESOURCES:
            newState.tileClicked = tile;
            let leftover: number = addResources(newState, tile)
            if (leftover) {
                tile.card.collected = leftover;
            } else {
                newState.cardCollected = Object.assign({}, tile.card);
                tile.movment = { dir: 'collect', img: tile.card.img };
                nextTurn(newState);
                clearTile(tile);
            }

            return newState;
        case Action.PLACE_MOVE_BUILDING:
            tile.card = newState.pendingMoveCard;
            newState.pendingMoveCard = null;
            newState.tiles.forEach(a => a.state = TileState.REGULAR);
            return newState;

        case Action.OPEN_STORE:
            newState.tileClicked = action.payload;
            if (newState.tileClicked) {
                if (newState.tileClicked.card) {
                    newState.showStoreItems = tileBuildingItems;
                } else {
                    newState.showStoreItems = tileStoreItems;
                }

            } else {
                newState.showStoreItems = mainStoreItems;
            }

            return newState;

        case Action.BUY_ITEM:
            let buyItem: IBuyItem = action.payload;
            let purchased: boolean

            switch (buyItem.store) {
                case StoreItemType.MAIN_STORE:
                    newState.nextCard = getCardByFamily(buyItem.type, buyItem.level)
                    purchased = true;
                    break;
                case StoreItemType.TILE_STORE:
                    if (buyBuilding(newState, buyItem)) {
                        purchased = true;
                        nextTurn(newState);
                    }
                    break;
                case StoreItemType.TILE_CARD_STORE:
                    if (buyItem.type == 10) {
                        moveTileBuilding(newState, newState.tileClicked);
                        purchased = true;
                    } else {
                        if (buyBuilding(newState, buyItem)) {
                            purchased = true;
                            nextTurn(newState);
                        }
                    }
                    break;
                default:
                    break;
            }

            if (purchased) {
                newState.resources.coins -= buyItem.cost.coin;
                if (buyItem.cost.block) {
                    removeFromResourcesStorage(newState, buyItem.cost.block);
                }

                if (buyItem.cost.lumber) {
                    removeFromResourcesSawmill(newState, buyItem.cost.lumber);
                }
            }

            return newState;
        case Action.CLOSE_STORE:
            newState.showStoreItems = null;
            return newState;

        case Action.UNDO:
            return prevGameState
        //return Object.assign({},prevGameState);

        //return newState;
        default:
            return newState;
    }
}

function getFloatTile(newState: IState): Tile {
    return newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
}

function stashCard(newState: IState, tile: Tile) {
    let temp: Card = tile.card;
    tile.card = newState.nextCard;
    newState.nextCard = temp ? temp : getNextCard(newState);
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

        newState.tileClicked.card = getCardByFamily(buyItem.type);
        findMatch(newState.tileClicked);
        //newState.score += newState.tileClicked.card.value;
    }

    /* newState.resources.coins -= buyItem.cost.coin;
    if (buyItem.cost.block) {
        removeFromResourcesStorage(newState, buyItem.cost.block);
    }

    if (buyItem.cost.lumber) {
        removeFromResourcesSawmill(newState, buyItem.cost.lumber);
    } */

    return true;
}

function nextTurn(newState: IState) {


    newState.currentMessage = null;
    newState.turn++;
    moveWalkers(newState.tiles);
    //let bombs: Tile[] = newState.tiles.filter(a => a != newState.tileClicked && a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);
    checkBombs(newState);

    newState.tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER).forEach(a => a.card.state = CardState.REGULAR)
    //newState.nextCard = getNextCard();

    let found: Tile = newState.tileClicked.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES)
    newState.floatTile = found ? found : newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);

    let houses: Tile[] = newState.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE)
    if (houses.length) {
        newState.population = houses.map(a => a.card.collected).reduce((prev, cur) => prev + cur);
    }

    newState.score += newState.tileClicked.card ? newState.tileClicked.card.value : 0;

    checkIfLevelCompleted(newState);
    checkIfGameOver(newState);
}


function checkIfGameOver(newState: IState) {
    let emptyInCity: number = newState.tiles.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card).length;
    let emptyInResources: number = newState.tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card).length;

    if (!emptyInCity || !emptyInResources) newState.gameOver = true;
}





