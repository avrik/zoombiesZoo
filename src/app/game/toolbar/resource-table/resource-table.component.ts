import { IState } from './../../../redux/main-reducer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IResourceStorage } from '../../../services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { UNDO_ACTION, SET_NEXT_CARD } from '../../../redux/actions/actions';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {

  showStore: boolean;
  resourceStorage: IResourceStorage;

  items: IBuyItem[] = [
    { label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, amount: 6, description: "buy brick" },
    { label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "buy lumber" },
    { label: "wild", cost: { coin: 6 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { label: "bomb", cost: { coin: 0 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { label: "undo", cost: { coin: 0 }, icon: UrlConst.UNDO, type: 99, amount: 6, description: "undo last action" },
    // { label: "buldoze", cost: { coin: 6 }, icon: UrlConst.BULDOZE, type: 4, amount: 3 },
    //{ label: "move", cost: { coin: 6 }, icon: UrlConst.MOVE, type: 5 },
  ]

  constructor(public gameEngine: GameEngineService) {

    //this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)


    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (this.resourceStorage != newState.resources) {
        this.resourceStorage = newState.resources;
      }
    });
  }

  ngOnInit() {

  }

  openStore() {
    this.showStore = !this.showStore;
  }

  onBuyItem(buyItem: IBuyItem) {
    this.showStore = false;

    if (!buyItem) return;

    if (buyItem.type == 99) {
      this.gameEngine.store.dispatch({ type: UNDO_ACTION });
    } else {
      this.gameEngine.store.dispatch({ type: SET_NEXT_CARD, payload: buyItem.type });
    }
  }

}
