import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService, ICard } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';

const colors = ["red", "green", "blue"];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  emptySlot: Tile;
  tiles: Tile[] = [];
  xpos: number;
  ypos: number;
  currentCard: ICard;
  
  @ViewChild('tileRef') tileRef: ElementRef;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.tiles$.subscribe(tiles => this.tiles = tiles);
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });
    this.emptySlot = new Tile()
  }

  ngOnInit() {
    this.gameEngine.restart();
    //this.currentCard = this.currentCard.cards[0];
  }

  getCols() {
    let str: string = ''
    for (var i = 0; i < this.gameEngine.totalCols; i++) {
      str += '51px '
    }
    return str;
  }

  clickTile(event: MouseEvent, tile: Tile) {
    if (!tile.card) {
      this.tileRef.nativeElement.style.opacity = 0;
      setTimeout(a => {
        this.tileRef.nativeElement.style.opacity = 1;
      }, 200);

      tile.card = this.currentCard;

      this.gameEngine.findMatch(tile);
      this.gameEngine.nextTurn();
    }
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

  onMove(event) {
    this.xpos = event.screenX - 20;
    this.ypos = event.screenY - 150;
  }

}
