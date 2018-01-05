import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IResourceStorage } from '../../../services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {

  showStore: boolean;
  resourceStorage: IResourceStorage;

  items: IBuyItem[] = [
    { label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: 0, amount: 6 ,description:"buy brick"},
    { label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: 1, amount: 6,description:"buy lumber" },
    { label: "wild", cost: { coin: 6 }, icon: UrlConst.WILD, type: 2, amount: 3 ,description:"buy wild-card"},
    { label: "undo", cost: { coin: 6 }, icon: UrlConst.UNDO, type: 3, amount: 6 ,description:"undo last action"},
   // { label: "buldoze", cost: { coin: 6 }, icon: UrlConst.BULDOZE, type: 4, amount: 3 },
    //{ label: "move", cost: { coin: 6 }, icon: UrlConst.MOVE, type: 5 },
  ]

  constructor(public gameEngine: GameEngineService) {
  
    this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
  }

  ngOnInit() {
  }

  openStore() {
    this.showStore = !this.showStore;
  }

  onBuyItem(buyItem: IBuyItem) {
    this.showStore = false;

    if (!buyItem) return;
    switch (buyItem.type) {
      case 3:
        this.gameEngine.doUndo();
        break;
      case 1:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.LUMBER, 1)
        break;
      case 0:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.BRICK, 1)
        break;
      case 2:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.WILD)
        break;
    }
  }

}
