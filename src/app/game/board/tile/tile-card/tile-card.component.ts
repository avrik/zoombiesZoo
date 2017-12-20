import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';


@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.css']
})
export class TileCardComponent implements OnInit {
  @Input() card: Card;
  @Output() collected:EventEmitter<any> = new EventEmitter();

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit() {
  }

  /* getCSSClass() {
    return this.onBoard ? "tile block" : "tile block-out";
  } */

  clickTileCard() {
    if (this.card.collect) {
      //this.tile.overMe = false;
      this.gameEngine.collect(this.card, this.card.collect);
      //this.tile.clear();
      //this.gameEngine.nextTurn();
      this.collected.emit();
    }
  }

}
