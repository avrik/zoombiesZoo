import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from 'app/game/cards/card';
import { MessagesService, IMessage } from 'app/services/messages.service';
import { IState } from '../../../redux/main-reducer';
import { MessageType } from '../../../enums/message-type.enum';
import { Tile } from '../../board/tile/tile';

@Component({
  selector: 'title-screen',
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css']
})
export class TitleScreenComponent implements OnInit {

  //cardHint: Card;
  currentCard: Card;
  title: string = "Zoombie Zoo";
  message: IMessage;

  constructor(public gameEngine: GameEngineService, private messageService: MessagesService) {
    /* this.gameEngine.cardHint$.subscribe(cardHint => {
      this.cardHint = cardHint;
      if (this.cardHint && this.cardHint.family.name==100) {
        debugger;
      } 
    });
    this.gameEngine.currentCard$.subscribe(currentCard => this.currentCard = currentCard);

    this.messageService.currentMessage$.subscribe(message => {
      if (message && message.type == 2) {
        this.cardHint = null;
        this.message = message;
        setTimeout(() => {
          this.message =null
        }, 2000);
      }
    }); */


  }

  ngOnInit() {

    this.gameEngine.store.subscribe(() => {
      
      let newState: IState = this.gameEngine.store.getState();
     // this.cardHint = newState.cardHint
      this.currentCard = newState.nextCard; 
      //debugger;
      if (newState.currentMessage && newState.currentMessage.type == MessageType.TOOLBAR) {
        this.message = newState.currentMessage;
        //newState.message = null;
      } else {
        this.message = null;
      }
    })
  }

  get rollOverTile():Tile {
    return this.gameEngine.rollOverTile;
  }
  /* get isCardHint(): boolean {
    return this.gameEngine.cardHint ? true : false;
  } */
}
