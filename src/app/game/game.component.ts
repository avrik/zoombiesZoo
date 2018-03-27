
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { IBuyItem, IState } from 'app/redux/interfaces';
import { Messages } from '../enums/messages.enum';
import { DigitCounterService } from '../services/digit-counter.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  debug: boolean;
  showStoreItems: IBuyItem[];

  constructor(private gameEngine: GameEngineService,
    private messagesService: MessagesService,
    private counterService: DigitCounterService) 
    {
    //this.counterService.setCounter(0, 3000);
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      /* if (newState.energy<0) {
        this.messagesService.postMessage({ type: MessageType.POPUP, title: Messages.GAME_OVER_TITLE, butns: [{ label: Messages.GAME_OVER_BUTN1, action: a => { this.restart() } }] })
      } */

      if (newState.gameOver) {
        this.messagesService.postMessage({ type: MessageType.POPUP, title: Messages.GAME_OVER_TITLE, butns: [{ label: Messages.GAME_OVER_BUTN1, action: a => { this.restart() } }] })
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
