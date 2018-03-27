import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { GameLevel } from './../game/levels/game-level';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { cardCollection, ICardData, Card } from './../game/cards/card';
import { addResources, removeFromResourcesSawmill } from 'app/redux/reducers/resources-reducer';
import { removeFromResourcesStorage } from './reducers/resources-reducer';
import { UrlConst } from '../consts/url-const';
import { MessageType } from '../enums/message-type.enum';
import { CityLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { IState, IAction, IBuyItem } from './interfaces';
import { StoreItemType } from 'app/enums/store-item-type.enum';
import { Action } from './actions/action.enum';
import { getNextCard } from './reducers/getNextCard-reducre';
import { getCardByFamily } from './reducers/getCardByFamily-reducer';
import { checkIfLevelCompleted } from './reducers/levels-reducer';
import { generateWorld, populateWorldWithResources, mapLinkedTiles } from './reducers/new-world-reducer';
import { clickTile } from './reducers/tile-click-reducer';
import { findMatch } from './reducers/find-match-reducer';
import { checkBombs } from './reducers/check-bombs-reducer';
import { clearTile, getFloatTile } from './reducers/tile-reducer';
import { moveWalkers } from './reducers/move-walkers-reducer';
import { restoreGameState } from './reducers/restore-gamestate-reducer';
import { buyItem } from './reducers/buy-item-reducer';
import { nextTurn } from './reducers/next-turn-reducer';

export class MainReducer { }

export const tileStoreItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "connect people to houses" },
    { store: StoreItemType.TILE_STORE, label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { store: StoreItemType.TILE_STORE, label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { store: StoreItemType.TILE_STORE, label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { store: StoreItemType.TILE_STORE, label: 'church', cost: { block: 15, lumber: 9, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "for trapping the undead!" },
]

export const tileBuildingItems: IBuyItem[] = [
    { store: StoreItemType.TILE_CARD_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
    { store: StoreItemType.TILE_CARD_STORE, label: 'move', cost: { block: 0, lumber: 0, coin: 3 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
]

export const tileResourceBlockedItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'develop', cost: { block: 0, lumber: 0, coin: 9 }, icon: UrlConst.TERRAIN_RESOURCE, type: 101, description: "discover new territory" }
]

export const tileCityBlockedItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'develop', cost: { block: 0, lumber: 0, coin: 12 }, icon: UrlConst.TERRAIN_CITY, type: 101, description: "discover new territory" }
]

export const mainStoreItems: IBuyItem[] = [
    { store: StoreItemType.MAIN_STORE, label: "tree", cost: { coin: 1 }, icon: UrlConst.LUMBER1, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "plant tree" },
    { store: StoreItemType.MAIN_STORE, label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, level: 1, amount: 3, description: "buy brick" },
    { store: StoreItemType.MAIN_STORE, label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, level: 1, amount: 3, description: "buy lumber" },
    { store: StoreItemType.MAIN_STORE, label: "wild", cost: { coin: 4 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { store: StoreItemType.MAIN_STORE, label: "bomb", cost: { coin: 4 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { store: StoreItemType.MAIN_STORE, label: "undo", cost: { coin: 1 }, icon: UrlConst.UNDO, type: 99, amount: 9, description: "undo last action" },
]

const initState: IState = {
    lastActionDate: new Date(),
    energy: 1000,
    gameOver: false,
    tiles: [],
    turn: 0,
    maxEnergy: 1000,
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

export function mainReducerFunc(state: IState = initState, action: IAction): IState {

    //localStorage.removeItem("lastState");
    if (action.type == Action.CLICK_TILE) {
        prevGameState = getCurState(state);
    }

    let newState: IState = Object.assign({}, state);

    if (action.type != Action.INIT_GAME && newState.energy <= 0) {
        console.log("no more energy!!!!")
        newState.currentMessage = { title: "No more energy - wait for recharge", message: "wait for your energy to go back", type: MessageType.TOOLBAR }
        return newState;
    }

    let tile: Tile;

    if (action.payload && action.payload instanceof Tile) {
        tile = action.payload;
    }

    console.info('Dispatch action :', action.type);

    switch (action.type) {
        case Action.RESTORE_GAMESTATE:

            return restoreGameState(newState);

        case Action.INIT_GAME:
            newState = Object.assign({}, initState);
            newState.resources = { bricks: 0, lumber: 0, coins: 0 };
            newState.tiles = generateWorld(action.payload.rows, action.payload.cols);
            return newState;

        case Action.NEW_GAME:
            populateWorldWithResources(newState.tiles);
            newState.nextCard = getNextCard(newState);
            return newState;

        case Action.NEW_FLOATTILE:
            newState.floatTile = getFloatTile(newState);
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
            clickTile(newState);
            nextTurn(newState);
            saveState(newState);

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

        case Action.OPEN_BLOCKED_TILE_OPTION:
            newState.tileClicked = action.payload;
            let isResourceTile = newState.tileClicked.linked.find(a => a.terrain.type == TerrainEnum.RESOURCES) ? true : false;
            newState.showStoreItems = isResourceTile ? tileResourceBlockedItems : tileCityBlockedItems;
            return newState;

        case Action.OPEN_STORE:
            newState.tileClicked = action.payload;
            if (newState.tileClicked) {
                if (newState.tileClicked.card) {
                    newState.showStoreItems = tileBuildingItems;
                } else {
                    newState.showStoreItems = newState.tileClicked.terrain.type == TerrainEnum.ROAD ? tileStoreItems.filter(a => a.type != CardFamilyTypeEnum.ROAD) : tileStoreItems;
                }

            } else {
                newState.showStoreItems = mainStoreItems;
            }

            return newState;

        case Action.BUY_ITEM:
            /* let buyItem: IBuyItem = action.payload;
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

            return newState; */
            return buyItem(newState, action.payload);

        case Action.DEVELOP_TILE:
            if (newState.tileClicked) newState.tileClicked.terrain.locked = false;
            return newState;

        case Action.CLOSE_STORE:
            newState.showStoreItems = null;
            return newState;

        case Action.UNDO:
            if (prevGameState) {
                prevGameState.tiles = prevGameState.tiles.map(a => new Tile(a));
                mapLinkedTiles(prevGameState.tiles);
                return prevGameState
            }
            return newState;

        case Action.ADD_ENERGY: {
            newState.energy += action.payload;
            if (newState.energy > newState.maxEnergy) {
                newState.energy = newState.maxEnergy;
            }
            return newState;
        }
        default:
            return newState;
    }
}

function getCurState(state: IState): IState {
    return {
        lastActionDate: new Date(),
        energy: state.energy,
        gameOver: state.gameOver,
        tiles: state.tiles.map(a => a.toString()),
        turn: state.turn,
        maxEnergy: state.maxEnergy,
        score: state.score,
        population: state.population,
        resources: state.resources ? Object.assign({}, state.resources) : null,
        tileClicked: state.tileClicked ? state.tileClicked.toString() : null,
        floatTile: state.floatTile ? state.floatTile.toString() : null,
        pendingMoveCard: state.pendingMoveCard ? Object.assign({}, state.pendingMoveCard) : null,
        nextCard: state.nextCard ? Object.assign({}, state.nextCard) : null,
        level: state.level ? Object.assign({}, state.level) : null,
        cityLevel: state.cityLevel ? Object.assign({}, state.cityLevel) : null,
        showStoreItems: state.showStoreItems,
        currentMessage: state.currentMessage ? Object.assign({}, state.currentMessage) : null,
        boardState: state.boardState,
        prevState: state.prevState
    }
}

function saveState(state: IState) {
    let savedata = getCurState(state);
    localStorage.setItem('lastState', JSON.stringify(savedata));
}

function stashCard(newState: IState, tile: Tile) {
    let temp: Card = tile.card;
    tile.card = newState.nextCard;
    newState.nextCard = temp ? temp : getNextCard(newState);
}
