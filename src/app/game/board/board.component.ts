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

  @ViewChild('tileRef') tileRef: ElementRef;
  @ViewChild('mainBoard') mainBoard: ElementRef;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.tiles$.subscribe(tiles => this.tiles = tiles);
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });

    this.emptySlot = new Tile();
  }

  ngOnInit() {
    this.gameEngine.restart();
  }

  getCols() {
    let str: string = ''
    for (var i = 0; i < this.gameEngine.totalRows; i++) {
      str += '63px '
    }
    return str;
  }

  clickEmptySlot() {
    let temp = this.emptySlot.card;
    this.emptySlot.card = this.currentCard;

    if (temp) {
      this.gameEngine.updateCurrentCard = temp;
    } else {
      this.gameEngine.setNextValue();
    }
  }

  onTileOpenStore(event) {
    if (this.currentTileClicked) this.currentTileClicked.showStore = false;
    this.currentTileClicked = event;
  }

}
