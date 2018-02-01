import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from 'app/game/cards/card';
import { MessagesService, IMessage } from 'app/services/messages.service';
import { IState } from '../../../redux/main-reducer';
import { MessageType } from '../../../enums/message-type.enum';
import { Tile } from '../../board/tile/tile';

@Component({
  selector: 'title-screen',
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css'],
  animations: [
    trigger('animate', [
      transition('* => up', [
        animate('250ms ease-out', keyframes([
          style({ transform: 'scale(1) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.1) translateY(-15%)', offset: 0.3 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 })
        ]))
      ]),
    ])]
})
export class TitleScreenComponent implements OnInit {
  animationState: string;
  currentCard: Card;
  title: string = "Zoombie Zoo";
  message: IMessage;

  constructor(public gameEngine: GameEngineService, private messageService: MessagesService) {

  }

  ngOnInit() {
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      this.currentCard = newState.nextCard;

      if (newState.currentMessage && newState.currentMessage.type == MessageType.TOOLBAR) {
        this.message = newState.currentMessage;
        this.animationState = "up"
      } else {
        this.message = null;
      }
    })
  }

  get rollOverTile(): Tile {
    return this.gameEngine.rollOverTile;
  }

  onScaleDone() {
    this.animationState="";
  }
}
