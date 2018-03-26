
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
        animate('500ms ease', keyframes([
          style({ transform: 'scale(0) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.2) translateY(-10%)', offset: 0.6 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 }),
        ]))
      ]),
      
      transition('* => up', [
        animate('500ms ease', keyframes([
          style({ transform: 'translateY(0%)', offset: 0 }),
          style({ transform: 'translateY(-50%)', offset: 0.8 }),
          style({ opacity: 0, offset: 1.0 }),
        ]))
      ]),


      //state('up', style({ transform: 'translateY(-50%)' })),
      state('down', style({ transform: 'translateY(50%)' })),
      state('upLeft', style({ transform: 'translateY(-30%) translateX(-90%)' })),
      state('upRight', style({ transform: 'translateY(-30%) translateX(90%)' })),
      state('downLeft', style({ transform: 'translateY(30%) translateX(-90%)' })),
      state('downRight', style({ transform: 'translateY(30%) translateX(90%)' })),
  
      transition('* => up', animate('300ms ease-out')),
      transition('* => down', animate('300ms ease-out')),
      transition('* => upLeft', animate('300ms ease-out')),
      transition('* => upRight', animate('300ms ease-out')),
      transition('* => downLeft', animate('300ms ease-out')),
      transition('* => downRight', animate('300ms ease-out')),
  
      transition('* => collect', [
        animate('200ms ease', keyframes([
          style({ transform: 'scale(1) translateY(0%)', opacity: 1, offset: 0 }),
          style({ transform: 'scale(1.5) translateY(-20%)', opacity: 1, offset: 0.8 }),
          style({ transform: 'scale(0) translateY(0%)', opacity: 1, offset: 1.0 }),
        ]))
      ])]
    
    )]
})
export class TileCardComponent implements OnInit {

  @Input() onTerrain: number;
  @Input() card: Card;
  @Input() onTop:boolean;
  animState: string;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

  }

  ngOnInit() {

    /* if (this.card && this.card.type != CardTypeEnum.WALKER) {
      this.animState = "init ";
    }

    if (this.onTop && this.card) {
      setTimeout(() => {
        this.animState = "init";
      }, 1000);

      setTimeout(() => {
        this.animState = "up";
      }, 2000);

      setTimeout(() => {
        this.animState = "upRight";
      }, 3000);

      setTimeout(() => {
        this.animState = "downRight";
      }, 4000);

      setTimeout(() => {
        this.animState = "down";
      }, 5000);

      setTimeout(() => {
        this.animState = "downLeft";
      }, 6000);

      setTimeout(() => {
        this.animState = "upLeft";
      }, 7000);
    } */
  }


  getheight() {
    if (this.onTerrain == 4) return 70

    if (this.card.family.name == CardFamilyTypeEnum.COIN || this.card.family.name == CardFamilyTypeEnum.COIN_SILVER) {
      return 50;
    }

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return 70;
      case CardTypeEnum.WALKER:
        return 90;

      default:
        return 140;
    }

  }

  getMargin() {
    if (this.onTerrain == TerrainEnum.CARD_HOLDER) {
      return "0px 0 0 10px"
    }

    if (this.card.family.name == CardFamilyTypeEnum.COIN || this.card.family.name == CardFamilyTypeEnum.COIN_SILVER) {
      return "-10px 0 0 20px"
    }


    /* if (this.card.family.name==CardFamilyTypeEnum.LUMBER && this.card.level==0)
    {
      return "-60px 0 0 10px"
    } */

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return "-28px 0 0 10px"
      case CardTypeEnum.WALKER:
        return "-50px 0 0 15px"
      /* default:
        return "-30px 0 0 -5px" */
    }


      return "-85px 0 0 -5px";
  }

  getImg() {

    return this.card.img;
  }


}
