
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../../services/messages.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { TerrainEnum } from '../../../../enums/terrain.enum';

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

    if (this.card && this.card.type != CardTypeEnum.WALKER) {
      this.animState = "init ";
    }

  }


  getheight() {
    if (this.onTerrain == 4) return 70

    if (this.card.family.name==CardFamilyTypeEnum.COIN || this.card.family.name==CardFamilyTypeEnum.COIN_SILVER)
    {
      return 50;
    }

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return 70;
      case CardTypeEnum.WALKER:
        return 90;

      default:
        return 100;
    }

  }

  getMargin() {
    if (this.onTerrain==TerrainEnum.CARD_HOLDER) {
      return "0px 0 0 10px"
    }

    if (this.card.family.name==CardFamilyTypeEnum.COIN || this.card.family.name==CardFamilyTypeEnum.COIN_SILVER)
    {
      return "-10px 0 0 20px"
    }


    if (this.card.family.name==CardFamilyTypeEnum.LUMBER && this.card.level==0)
    {
      return "-60px 0 0 10px"
    }

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return "-28px 0 0 10px"
      case CardTypeEnum.WALKER:
        return "-50px 0 0 15px"
      default:
        return "-30px 0 0 -5px"
    }

  }


}
