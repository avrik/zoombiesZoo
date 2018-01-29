import { IState } from './../../redux/main-reducer';
import { TerrainEnum } from './../../enums/terrain.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';
import { Observable } from 'rxjs/Rx';
import { Card } from '../cards/card';
import { GameLevel } from 'app/game/levels/game-level';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  tiles: Tile[] = [];
  currentCard: Card;
  currentTileClicked: TileComponent;
  tileOver: Tile;
  lastTileClicked: Tile;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
  
      this.tiles = newState.tiles;

      if (this.currentCard != newState.nextCard) {
        //console.log(newState.nextCard)
        this.currentCard = newState.nextCard;
      }

      //this.selectTileOver(newState.tileClicked);
      this.selectTileOver(newState.floatTile);
    }
    )
  }

  ngOnInit() {
    //this.selectTileOver();
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
    //this.selectTileOver(tile);
    if (this.currentTileClicked) {
      this.currentTileClicked.showStore = false;
    }
  }

  selectTileOver(tile: Tile = null) {
    // if (this.tileOver) this.tileOver.select = false;
    //console.log("selectTileOver!!!1");
    //if (tile) tile.select = true;
   /*  let empties: Tile[] = [];

    if (tile) {
      empties = !tile.card ? [tile] : tile.linked.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);

    }
    if (!empties.length) {
      empties = this.tiles.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
    }

    if (empties.length) {
      if (this.tileOver) this.tileOver.select = false;
      this.tileOver = empties[0];
      this.tileOver.select = true;
    } else {
      console.log("not found place for tile over!!!!1");
    }
    debugger; */
  }

  onTileOpenStore(event) {
    if (this.currentTileClicked) {
      this.currentTileClicked.showStore = false;
    }
    this.currentTileClicked = event;
  }

}
