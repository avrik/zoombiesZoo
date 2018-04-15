import { Card } from '../game/cards/card';
import { Tile } from 'app/game/board/tile/tile';
import { GameLevel } from 'app/game/levels/game-level';
import { CityLevel } from '../game/levels/game-level';
import { IMessage } from 'app/services/messages.service';

export interface ITutorialLevel {
    index:number;
    title?: string;
    text?: string;
    activeTiles: number[];
    cards: any[];
    completeBy?: any;
}

export interface IAction {
    payload: any;
    type: any;
    notrace: boolean;
}

export interface IState {
    tutorialLevel: ITutorialLevel;
    tutorialComplete: boolean;
    tutorialActive: boolean;
    lastActionDate: Date;
    maxEnergy: number;
    energy: number;
    pendingMoveCard: Card;
    tiles: Tile[];
    tileClicked?: Tile;
    nextCard: Card;
    level: GameLevel;
    cityLevel: CityLevel;
    resources: IResourceStorage;
    turn: number;
    score: number;
    population: number;
    prevState: IState;
    floatTile: Tile;
    showStoreItems: IBuyItem[];
    currentMessage: IMessage;
    gameOver: boolean;
    boardState: string;
    cardCollected?: Card;
}

export interface ICost {
    lumber?: number;
    block?: number;
    coin?: number;
    wheat?: number;
}

export interface IBuyItem {
    label?: string;
    description?: string,
    cost: ICost;
    icon: string;
    type: number;
    amount?: number;
    store: number;
    level?: number;
}

export interface IResourceStorage {
    bricks?: number;
    lumber?: number;
    coins?: number;
    silver?: number;
    maxStorage?: number;
}