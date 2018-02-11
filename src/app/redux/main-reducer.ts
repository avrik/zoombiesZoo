
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { GameLevel } from './../game/levels/game-level';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { cardCollection, ICardData, Card } from './../game/cards/card';
import { PLACE_CARD_ON_TILE_ACTION, GENERATE_WORLD_ACTION, NEW_GAME_ACTION, COLLECT_RESOURCES_ACTION, INIT_GAME_ACTION, CLICK_TILE, PLACE_CARD_ON_STASH_ACTION, PLACE_BUILDING, UNDO_ACTION, SET_NEXT_CARD, MOVE_BUILDING_ACTION, PLACE_MOVE_BUILDING_ACTION, OPEN_STORE, CLOSE_STORE, BUY_ITEM } from './actions/actions';
import { generateWorld, findMatch, moveWalkers, nextTurn } from 'app/redux/board-reducer';
import { addResources, removeFromResourcesSawmill } from 'app/redux/resources-reducer';
import { clickTileOnBoard } from './board-reducer';
import { removeFromResourcesStorage } from './resources-reducer';
import { UrlConst } from '../consts/url-const';
import { IMessage } from 'app/services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { CityLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { clearTile } from './tile-reducer';
import { IState, IAction, IBuyItem } from './interfaces';
import { tileBuildingItems, tileStoreItems, mainStoreItems, getNewCard } from './common-reducer';
import { StoreItemType } from 'app/enums/store-item-type.enum';

export class MainReducer {

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
    showStoreItems: null,
    currentMessage: null,
    boardState: ""
}

let prevGameState: IState;
let states: IState[] = []
export let currentGameState: IState;

export function mainReducerFunc(state: IState = initState, action: IAction): IState {
    // prevGameState = Object.assign({}, state);
    let newState: IState = Object.assign({}, state);
    currentGameState = newState;

    states.push(newState);


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
            if (action.payload) newState.nextCard = getNewCard(action.payload.type, action.payload.level);
            return newState;

        case CLICK_TILE:
            newState.tileClicked = tile;
            clickTileOnBoard(newState);
            nextTurn(newState);
            newState.nextCard = getNextCard();
            return newState;

        case COLLECT_RESOURCES_ACTION:
            let img: string = tile.card.img;
            if (addResources(newState, tile, tile.card.collected)) {
                newState.tileClicked = tile;
                newState.cardCollected = Object.assign({},tile.card);
                clearTile(tile);
                tile.movment = { dir: 'collect', img: img };
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

        case CLOSE_STORE:
            newState.showStoreItems = null;
            return newState;
        case OPEN_STORE:
            newState.tileClicked = action.payload ? action.payload.tile : null;
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

        case BUY_ITEM:
            let buyItem: IBuyItem = action.payload;
            let purchased: boolean

            switch (buyItem.store) {
                case StoreItemType.MAIN_STORE:
                    newState.nextCard = getNewCard(buyItem.type, buyItem.level)
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
                        purchased = true;                    } else {
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

    /* newState.resources.coins -= buyItem.cost.coin;
    if (buyItem.cost.block) {
        removeFromResourcesStorage(newState, buyItem.cost.block);
    }

    if (buyItem.cost.lumber) {
        removeFromResourcesSawmill(newState, buyItem.cost.lumber);
    } */

    return true;
}


export function getNextCard(): Card {
    let gotLab: Tile = currentGameState.tiles.find(a => a.card && a.card.family.name == CardFamilyTypeEnum.LABORATORY);
    if (gotLab) {
        let bombData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.BOMB);
        bombData.chance = 5;
    }

    if (currentGameState.level.index > 1) {
        let personCardData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.PERSON);
        personCardData.chance = Math.min(25 + (currentGameState.cityLevel.index * 2), 50);
    }

    if (currentGameState.level.index > 2) {
        let animalCardData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.ANIMAL);
        animalCardData.chance = Math.min(10 + (currentGameState.cityLevel.index * 2), 20);
    }

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





