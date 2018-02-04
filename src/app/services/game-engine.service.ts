
import { Tile } from 'app/game/board/tile/tile';
import { createStore, Store } from 'redux';
import { mainReducerFunc } from 'app/redux/main-reducer';



export class GameEngineService {
  store: Store<any>;

  totalRows: number = 11;
  totalCols: number = 5;
  rollOverTile: Tile;

  constructor() {
    this.store = createStore(mainReducerFunc);

  }
}
