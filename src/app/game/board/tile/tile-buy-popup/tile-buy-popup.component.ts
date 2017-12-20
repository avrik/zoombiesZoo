import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { log } from 'util';
import { Resources } from 'app/enums/resources.enum';


@Component({
  selector: 'tile-buy-popup',
  templateUrl: './tile-buy-popup.component.html',
  styleUrls: ['./tile-buy-popup.component.css']
})
export class TileBuyPopupComponent  {

  items = [
    { cost: { block: 2, lumber: 0, coin: 0 }, icon: "assets/buildings/Stone Block.png", type: Resources.WALL },
    { cost: { block: 5, lumber: 10, coin: 0 }, icon: "assets/buildings/Wall Block.png", type: Resources.TOWER },
    { cost: { block: 10, lumber: 10, coin: 0 }, icon: "assets/buildings/Door Tall Closed.png", type: Resources.HOUSE },
    { cost: { block: 0, lumber: 0, coin: 5 }, icon: "assets/buildings/Selector.png", type: "selector" },
    // { cost: { block: 10, lumber: 5, coin: 0 }, icon: "assets/buildings/storage.png", type: Resources.STORAGE },
    // { cost: { block: 20, lumber: 10, coin: 0 }, icon: "assets/buildings/fortress.png", type: Resources.TOWER },
    
  ]

  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  buy(num) {
    this.buyItem.emit(this.items[num])
  }
}