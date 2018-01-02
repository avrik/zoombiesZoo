import { IResourceStorage, GameEngineService } from 'app/services/game-engine.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICost, IBuyItem } from './buy-item';


@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  @Input() title: string = "";
  @Input() icon: string = ""
  @Input() buyItem: IBuyItem;
  @Output() buy: EventEmitter<IBuyItem> = new EventEmitter();

  
  resourceNeeded: any[] = [];
  resourceStorage: IResourceStorage;
  enabled: boolean;

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {

    this.resourceNeeded.concat(Array(this.buyItem.cost.block).map(a => { return { src: "assets/resources/brick.png" } }));
    this.resourceNeeded.concat(Array(this.buyItem.cost.lumber).map(a => { return { src: "assets/resources/wood.png" } }));
    this.resourceNeeded.concat(Array(this.buyItem.cost.coin).map(a => { return { src: "assets/resources/coin.png" } }));

    this.gameEngine.resourceStorage$.subscribe(resourceStorage => {
      this.resourceStorage = resourceStorage;

      if (this.buyItem && this.buyItem.cost && this.resourceStorage) {
        this.enabled = (
          (!this.buyItem.cost.block || resourceStorage.bricks >= this.buyItem.cost.block) &&
          (!this.buyItem.cost.lumber || resourceStorage.lumber >= this.buyItem.cost.lumber) &&
          (!this.buyItem.cost.coin || resourceStorage.coins >= this.buyItem.cost.coin)
        ) ? true : false;

      }

    })
  }


  onBuy() {
    this.buy.emit(this.buyItem)
  }

}
