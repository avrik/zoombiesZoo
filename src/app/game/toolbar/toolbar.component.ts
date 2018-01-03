
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
  @ViewChild('myBar') myBar: ElementRef;

  years: number;
  score: number = 0;
  population: number;

  popProgress: number = 0;
  currentLevel: GameLevel;
  //resourceStorage: IResourceStorage;

  /* items: IBuyItem[] = [
    { label: "brick", cost: { coin: 2 }, icon: UrlConst.BRICK2, type: 0, amount: 6 ,description:"buy brick"},
    { label: "lumber", cost: { coin: 2 }, icon: UrlConst.LUMBER2, type: 1, amount: 6,description:"buy lumber" },
    { label: "wild", cost: { coin: 3 }, icon: UrlConst.WILD, type: 2, amount: 3 ,description:"buy wild-card"},
    { label: "undo", cost: { coin: 1 }, icon: UrlConst.UNDO, type: 3, amount: 9 ,description:"undo last action"},
  ] */

  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      this.currentLevel = currentLevel;
      setTimeout(() => {
        this.popProgress = 0;
      }, 1000);
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
        let percent: number = this.population;
        if (this.currentLevel) this.popProgress = (this.population / this.currentLevel.goal) * 100;

        //if (this.myBar) this.myBar.nativeElement.style.width = percent + '%';
      }

    }
    )
    //this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
  }

  ngOnInit() {
  }

  move(target: number) {
    if (!this.myBar) return;
    let width = this.myBar.nativeElement.style.width;

    let frame = () => {
      if (width >= target) {

      } else {
        width++;
        this.myBar.nativeElement.style.width = width + '%';
        setTimeout(() => {
          frame();
        }, 100);
      }
    }

    frame()
  }

}
