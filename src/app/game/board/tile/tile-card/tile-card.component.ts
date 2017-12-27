import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../../services/messages.service';

@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.css']
})
export class TileCardComponent implements OnInit {
  showThinkBubble: boolean;

  @Input() card: Card;
  @Input() placed: boolean;
  @Output() collected: EventEmitter<any> = new EventEmitter();

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) { }

  ngOnInit() {
  }

  clickTileCard() {
    if (this.card.collect && this.card.type == CardTypeEnum.RESOURCE) {
      if (this.gameEngine.addToStorage(this.card.family.name, this.card.collect)) {
        if (this.card.bonus) {
          this.gameEngine.addToStorage(CardFamilyTypeEnum.COIN, this.card.bonus);
        }
        this.collected.emit();
      } else {
        this.messagesService.postMessage({ title: "No more storage place", message: "build more storage" });
      }
    }
  }

  hideCardMatch() {
    this.gameEngine.showCardMatchHint(null);
    this.showThinkBubble = false;
  }
  showCardMatch() {
    //console.log('show card match')
    if (this.card.nextCard) {
      this.gameEngine.showCardMatchHint(this.card);
    } else if (this.card.family.name == CardFamilyTypeEnum.PERSON) {
      this.showThinkBubble = true;
    }

  }

}
