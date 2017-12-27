import { Component, OnInit, Input } from '@angular/core';
import { ICost } from './buy-item';
import { GameEngineService } from '../../../../../services/game-engine.service';

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
  constructor(private gameEngine:GameEngineService) { }

  ngOnInit() {
    
    this.resourceNeeded.concat(Array(this.cost.block).map(a=> {return { src: "assets/resources/brick.png" }}));
    this.resourceNeeded.concat(Array(this.cost.lumber).map(a=> {return { src: "assets/resources/wood.png" }}));
    this.resourceNeeded.concat(Array(this.cost.coin).map(a=> {return { src: "assets/resources/coin.png" }}));
  }

  get enabled() {
    return true;
  }

}
