
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { OPEN_STORE } from '../../../redux/actions/actions';
import { IResourceStorage, IState } from 'app/redux/interfaces';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {

  @ViewChild('brickRef') brickRef;
  @ViewChild('lumberRef') lumberRef;
  @ViewChild('coinRef') coinRef;

  resourceStorage: IResourceStorage;

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
    this.gameEngine.store.dispatch({ type: OPEN_STORE });
  }

  /* onBuyItem(buyItem: IBuyItem) {
    this.showStore = false;

    if (!buyItem) return;

    if (buyItem.type == 99) {
      this.gameEngine.store.dispatch({ type: UNDO_ACTION });
    } else {
      this.gameEngine.store.dispatch({ type: SET_NEXT_CARD, payload: buyItem.type });
    }
  } */

}
