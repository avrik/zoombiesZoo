import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from './tile/tile';
import { timeout } from 'q';
import { Card } from '../cards/card';
import { Enemy } from 'app/game/arena/enemy';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  emptySlot: Tile;
  tiles: Tile[] = [];
  //xpos: number;
  //ypos: number;
  currentCard: Card;
  currentTileClicked: TileComponent;
  //enemies: Enemy[] = [];
  @ViewChild('tileRef') tileRef: ElementRef;
  @ViewChild('mainBoard') mainBoard: ElementRef;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.tiles$.subscribe(tiles => this.tiles = tiles);
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });

    /* this.gameEngine.spawnEnemies$.subscribe(enemy => {

      if (enemy) {
        let newEnemy: Enemy = new Enemy();
        this.enemies.push(newEnemy);
      }

    }) */
    this.emptySlot = new Tile();
  }

  ngOnInit() {
    this.gameEngine.restart();

    /* let timer = Observable.timer(2000, 100);
    timer.subscribe(t => {

      if (!this.gameEngine.gameOver) {
        this.enemies.forEach(enemy => {
          enemy.ypos--;

          if (Math.floor(Math.random() * 2) == 0) {
            enemy.xpos++;
          } else {
            enemy.xpos--;
          }

        })
      }

    }); */
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
