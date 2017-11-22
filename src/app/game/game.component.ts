import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  total: number;
  totalMax: number = 0;
  constructor(private gameEngine: GameEngineService) {

    let fromStorage = localStorage.getItem('totalMax')
    this.totalMax = parseFloat(fromStorage)
    
    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        this.total = 0;
        tiles.filter(a => a.card && a.card.value > 0).forEach(a => this.total += a.card.value);

        this.totalMax = Math.max(this.total, this.totalMax);
        localStorage.setItem('totalMax',this.totalMax.toString())
      }

    })
  }

  ngOnInit() {
  }

}
