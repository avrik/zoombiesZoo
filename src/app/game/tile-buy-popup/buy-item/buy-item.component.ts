import { MessageType } from './../../../enums/message-type.enum';
import { MessagesService } from 'app/services/messages.service';
import { GameEngineService } from 'app/services/game-engine.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IBuyItem, IResourceStorage, IState } from 'app/redux/interfaces';

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
  enabled: boolean = true;

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {

    this.resourceNeeded.concat(Array(this.buyItem.cost.block).map(a => { return { src: "assets/resources/brick.png" } }));
    this.resourceNeeded.concat(Array(this.buyItem.cost.lumber).map(a => { return { src: "assets/resources/wood.png" } }));
    this.resourceNeeded.concat(Array(this.buyItem.cost.coin).map(a => { return { src: "assets/resources/coin.png" } }));

    //this.gameEngine.store.subscribe(()=>{
    let newState: IState = this.gameEngine.store.getState();

    if (this.buyItem && this.buyItem.cost) {
      this.enabled = (
        (!this.buyItem.cost.block || newState.resources.bricks >= this.buyItem.cost.block) &&
        (!this.buyItem.cost.lumber || newState.resources.lumber >= this.buyItem.cost.lumber) &&
        (!this.buyItem.cost.coin || newState.resources.coins >= this.buyItem.cost.coin) &&
        (this.buyItem.amount > 0 || isNaN(this.buyItem.amount))
      ) ? true : false;
    }
  }

  onBuy() {
    this.buy.emit(this.buyItem);
    this.buyItem.amount--;
    this.gameEngine.buyItem(this.buyItem);
  }
}