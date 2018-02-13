
import { Tile } from 'app/game/board/tile/tile';
import { createStore, Store } from 'redux';
import { mainReducerFunc } from 'app/redux/main-reducer';
import { Action } from '../redux/actions/action.enum';
import { Card, ICardData } from 'app/game/cards/card';
import { IBuyItem } from '../redux/interfaces';

export class GameEngineService {
  store: Store<any>;

  totalRows: number = 11;
  totalCols: number = 5;
  rollOverTile: Tile;

  constructor() {
    this.store = createStore(mainReducerFunc);

  }

  initGame() {
    this.store.dispatch({ type: Action.INIT_GAME });
  }

  newGame() {
    this.store.dispatch({ type: Action.NEW_GAME });
  }

  setNextCard(card: ICardData) {
    this.store.dispatch({ type: Action.SET_NEXT_CARD, payload: { type: card.family.name } });
  }


  clickTile(tile: Tile) {
    this.store.dispatch({ type: Action.CLICK_TILE, payload: tile })
  }

  collectResources(tile: Tile) {
    this.store.dispatch({ type: Action.COLLECT_RESOURCES, payload: tile })
  }

  clickStashTile(tile: Tile) {
    this.store.dispatch({ type: Action.CLICK_STASH_TILE, payload: tile })
  }

  placeMovingBuilding(tile: Tile) {
    this.store.dispatch({ type: Action.PLACE_MOVE_BUILDING, payload: tile })
  }


  openStore(tile: Tile = null) {
    this.store.dispatch({ type: Action.OPEN_STORE, payload: tile })
  }

  buyItem(buyItem: IBuyItem) {
    this.store.dispatch({ type: Action.BUY_ITEM, payload: buyItem })
  }

  closeStore() {
    this.store.dispatch({ type: Action.CLOSE_STORE })
  }

}
