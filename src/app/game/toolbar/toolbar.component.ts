import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { GameLevel, CityLevel } from '../levels/game-level';
import { IState } from 'app/redux/interfaces';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  years: number;
  days: number;
  score: number = 0;
  population: number;
  currentLevel: GameLevel;
  currentCityLevel: CityLevel;
  levelName:string;
  percent: number;
  turnsLeft: number;

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState()
      this.years = Math.round(newState.turn / 360) + 1;
      this.days = newState.turn;
      this.score = newState.score;
      this.turnsLeft = newState.energy;
      this.currentLevel = newState.level;
      this.currentCityLevel = newState.cityLevel;

      this.levelName = this.currentCityLevel.name
      if (this.population != newState.population) {
        this.population = newState.population;
   
        let prevGoal: number = newState.cityLevel.prevLevel ? newState.cityLevel.prevLevel.goal : 0;
        let curGoal: number = newState.cityLevel.goal - prevGoal;

        this.percent = Math.max(Math.round((this.population - prevGoal) / curGoal * 100), 0);

        console.log("PERCENT!!! " + this.percent)
      }
    })
  }

  ngOnInit() {

  }

}
