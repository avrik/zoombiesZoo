
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { GameLevel } from '../levels/game-level';
import { UrlConst } from '../../consts/url-const';
import { Card } from 'app/game/cards/card';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  years: number;
  score: number = 0;
  population: number;

  popProgress: number = 0;
  currentLevel: GameLevel;

  timeout: any;
  populationTarget: number;
  popCount: number;

  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      if (currentLevel) {
        this.popCount = 0;
        //this.prevLevel = this.currentLevel?this.currentLevel:currentLevel;
        this.populationTarget = this.currentLevel ? currentLevel.goal - this.currentLevel.goal : currentLevel.goal;
        this.currentLevel = currentLevel;
        setTimeout(() => {
          this.move(0);
        }, 1500);
      }

    });

    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        let arr = tiles.filter(a => a.card && !a.card.autoPlaced).map(a => a.card.value)
        if (arr && arr.length) {
          this.score = arr.reduce((prev, cur) => prev ? prev + cur : cur);
          this.score += this.gameEngine.gameState.population * 50;
          this.score += this.gameEngine.gameState.resourceStorage.bricks * this.gameEngine.getNewCard(CardFamilyTypeEnum.BRICK, 1).value
          this.score += this.gameEngine.gameState.resourceStorage.lumber * this.gameEngine.getNewCard(CardFamilyTypeEnum.LUMBER, 1).value
          this.score += this.gameEngine.gameState.resourceStorage.coins * this.gameEngine.getNewCard(CardFamilyTypeEnum.COIN, 1).value
        }
      }
    })
    this.gameEngine.years$.subscribe(years => { this.years = years })
    this.gameEngine.population$.subscribe(population => {

      if (!isNaN(population)) {
        this.population = population;
        //this.move(Math.round(this.population*100/100));

        if (this.currentLevel) {

          this.popCount++;
          let percent: number = Math.min(Math.round(this.popCount / this.populationTarget * 100), 100);

          console.log("PERCENT!!! " + percent)
          this.move(percent)
        }
      }
    }
    )
  }

  ngOnInit() {
  }

  move(target: number) {
    clearTimeout(this.timeout);
    let frame = () => {
      if (target == 0 && this.popProgress > 0) {
        this.popProgress--;

        this.timeout = setTimeout(() => {
          frame();
        }, 10);
      } else if (this.popProgress < target) {
        this.popProgress++;

        this.timeout = setTimeout(() => {
          frame();
        }, 10);
      }
    }

    frame()
  }

}
