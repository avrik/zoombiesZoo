import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BuildingEnum } from 'app/enums/building-enum.enum';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';

@Component({
  selector: 'tile-buy-popup',
  templateUrl: './tile-buy-popup.component.html',
  styleUrls: ['./tile-buy-popup.component.css']
})
export class TileBuyPopupComponent  {

  items = [
    { cost: { block: 6, lumber: 0, coin: 0 }, icon: "assets/buildings/Stone Block.png", type: CardFamilyTypeEnum.ROAD },
    { cost: { block: 12, lumber: 9, coin: 0 }, icon: "assets/buildings/house.png", type: CardFamilyTypeEnum.HOUSE },
    { cost: { block: 36, lumber: 12, coin: 0 }, icon: "assets/buildings/storage.png", type: CardFamilyTypeEnum.STORAGE },
    { cost: { block: 18, lumber: 0, coin: 0 }, icon: "assets/terrain/Stone Block Tall.png", type: CardFamilyTypeEnum.WALL },
  ]

  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  buy(num) {
    this.buyItem.emit(this.items[num])
  }
}