
import { Tile } from 'app/game/board/tile/tile';
import { createStore, Store } from 'redux';
import { mainReducerFunc } from 'app/redux/main-reducer';

export interface IResourceStorage {
  bricks?: number,
  lumber?: number,
  coins?: number,
  maxStorage?: number,
}

export class GameEngineService {
  store: Store<any>;

  totalRows: number = 11;
  totalCols: number = 5;
  rollOverTile: Tile;

  constructor() {
    this.store = createStore(mainReducerFunc);

  }
}
