
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { IBuyItem, IState } from 'app/redux/interfaces';
import { Messages } from '../enums/messages.enum';
import { Tile } from './board/tile/tile';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  debug: boolean;
  showStoreItems: IBuyItem[];
  tiles:Tile[];
  totalCols:number;
  totalRows:number;
  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    this.totalCols = this.gameEngine.totalCols;
    this.totalRows = this.gameEngine.totalRows;

    this.messagesService.currentMessage$.subscribe(message => {
      if (!message) {
        let newState: IState = this.gameEngine.store.getState();
        if (newState) {
          newState.currentMessage = null;
        }
      }
    })
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      this.tiles = newState.tiles;
      /* if (newState.energy<0) {
        this.messagesService.postMessage({ type: MessageType.POPUP, title: Messages.GAME_OVER_TITLE, butns: [{ label: Messages.GAME_OVER_BUTN1, action: a => { this.restart() } }] })
      } */


      /* if (newState.gameOver) {
        let years = Math.round(newState.turn / 360) + 1;
        let days = newState.turn;

        let message: string = `Nice JOB! \n your kingdom lasted for ${days} days. you reached the population of ${newState.population}, and got ${newState.score} score`;
        this.messagesService.postMessage({ type: MessageType.POPUP, title: Messages.GAME_OVER_TITLE, message: message, butns: [{ label: Messages.GAME_OVER_BUTN1, action: a => { this.restart() } }] });
      } else */ 
      
      if (newState.tutorialActive) {

      } else 
      {
        if (newState.currentMessage && newState.currentMessage.type == MessageType.POPUP) {
          this.messagesService.postMessage(newState.currentMessage);
        }
      }

      this.showStoreItems = newState.showStoreItems;
    })
  }

  ngOnInit() {
    
    this.debug = !environment.production;
    this.restart(true);
  }

  restart(restoreState: boolean = false) {
    this.gameEngine.restart(restoreState);

  }

  onBuyItem(buyItem: IBuyItem) {
    this.gameEngine.closeStore();
  }

  
}
