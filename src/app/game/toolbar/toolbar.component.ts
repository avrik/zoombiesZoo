
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { Resources } from 'app/enums/resources.enum';
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
  //@ViewChild('myBar') myBar: ElementRef;

  years: number;
  score: number = 0;
  population: number;

  popProgress: number = 0;
  currentLevel: GameLevel;
  //prevLevel: GameLevel;
  timeout: any;
  populationTarget: number;
  popCount:number;
  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      if (currentLevel) {
        this.popCount=0;
        //this.prevLevel = this.currentLevel?this.currentLevel:currentLevel;
        this.populationTarget = this.currentLevel ? currentLevel.goal - this.currentLevel.goal : currentLevel.goal;
        this.currentLevel = currentLevel;
        setTimeout(() => {
          //this.popProgress = 0;
          this.move(0);
          /* setTimeout(() => {
            let percent: number = Math.round(this.population / this.currentLevel.goal * 100);
            this.move(percent)
          }, 2000); */
        }, 1500);
      }

    });

    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        let arr = tiles.filter(a => a.card && !a.card.autoPlaced).map(a => a.card.value)
        if (arr.length) this.score = arr.reduce((prev, cur) => prev + cur);
      }
    })
    this.gameEngine.years$.subscribe(years => { this.years = years })
    this.gameEngine.population$.subscribe(population => {

      if (!isNaN(population)) {
        this.population = population;
        //this.move(Math.round(this.population*100/100));

        if (this.currentLevel) {
          //let percent: number = Math.round(this.population / this.currentLevel.goal * 100);
          this.popCount++;
          let percent: number = Math.round(this.popCount / this.populationTarget * 100);
          //let percent: number = Math.round((this.population-this.prevLevel.goal) / (this.currentLevel.goal - this.prevLevel.goal) * 100);
  
          //this.popProgress = percent;
          console.log("PERCENT!!! " + percent)
          this.move(percent)
        }
        //if (this.myBar) this.myBar.nativeElement.style.width = percent + '%';
      }

    }
    )
    //this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
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
