
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { IBuyItem } from 'app/redux/interfaces';

@Component({
  selector: 'tile-buy-popup',
  templateUrl: './tile-buy-popup.component.html',
  styleUrls: ['./tile-buy-popup.component.css']
})
export class TileBuyPopupComponent {
  @Input() title: string = "city improvments";

  @Input() items: IBuyItem[]
  @Output() buyItem: EventEmitter<any> = new EventEmitter();

  description:string;
  constructor() { }

  buy(buyItem: IBuyItem) {
    this.buyItem.emit(buyItem);
  }

  onClose() {
    this.buyItem.emit(null);
  }

  onMouseOut(buyItem: IBuyItem) {
    this.description = "";
  }

  onMouseOver(buyItem: IBuyItem) {
    if (buyItem.description) {
      this.description = buyItem.description;
    }

  }
}