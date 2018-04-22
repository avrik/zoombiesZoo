import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../../services/messages.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { TerrainEnum } from '../../../../enums/terrain.enum';
import { UrlConst } from '../../../../consts/url-const';
import { IState } from '../../../../redux/interfaces';
import { CardState } from '../../../../enums/card-state.enum';

@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.css'],
  animations: [
    trigger('animState', [
      transition('* => matchHint', [
        animate('600ms linear', keyframes([
          style({ opacity: 0.9, transform: 'translateY(0%)', offset: 0 }),
          style({ opacity: 0.2, transform: 'translateY(-1%)', offset: 0.4 }),
          style({ opacity: 0.9, transform: 'translateY(0%)', offset: 1.0 }),
        ]))
      ]),
      //transition('* <=> matchHint', animate('300ms ease-out')),
    ])
    /* trigger('animState', [
      transition('* => init', [
        animate('500ms ease', keyframes([
          style({ transform: 'scale(0) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.2) translateY(-10%)', offset: 0.6 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 }),
        ]))
      ]),

      state('up', style({ transform: 'translateY(-50%)' })),
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

    ) */]
})
export class TileCardComponent implements OnInit {

  @Input() onTerrain: number;
  @Input() card: Card;
  // @Input() onTop: boolean;
  @Input() onMe: boolean;
  animState: string;
  show: boolean;

  constructor(private gameEngine: GameEngineService) {
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      this.animState = (this.card && this.card.state == CardState.MATCH_HINT) ? "matchHint" : "";
    })
  }

  ngOnInit() {
    if (this.card) {
      if (this.card.showDelay) {
        setTimeout(() => {
          this.show = true;
        }, this.card.showDelay);
      } else {
        this.show = true;
      }
    }
    
  }

  /* get getAnimState():string {
    if (this.card.state == CardState.MATCH_HINT) {
      this.animState = "matchHint"
    }
    this.animState = "";
    return this.animState;
  } */

  onAnimDone(event) {
    this.animState = "";
    if (this.card.state == CardState.MATCH_HINT) {
      if (event.toState != "matchHint") {
        this.animState = "matchHint";
      }

    }
  }

  get isCardHolder(): boolean {
    return this.onTerrain == TerrainEnum.CARD_HOLDER ? true : false;
  }

  getheight() {
    if (this.onTerrain == TerrainEnum.CARD_HOLDER) return 100

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return 70;

      default:
        return 140;
    }

  }

  getMargin() {
    if (this.onTerrain == TerrainEnum.CARD_HOLDER) {
      return "-40px 0 0 0px"
    }

    switch (this.card.type) {
      case CardTypeEnum.BUILDING:
        return "-45px 0 0 0px"
    }

    return "-85px 0 0 0px";
  }

  getImg() {

    return this.card.img;
  }

  get isShowBubble() {
    return this.card && this.onMe && this.card.family.name == CardFamilyTypeEnum.PERSON
  }

  get getBubbleImg() {
    switch (this.card.level) {
      case 1:
        return UrlConst.CHURCH1;
      case 2:
        return UrlConst.PALACE;
      default:
        return UrlConst.HOUSE1;
    }

  }


}
