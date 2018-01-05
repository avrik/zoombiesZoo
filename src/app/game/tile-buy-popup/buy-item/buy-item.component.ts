import { MessageType } from './../../../enums/message-type.enum';
import { MessagesService } from 'app/services/messages.service';
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

  constructor(private gameEngine: GameEngineService, private messagesService:MessagesService) {

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
          (!this.buyItem.cost.coin || resourceStorage.coins >= this.buyItem.cost.coin) &&
          (this.buyItem.amount>0 || isNaN(this.buyItem.amount))
        ) ? true : false;
      }
    })
  }


  onBuy() {

    let testResources: IResourceStorage =
      {
        bricks: this.buyItem.cost.block ? this.resourceStorage.bricks - this.buyItem.cost.block : this.resourceStorage.bricks,
        lumber: this.buyItem.cost.lumber ? this.resourceStorage.lumber - this.buyItem.cost.lumber : this.resourceStorage.lumber,
        coins: this.buyItem.cost.coin ? this.resourceStorage.coins - this.buyItem.cost.coin : this.resourceStorage.coins
      }

    if (testResources.bricks >= 0 && testResources.lumber >= 0 && testResources.coins >= 0) {

      this.gameEngine.updateResourceStorage = testResources;
      let total: number = 0;
      if (this.buyItem.cost.block) total += this.buyItem.cost.block;
      if (this.buyItem.cost.lumber) total += this.buyItem.cost.lumber;

      this.gameEngine.removeFromResourcesStorage(total);
      if (this.buyItem.amount) {
        this.buyItem.amount--;
      }

      this.buy.emit(this.buyItem);
    } else{
      this.messagesService.postMessage({ title: "not enough resources!", type: MessageType.TOOLBAR })
    }
  }
}