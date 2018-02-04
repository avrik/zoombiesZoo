import { IState } from './../../../redux/main-reducer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IResourceStorage } from '../../../services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { UNDO_ACTION, SET_NEXT_CARD, OPEN_STORE } from '../../../redux/actions/actions';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {

  @ViewChild('brickRef') brickRef;
  @ViewChild('lumberRef') lumberRef;
  @ViewChild('coinRef') coinRef;

  showStore: boolean;
  resourceStorage: IResourceStorage;

  storeItems: IBuyItem[] = [
    { label: "tree", cost: { coin: 1 }, icon: UrlConst.LUMBER1, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "plant tree" },
    { label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, amount: 3, description: "buy brick" },
    { label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, amount: 3, description: "buy lumber" },
    { label: "wild", cost: { coin: 4 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { label: "bomb", cost: { coin: 4 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { label: "undo", cost: { coin: 0 }, icon: UrlConst.UNDO, type: 99, amount: 9, description: "undo last action" },
  ]

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (this.resourceStorage != newState.resources) {

        if (this.resourceStorage) {
          if (newState.resources.bricks > this.resourceStorage.bricks) this.brickRef.animate();
          if (newState.resources.lumber > this.resourceStorage.lumber) this.lumberRef.animate();
          if (newState.resources.coins > this.resourceStorage.coins) this.coinRef.animate();
        }

        this.resourceStorage = Object.assign({}, newState.resources);
      }
    });
  }

  ngOnInit() {

  }

  openStore() {
    // this.showStore = !this.showStore;
    this.gameEngine.store.dispatch({ type: OPEN_STORE, payload: { items: this.storeItems } });
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
