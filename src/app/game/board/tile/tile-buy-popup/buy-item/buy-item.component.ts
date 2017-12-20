import { Component, OnInit, Input } from '@angular/core';
import { ICost } from './buy-item';



@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  @Input() title: string = "";
  @Input() icon: string = ""
  @Input() cost: ICost;

  resourceNeeded: any[] = [];
  constructor() { }

  ngOnInit() {
    let i: number
    for (i = 0; i < this.cost.lumber; i++) {
      this.resourceNeeded.push({ src: "assets/resources/wood.png" })
    }

    for (i = 0; i < this.cost.block; i++) {
      this.resourceNeeded.push({ src: "assets/resources/brick.png" })
    }

    for (i = 0; i < this.cost.coin; i++) {
      this.resourceNeeded.push({ src: "assets/resources/coin.png" })
    }
  }

}
