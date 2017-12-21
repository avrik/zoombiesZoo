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
  @Input() placed: boolean;
  @Output() collected:EventEmitter<any> = new EventEmitter();

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit() {
  }

  clickTileCard() {
    if (this.card.collect) {
      this.gameEngine.collect(this.card, this.card.collect);
      this.collected.emit();
    }
  }

}
