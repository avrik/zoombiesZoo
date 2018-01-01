import { UrlConst } from './../../../consts/url-const';
import { IBuyItem } from './../../board/tile/tile-buy-popup/buy-item/buy-item';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'items-store-popup',
  templateUrl: './items-store-popup.component.html',
  styleUrls: ['./items-store-popup.component.css']
})
export class ItemsStorePopupComponent {

  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  items: IBuyItem[] = [
    { label: "brick", cost: { coin: 2 }, icon: UrlConst.BRICK2, type: 0 },
    { label: "lumber", cost: { coin: 2 }, icon: UrlConst.LUMBER2, type: 1 },
    { label: "wild", cost: { coin: 3 }, icon: UrlConst.WILD, type: 2 },
    {  label: "undo", cost: { coin: 1 }, icon: UrlConst.UNDO, type: 3 },
    { label: "buldoze", cost: { coin: 6 }, icon: UrlConst.BULDOZE, type: 4 },
    { label: "move", cost: { coin: 6 }, icon: UrlConst.MOVE, type: 5 },
  ]

  constructor() { }

  buy(buyItem: IBuyItem) {
    this.buyItem.emit(buyItem);
  }

  onClose() {
    this.buyItem.emit(null);
  }

}
