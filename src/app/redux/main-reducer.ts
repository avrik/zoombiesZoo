import { GameLevel } from './../game/levels/game-level';
import { Tile } from './../game/board/tile/tile';
import { CardState } from './../enums/card-state.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { removeFromResourcesStorage } from './reducers/resources-reducer';
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
import { getMatchesAround } from './reducers/find-match-reducer';
import { getFloatTile } from './reducers/tile-reducer';
import { restoreGameState } from './reducers/restore-gamestate-reducer';
import { buyItem, tradeItemForResources } from './reducers/buy-item-reducer';
import { nextTurn } from './reducers/next-turn-reducer';
import { state } from '@angular/core';
import { openStore, openBlockedItemStore } from './reducers/open-store-reducer';
import { collectResources } from './reducers/collect-resources-reducer';
import { Card } from '../game/cards/card';
import { IMessage } from '../services/messages.service';
import { setNextTutorialLevel, tutorialLevels } from './reducers/tutorial-reducer';

export class MainReducer { }

const message_no_energy: IMessage = { title: "No more energy - wait for recharge", message: "wait for your energy to go back", type: MessageType.TOOLBAR };
const message_welcome: IMessage = { isWow:true,title: "Welcome to your new kingdom sir", message: "Welcome to your kingdom. \nmay your rule be long and prosperous", butns: [{ label: "GO!" }], type: MessageType.CURTAIN };

const initState: IState = {
    tutorialLevel: null,
    tutorialComplete: false,
    tutorialActive: false,
    lastActionDate: new Date(),
    energy: 300,
    gameOver: false,
    tiles: [],
    turn: 0,
    maxEnergy: 300,
    score: 0,
    population: 0,
    resources: { bricks: 0, lumber: 0, coins: 10, silver: 0, maxStorage: 0 },
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
    let tile: Tile = (action.payload instanceof Tile) ? action.payload : null

    if (!action.notrace) {
        console.info('Dispatch action :', action.type, action.payload);
    }

    //setNextTutorialLevel(newState);

    switch (action.type) {
        case Action.RESTORE_GAMESTATE:
            //newState = restoreGameState(newState);
            return newState;

        case Action.INIT_GAME:
            newState = Object.assign({}, initState);
            newState.resources = { bricks: 0, lumber: 0, coins: 10 };
            newState.tiles = generateWorld(action.payload.rows, action.payload.cols);
            return newState;

        case Action.NEW_GAME:
            let restoreState = restoreGameState(newState);
            if (restoreState) {
                return restoreState;
            }

            populateWorldWithResources(newState.tiles);
            newState.nextCard = getNextCard(newState);
            newState.currentMessage = message_welcome;
            saveState(newState);
            return newState;

        case Action.NEW_FLOATTILE:
            newState.floatTile = getFloatTile(newState);
            return newState;

        case Action.CLICK_STASH_TILE:
            stashCard(newState, tile);
            saveState(newState);
            return newState;

        case Action.SET_NEXT_CARD:
            if (action.payload) {
                newState.nextCard = getCardByFamily(action.payload.type, action.payload.level);
            }
            return newState;

        case Action.CLICK_TILE:
            if (newState.energy <= 0) {
                console.log("no more energy!!!!")
                newState.currentMessage = message_no_energy;
            } else {
                newState.tileClicked = tile;
                clickTile(newState);
                nextTurn(newState);
                saveState(newState);
            }

            return newState;

        case Action.COLLECT_RESOURCES:
            newState.tileClicked = tile;
            collectResources(newState)
            saveState(newState);
            return newState;

        case Action.PLACE_MOVE_BUILDING:
            tile.card = newState.pendingMoveCard;
            newState.pendingMoveCard = null;
            newState.tiles.forEach(a => a.state = TileState.REGULAR);
            saveState(newState);
            return newState;

        case Action.OPEN_BLOCKED_TILE_OPTION:
            newState.tileClicked = action.payload;
            openBlockedItemStore(newState)
            return newState;

        case Action.OPEN_STORE:
            newState.tileClicked = action.payload;
            openStore(newState);
            return newState;

        case Action.BUY_ITEM:
            if (newState.energy <= 0) {
                console.log("no more energy!!!!")
                newState.currentMessage = message_no_energy;
            } else {
                newState = buyItem(newState, action.payload);
                saveState(newState);
            }
            return newState;

        case Action.DEVELOP_TILE:
            if (newState.tileClicked) newState.tileClicked.terrain.locked = false;
            tradeItemForResources(newState, action.payload);
            saveState(newState);
            return newState;

        case Action.CLOSE_STORE:
            newState.showStoreItems = null;
            return newState;

        case Action.UNDO:
            if (prevGameState) {
                newState = restoreGameState(prevGameState)
                //mapLinkedTiles(newState.tiles);
                //tradeItemForResources(newState, action.payload.cost);
                newState.resources.coins--;
                saveState(newState);
            }

            return newState;

        case Action.ADD_ENERGY: {
            newState.energy += action.payload;
            if (newState.energy > newState.maxEnergy) {
                newState.energy = newState.maxEnergy;
            }
            saveState(newState);
            return newState;
        }

        case Action.CLEAR_MATCH_HINT: {
            newState.currentMessage = null;
            newState.tiles.filter(a => a.card && a.card.state == CardState.MATCH_HINT).forEach(b => b.card.state = CardState.REGULAR);
            return newState;
        }

        case Action.SHOW_MATCH_HINT: {
            if (newState.nextCard) {
                let matches: Tile[] = getMatchesAround(tile, tile.linked, newState.nextCard);
                if (matches.length) {
                    //console.log("SHOW_MATCH_HINT", matches.length);
                    matches.forEach(a => a.card.state = CardState.MATCH_HINT);
                }
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
        tutorialLevel: state.tutorialLevel,
        tutorialComplete: state.tutorialComplete,
        tutorialActive: state.tutorialActive,
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
    newState.nextCard = temp || getNextCard(newState);
}
