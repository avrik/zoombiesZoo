
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { GameLevel, CityLevel } from '../levels/game-level';
import { UrlConst } from '../../consts/url-const';
import { Card } from 'app/game/cards/card';
import { IState } from '../../redux/main-reducer';

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
  currentCityLevel: CityLevel;

  timeout: any;
  populationTarget: number;
  popCount: number;

  constructor(public gameEngine: GameEngineService) {
    
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState()
      this.years = newState.turn;
      this.score = newState.score;
      this.currentLevel = newState.level;
      this.population = newState.population;
      if (this.population != newState.population) {
        this.popCount++;
        let percent: number = Math.min(Math.round(this.popCount / this.populationTarget * 100), 100);

        console.log("PERCENT!!! " + percent)
        this.move(percent);
      }

      if (this.currentCityLevel != newState.cityLevel) {
        this.currentCityLevel = newState.cityLevel;
        this.popCount = 0;
        this.populationTarget = this.currentCityLevel ? newState.cityLevel.goal - this.currentCityLevel.goal : newState.cityLevel.goal;
        
        setTimeout(() => {
          this.move(0);
        }, 1500);
      }
    })
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
