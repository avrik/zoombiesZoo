import { IState } from './../../redux/main-reducer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';
import { Card } from '../cards/card';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  tiles: Tile[] = [];
  currentTileClicked: TileComponent;
  lastTileClicked: Tile;

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
    if (this.currentTileClicked) {
      this.currentTileClicked.showStore = false;
    }
    this.currentTileClicked = event;
  }

}
