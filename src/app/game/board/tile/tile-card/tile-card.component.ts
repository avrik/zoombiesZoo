
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../../services/messages.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';

@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.css'],
  animations: [
    trigger('animState', [
      transition('* => init', [
        animate('200ms ease', keyframes([
          style({ transform: 'scale(0) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.2) translateY(-10%)', offset: 0.6 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 }),
        ]))
      ])
    ])]
})
export class TileCardComponent implements OnInit {

  @Input() onTerrain: number;
  @Input() card: Card;
  animState: string;
  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

  }

  ngOnInit() {

    if (this.card && this.card.type != CardTypeEnum.WALKER)
    {
      this.animState = "init ";
    }
    
  }


  getheight() {
    if (this.onTerrain==4) return 40
    
    switch (this.card.type) {
      case CardTypeEnum.WALKER:
        return 70;

      default:
        return 50;
    }
    
  }

  getMargin() {
    switch (this.card.type) {
      case CardTypeEnum.WALKER:
      return "-28px 0 0 20px"
      default:
      return "-8px 0 0 15px"
    }
    
  }


}
