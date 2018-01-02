import { TerrainEnum } from './../../enums/terrain.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';
import { Observable } from 'rxjs/Rx';
import { Card } from '../cards/card';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  emptySlot: Tile;
  tiles: Tile[] = [];
  currentCard: Card;
  currentTileClicked: TileComponent;
  tileOver: Tile;

  @ViewChild('tileRef') tileRef: ElementRef;
  @ViewChild('mainBoard') mainBoard: ElementRef;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.tiles$.subscribe(tiles => {
      this.tiles = tiles;
    });
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });

    this.emptySlot = new Tile();
  }

  ngOnInit() {
    
    this.selectTileOver();
  }

  getCols() {
    let str: string = ''
    for (var i = 0; i < this.gameEngine.totalRows; i++) {
      str += '63px '
    }
    return str;
  }

  /* clickEmptySlot() {
    let temp = this.emptySlot.card;
    this.emptySlot.card = this.currentCard;

    if (temp) {
      this.gameEngine.updateCurrentCard = temp;
    } else {
      this.gameEngine.setNextValue();
    }
  } */

  onTileClicked(tile: Tile) {
    this.selectTileOver(tile)
  }

  selectTileOver(tile: Tile = null) {
    if (this.tileOver) this.tileOver.select = false;

    let empties: Tile[];

    if (tile) {
      empties = tile.getAllEmpties().filter(a => a.terrain.type == TerrainEnum.RESOURCES);
    } else {
      empties = this.tiles.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
    }

    this.tileOver = empties[0];
    if (this.tileOver) this.tileOver.select = true;
  }

  onTileOpenStore(event) {
    if (this.currentTileClicked) this.currentTileClicked.showStore = false;
    this.currentTileClicked = event;
  }

}
