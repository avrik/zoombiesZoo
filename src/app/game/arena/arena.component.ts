import { Component, OnInit } from '@angular/core';
import { Enemy } from './enemy';
import { GameEngineService } from 'app/services/game-engine.service';
import { log } from 'util';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {
  enemies: Enemy[] = [];
  ticks = 0;
  spots: any[]
  constructor(private gameEngine: GameEngineService) {
    this.spots = Array(20);
    this.gameEngine.spawnEnemies$.subscribe(enemy => {

      if (enemy) {
        let newEnemy: Enemy = new Enemy();
        this.enemies.push(newEnemy);
      }

    })
  }


  ngOnInit() {
    let timer = Observable.timer(2000, 100);
    timer.subscribe(t => {

      if (!this.gameEngine.gameOver) {
        this.enemies.forEach(enemy => {
          //enemy.move()
          enemy.xpos++;

          if (Math.floor(Math.random() * 2) == 0) {
            enemy.ypos++;
          } else {
            enemy.ypos--;
          }

        })
      }

    });
  }

  onSpotClick(event) {

    console.log("spotClicked!")
  }

}
