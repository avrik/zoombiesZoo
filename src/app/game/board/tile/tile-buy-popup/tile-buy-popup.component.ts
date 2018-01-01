import { UrlConst } from './../../../../consts/url-const';
import { IBuyItem } from './buy-item/buy-item';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BuildingEnum } from 'app/enums/building-enum.enum';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { ICost } from 'app/game/board/tile/tile-buy-popup/buy-item/buy-item';

@Component({
  selector: 'tile-buy-popup',
  templateUrl: './tile-buy-popup.component.html',
  styleUrls: ['./tile-buy-popup.component.css']
})
export class TileBuyPopupComponent {
  title:string="city improvments";
  /* items: IBuyItem[] = [

    { cost: { block: 12, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "build to populate the people" },
    { cost: { block: 9, lumber: 3, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "build for resource storage" },
    { cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "get people into houses" },
    { cost: { block: 27, lumber: 9, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "used for trapping zoombies" },
  ] */

  @Input() items: IBuyItem[]
  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  buy(buyItem: IBuyItem) {
    this.buyItem.emit(buyItem);
  }

  onClose() {
    this.buyItem.emit(null);
  }

  onMouseOut(buyItem: IBuyItem) {
    this.title="city improvments";
  }

  onMouseOver(buyItem: IBuyItem) {
    if (buyItem.description) {
      this.title = buyItem.description;
    }
    
  }
}