import { IState } from 'app/redux/main-reducer';
import { IBuyItem } from './tile-buy-popup/buy-item/buy-item';
import { NEW_GAME_ACTION, OPEN_STORE, MOVE_BUILDING_ACTION, PLACE_BUILDING, CLOSE_STORE } from './../redux/actions/actions';
import { environment } from './../../environments/environment';
import { TerrainEnum } from './../enums/terrain.enum';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { GameLevel } from 'app/game/levels/game-level';
import { MessageType } from '../enums/message-type.enum';
import { Tile } from './board/tile/tile';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { INIT_GAME_ACTION } from '../redux/actions/actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  currentState: IState;
  currentLevel: GameLevel;
  debug: boolean;
  showStoreItems: IBuyItem[];

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    let savedGameStateStr: string = localStorage.getItem('test');

    /* if (savedGameStateStr) {
      let savedGameState: IState = JSON.parse(savedGameStateStr);
      console.log(savedGameState)
    } */
    // debugger;


    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      this.currentState = newState;
      if (newState.tiles.length) {
        //let str: string = newState.tiles[0].toString()
        //console.log(JSON.parse(str))
      }

      if (newState.gameOver) {
        console.log("GAME OVER!!!!");
        this.messagesService.postMessage({ type: MessageType.POPUP, title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
      }


      // if (newState.showStoreItems) {
      this.showStoreItems = newState.showStoreItems;
      //}
      /* if (newState.tiles) {
        let str: string = JSON.stringify(newState.tiles, (key, value) => {
          if (value == 'object') {
            return value.toString()
          }
          return value;
        });
        localStorage.setItem('tiles', str);
      } */



      /* if (this.currentLevel && newState.population >= newState.level.goal) {
        this.gameEngine.store.dispatch({ type: NEXT_LEVEL_ACTION });
      }



      /* if (newState.currentMessage) {
        this.messagesService.postMessage(newState.currentMessage);
        newState.currentMessage = null;
      } */

      /* if (this.currentLevel != newState.level) {

        this.currentLevel = newState.level;
        if (this.currentLevel.index) {
          this.messagesService.postMessage({
            type: MessageType.CURTAIN, title: "Well done! ", message: `level ${this.currentLevel.index} completed!\n${this.currentLevel.reward.coins} coin rewarded`
            , butns: [{ label: 'next level' }]
          });
        }
      } */
    })
  }

  ngOnInit() {
    this.debug = !environment.production;
    this.gameEngine.store.dispatch({ type: INIT_GAME_ACTION });

    setTimeout(() => {
      this.gameEngine.store.dispatch({ type: NEW_GAME_ACTION });
    }, 50);
  }

  /* gameOver() {
    this.messagesService.postMessage({ type: MessageType.POPUP, title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
  } */

  onBuyItem(buyItem) {


    if (buyItem) {

      if (buyItem.type == 10) {
        this.gameEngine.store.dispatch({ type: MOVE_BUILDING_ACTION, payload: this.currentState.tileClicked });
      } else {
        this.gameEngine.store.dispatch({ type: PLACE_BUILDING, payload: { tile: this.currentState.tileClicked, buyItem: buyItem } });
      }
    }

    this.gameEngine.store.dispatch({ type: CLOSE_STORE });
  }



  restart() {
    this.gameEngine.store.dispatch({ type: INIT_GAME_ACTION });

    setTimeout(() => {
      this.gameEngine.store.dispatch({ type: NEW_GAME_ACTION });
    }, 50);
  }
}
