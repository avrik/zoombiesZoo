import { IBuyItem } from './../../board/tile/tile-buy-popup/buy-item/buy-item';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'items-store-popup',
  templateUrl: './items-store-popup.component.html',
  styleUrls: ['./items-store-popup.component.css']
})
export class ItemsStorePopupComponent  {

  @Output() buyItem: EventEmitter<any> = new EventEmitter();
  
  items: IBuyItem[] = [
    { label:"undo",cost: { coin: 1 }, icon: "assets/undo.png", type: 0 },
    { label:"buy3",cost: { coin: 3 }, icon: "assets/resources/wood.png", type: 0 },
    { label:"buy3",cost: { coin: 3 }, icon: "assets/resources/bricks.png", type: 0 },
    { label:"wild",cost: { coin: 6 }, icon: "assets/resources/diamond.png", type: 0 },
  ]
  
  constructor() { }

  buy(buyItem:IBuyItem) {
    this.buyItem.emit(buyItem);
  }

  onClose() {
    this.buyItem.emit(null);
  }

}
