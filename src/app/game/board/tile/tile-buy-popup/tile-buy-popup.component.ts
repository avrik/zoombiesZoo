import { IBuyItem } from './buy-item/buy-item';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BuildingEnum } from 'app/enums/building-enum.enum';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { ICost } from 'app/game/board/tile/tile-buy-popup/buy-item/buy-item';

@Component({
  selector: 'tile-buy-popup',
  templateUrl: './tile-buy-popup.component.html',
  styleUrls: ['./tile-buy-popup.component.css']
})
export class TileBuyPopupComponent  {

  items:IBuyItem[] = [
    
    { cost: { block: 12, lumber: 6, coin: 0 }, icon: "assets/buildings/house.png", type: CardFamilyTypeEnum.HOUSE },
    { cost: { block: 15, lumber: 9, coin: 0 }, icon: "assets/buildings/storage.png", type: CardFamilyTypeEnum.STORAGE },
    // { cost: { block: 18, lumber: 0, coin: 0 }, icon: "assets/terrain/Stone Block Tall.png", type: CardFamilyTypeEnum.WALL },
    { cost: { block: 3, lumber: 0, coin: 0 }, icon: "assets/buildings/Stone Block.png", type: CardFamilyTypeEnum.ROAD },
    { cost: { block: 0, lumber: 3, coin: 1 }, icon: "assets/buildings/Selector.png", type: CardFamilyTypeEnum.ROAD },
  ]
  

  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  buy(buyItem:IBuyItem) {
    this.buyItem.emit(buyItem);
  }

  onClose() {
    this.buyItem.emit(null);
  }
}