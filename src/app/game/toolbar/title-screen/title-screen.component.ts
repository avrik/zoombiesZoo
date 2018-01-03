import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from 'app/game/cards/card';
import { MessagesService, IMessage } from 'app/services/messages.service';

@Component({
  selector: 'title-screen',
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css']
})
export class TitleScreenComponent implements OnInit {

  cardHint: Card;
  currentCard: Card;
  title: string = "Zoombie Zoo";
  message: IMessage;

  constructor(private gameEngine: GameEngineService, private messageService: MessagesService) {
    this.gameEngine.cardHint$.subscribe(cardHint => this.cardHint = cardHint);
    this.gameEngine.currentCard$.subscribe(currentCard => this.currentCard = currentCard);

    this.messageService.currentMessage$.subscribe(message => {
      if (message && message.type == 2) {
        this.cardHint = null;
        this.message = message;
        setTimeout(() => {
          this.message =null
        }, 2000);
      }
    });
  }

  ngOnInit() {
  }

}
