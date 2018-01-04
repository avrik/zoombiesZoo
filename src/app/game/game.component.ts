import { TerrainEnum } from './../enums/terrain.enum';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { GameLevel } from 'app/game/levels/game-level';
import { MessageType } from '../enums/message-type.enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  total: number;
  totalMax: number = 0;
  currentLevel: GameLevel;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    let fromStorage = localStorage.getItem('totalMax')
    this.totalMax = parseFloat(fromStorage)

    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        this.total = 0;
        tiles.filter(a => a.card && a.card.value > 0).forEach(a => this.total += a.card.value);

        this.totalMax = Math.max(this.total, this.totalMax);
        localStorage.setItem('totalMax', this.totalMax.toString())

        if (tiles.filter(a => (a.terrain.type == TerrainEnum.RESOURCES || a.terrain.type == TerrainEnum.CARD_HOLDER) && !a.card).length == 0 ||
          tiles.filter(a => a.terrain.type == TerrainEnum.CITY  && !a.card).length == 0) {
          this.gameOver();
        }
      }
    })

    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      if (currentLevel && currentLevel.index > 0) {
        if (this.currentLevel) {
          this.messagesService.postMessage({
            type:MessageType.CURTAIN,title: `level ${currentLevel.index} completed!`, message: `Congratulations\nyou have reached the ${this.currentLevel.goal} population goal`
            , butns: [{ label: 'next level' }]
          });
        }
      }
      this.currentLevel = currentLevel
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.messagesService.postMessage({type:MessageType.CURTAIN, title: "Welcome", message: `start your new town`, butns: [{ label: 'ok', action: null }, { label: 'cancel', action: null }] });
    }, 1500);
    this.gameEngine.start();
  }


  gameOver() {
    this.messagesService.postMessage({type:MessageType.POPUP, title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
  }

  restart() {
    this.gameEngine.restart();
  }
}
