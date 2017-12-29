import { IBuyItem } from './../../board/tile/tile-buy-popup/buy-item/buy-item';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'items-store-popup',
  templateUrl: './items-store-popup.component.html',
  styleUrls: ['./items-store-popup.component.css']
})
export class ItemsStorePopupComponent implements OnInit {
  items: IBuyItem[] = [
    { cost: { coin: 1 }, icon: "assets/undo.png", type: 0 },
    { cost: { coin: 3 }, icon: "assets/resources/wood.png", type: 0 },
    { cost: { coin: 3 }, icon: "assets/resources/bricks.png", type: 0 },
    { cost: { coin: 6 }, icon: "assets/resources/diamond.png", type: 0 },
  ]
  constructor() { }

  ngOnInit() {

  }

  buy(item: IBuyItem) {

  }

  onClose() {

  }

}
