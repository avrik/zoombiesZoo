import { Tile } from './../game/board/tile/tile';
import { IResourceStorage } from './../services/game-engine.service';
import { Card } from 'app/game/cards/card';
import { GameLevel } from 'app/game/levels/game-level';

export interface IState {
    tiles:any[];
    tileClicked:Tile;
    nextCard:Card;
    level:GameLevel;
    resources:IResourceStorage;
    turn:number;
    score:number;
    population
}