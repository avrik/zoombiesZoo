import { IState } from './../../redux/main-reducer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';
import { Card } from '../cards/card';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { UrlConst } from 'app/consts/url-const';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { MOVE_BUILDING_ACTION, PLACE_BUILDING } from '../../redux/actions/actions';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  storeItems: IBuyItem[] = [
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { label: 'laboratory', cost: { block: 18, lumber: 6, coin: 3 }, icon: UrlConst.LABORATORY, type: CardFamilyTypeEnum.LABORATORY, description: "produce TNT!" },
    { label: 'church', cost: { block: 21, lumber: 12, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
  ]

  storeItems2: IBuyItem[] = [
    { label: 'move', cost: { block: 0, lumber: 0, coin: 3 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
  ]

  
  tiles: Tile[] = [];
  currentTileClicked: TileComponent;
  lastTileClicked: Tile;

  showStore:boolean;
  
  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      this.tiles = newState.tiles;
    })
  }

  ngOnInit() {

  }

  getCols() {
    let str: string = ''
    for (var i = 0; i < this.gameEngine.totalRows; i++) {
      str += '63px '
    }
    return str;
  }

  onTileClicked(tile: Tile) {
    this.lastTileClicked = tile

    if (this.currentTileClicked) {
      this.currentTileClicked.showStore = false;
    }
  }

  onTileOpenStore(event) {
    /* if (this.currentTileClicked) {
      this.currentTileClicked.showStore = false;
    }
    this.currentTileClicked = event; */
    this.showStore=true;

  }


  buyItem(buyItem: IBuyItem) {
    this.showStore = false;
    if (!buyItem) {
      //this.openStore.emit(null);
      return;
    }

    if (buyItem.type == 10) {
      this.gameEngine.store.dispatch({ type: MOVE_BUILDING_ACTION, payload: this.currentTileClicked });
    } else {
      this.gameEngine.store.dispatch({ type: PLACE_BUILDING, payload: { tile: this.currentTileClicked, buyItem: buyItem } });
    }
  }

}
