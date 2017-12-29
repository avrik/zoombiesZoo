import { TerrainEnum } from './../enums/terrain.enum';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  total: number;
  totalMax: number = 0;
  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    let fromStorage = localStorage.getItem('totalMax')
    this.totalMax = parseFloat(fromStorage)

    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        this.total = 0;
        tiles.filter(a => a.card && a.card.value > 0).forEach(a => this.total += a.card.value);

        this.totalMax = Math.max(this.total, this.totalMax);
        localStorage.setItem('totalMax', this.totalMax.toString())



        if (tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card).length == 0 ||
          tiles.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card).length == 0) {
          this.gameOver();
        }

      }

    })

    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      if (currentLevel && currentLevel.index > 0) {
        this.messagesService.postMessage({ title: `level ${currentLevel.index} completed!`, message: `Congratulations\nyou have reached the ${currentLevel.goal} population goal` });
      }

    })
  }

  ngOnInit() {
    /* setTimeout(() => {
      this.messagesService.postMessage({ title: "this is a new game", message: `Congratulations \nyou have reached`, butns: [{ label: 'ok', action: null }, { label: 'cancel', action: null }] });
    }, 500); */
    
  }

  gameOver() {
    this.messagesService.postMessage({ title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
  }

  restart() {
    this.gameEngine.restart();
  }
}
