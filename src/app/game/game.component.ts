
import { NEW_GAME_ACTION, CLOSE_STORE } from './../redux/actions/actions';
import { environment } from './../../environments/environment';
import { TerrainEnum } from './../enums/terrain.enum';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { Tile } from './board/tile/tile';
import { INIT_GAME_ACTION } from '../redux/actions/actions';
import { IBuyItem, IState } from 'app/redux/interfaces';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  debug: boolean;
  showStoreItems: IBuyItem[];

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    let savedGameStateStr: string = localStorage.getItem('test');

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (newState.tiles.length) {
        //let str: string = newState.tiles[0].toString()
        //console.log(JSON.parse(str))
      }

      if (newState.gameOver) {
        console.log("GAME OVER!!!!");
        this.messagesService.postMessage({ type: MessageType.POPUP, title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
      }

      this.showStoreItems = newState.showStoreItems;
    })
  }

  ngOnInit() {
    this.debug = !environment.production;
    this.gameEngine.store.dispatch({ type: INIT_GAME_ACTION });

    setTimeout(() => {
      this.gameEngine.store.dispatch({ type: NEW_GAME_ACTION });
    }, 50);
  }

  onBuyItem(buyItem: IBuyItem) {
    this.gameEngine.store.dispatch({ type: CLOSE_STORE });
  }

  restart() {
    this.gameEngine.store.dispatch({ type: INIT_GAME_ACTION });

    setTimeout(() => {
      this.gameEngine.store.dispatch({ type: NEW_GAME_ACTION });
    }, 50);
  }
}
