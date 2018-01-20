
import { IState } from './../redux/main-reducer';
import { NEXT_TURN_ACTION, NEXT_LEVEL_ACTION, GENERATE_WORLD_ACTION, NEW_GAME_ACTION } from './../redux/actions/actions';

import { IResourceStorage } from 'app/services/game-engine.service';
import { IGameLevelData } from './../game/levels/game-level';
import { MessagesService } from './messages.service';
import { Injectable, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tile } from '../game/board/tile/tile';
import { Card, ICardData, cardCollection } from '../game/cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { GameLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { CardState } from '../enums/card-state.enum';
import { CardFamilyTypeEnum } from '../enums/card-family-type-enum.enum';
import { TerrainEnum } from '../enums/terrain.enum';
import { createStore, combineReducers, Store } from 'redux'
import { mainReducerFunc } from 'app/redux/main-reducer';


export interface IResourceStorage {
  bricks?: number,
  lumber?: number,
  coins?: number,
  maxStorage?: number,
}


export class GameEngineService {

  currentState: IState;
  store: Store<any>;

  totalRows: number = 11;
  totalCols: number = 5;

  constructor() {
    this.store = createStore(mainReducerFunc,);
  }

  /* start() {
    this.store.dispatch({ type: NEW_GAME_ACTION });
  } */

}
