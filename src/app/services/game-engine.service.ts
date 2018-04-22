import { Tile } from 'app/game/board/tile/tile';
import { createStore, Store } from 'redux';
import { mainReducerFunc } from 'app/redux/main-reducer';
import { Action } from '../redux/actions/action.enum';
import { Card, ICardData } from 'app/game/cards/card';
import { IBuyItem } from '../redux/interfaces';
import { MessagesService } from './messages.service';
import { MessageType } from '../enums/message-type.enum';

export class GameEngineService {

  store: Store<any>;
  totalRows: number = 6;
  totalCols: number = 11;
  rollOverTile: Tile;

  constructor() {
    this.store = createStore(mainReducerFunc);
  }

  /* initGame() {
    this.store.dispatch({ type: Action.INIT_GAME, payload: { rows: this.totalRows, cols: this.totalCols } });
  } */

  restart(restoreState: boolean = false) {

    this.store.dispatch({ type: Action.INIT_GAME, payload: { rows: this.totalRows, cols: this.totalCols } });
    //localStorage.clear();
    //this.initGame();

    //if (restoreState) {
      /* let lastState = localStorage.getItem("lastState");
      if (lastState) {
        this.store.dispatch({ type: Action.RESTORE_GAMESTATE });
      }  */
      //else {
        //this.store.dispatch({ type: Action.NEW_GAME });
      //}
    /* } else {
      localStorage.removeItem('lastState');
      
    } */

    if (!restoreState) {
      localStorage.removeItem('lastState');
    }
    this.store.dispatch({ type: Action.NEW_GAME });
    setTimeout(() => { this.store.dispatch({ type: Action.NEW_FLOATTILE }) }, 50);
  }

  /* newGame(restoreState: boolean = false) {

    if (restoreState) {
      this.store.dispatch({ type: Action.RESTORE_GAMESTATE });
    } else {
      this.store.dispatch({ type: Action.NEW_GAME });
    }
  } */

  addEnergy(amount: number) {
    this.store.dispatch({ type: Action.ADD_ENERGY, payload: amount });
  }
  setNextCard(card: ICardData) {
    this.store.dispatch({ type: Action.SET_NEXT_CARD, payload: { type: card.family.name, level: card.level } });
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

  handleBlockedTile(tile: Tile) {
    this.store.dispatch({ type: Action.OPEN_BLOCKED_TILE_OPTION, payload: tile })
  }

  buyItem(buyItem: IBuyItem) {

    switch (buyItem.type) {
      case 101:
        this.store.dispatch({ type: Action.DEVELOP_TILE, payload: buyItem });

        break;
      case 99:
        this.store.dispatch({ type: Action.UNDO, payload: buyItem });
        setTimeout(() => { this.store.dispatch({ type: Action.NEW_FLOATTILE }) }, 50);
        break;

      default:
        this.store.dispatch({ type: Action.BUY_ITEM, payload: buyItem })
    }
  }

  showMatchHint(tile: Tile): any {
    this.store.dispatch({ type: Action.SHOW_MATCH_HINT, payload: tile, notrace: true })
  }

  clearMatchHint(tile: Tile): any {
    this.store.dispatch({ type: Action.CLEAR_MATCH_HINT, payload: tile, notrace: true })
  }

  closeStore() {
    this.store.dispatch({ type: Action.CLOSE_STORE })
  }

  closeTutorial() {
    this.store.dispatch({ type: Action.CLOSE_TUTORAIL })
  }
}
