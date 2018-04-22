import { Component, OnInit, Input } from '@angular/core';
import { UrlConst } from '../../../consts/url-const';


@Component({
  selector: 'item-img',
  templateUrl: './item-img.component.html',
  styleUrls: ['./item-img.component.css']
})
export class ItemImgComponent implements OnInit {
  @Input() size: number = 30;
  @Input() type: string;
  @Input() level: number;
  url: string;

  constructor() { }

  ngOnInit() {
    switch (this.type) {
      case 'coin':
        this.url = UrlConst.COIN_IMG;
        break;
      case 'coin_silver':
        this.url = UrlConst.COIN_SILVER;
        break;
      case 'brick':

        switch (this.level) {
          case 2:
            this.url = UrlConst.BRICK3;
            break;
          case 3:
            this.url = UrlConst.BRICK4;
            break;
          default:
            this.url = UrlConst.BRICK_IMG;
            break;
        }

        break;
      case 'lumber':
        this.url = UrlConst.LUMBER_IMG;
        break;
      case 'person':
        this.url = UrlConst.PERSON1;
        break;

    }
  }

}
