
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
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
  @ViewChild('silverRef') silverRef;

  resourceStorage: IResourceStorage;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (this.resourceStorage != newState.resources) {

        if (this.resourceStorage) {
          if (newState.resources.bricks > this.resourceStorage.bricks) this.brickRef.animate();
          if (newState.resources.lumber > this.resourceStorage.lumber) this.lumberRef.animate();
          if (newState.resources.coins > this.resourceStorage.coins) this.coinRef.animate();
          if (newState.resources.silver > this.resourceStorage.silver) this.silverRef.animate();
        }

        this.resourceStorage = Object.assign({}, newState.resources);
      }
    });
  }

  ngOnInit() {

  }

  openStore() {
    //this.gameEngine.store.dispatch({ type: OPEN_STORE });
    this.gameEngine.openStore();
  }


}
