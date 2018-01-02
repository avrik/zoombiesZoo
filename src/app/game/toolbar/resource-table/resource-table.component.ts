import { UrlConst } from './../../../consts/url-const';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from '../../cards/card';
import { Resources } from 'app/enums/resources.enum';
import { GameLevel } from '../../levels/game-level';
import { IResourceStorage } from '../../../services/game-engine.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {
  @ViewChild('myBar') myBar: ElementRef;
  collected: Card[] = [];

  lumber: number = 0;
  blocks: number = 0;
  coins: number = 0;
  wheat: number = 0;

  years: number;
  score: number = 0;
  population: number;
  currentCard: Card;

  showStore: boolean;

  popProgress: number = 0;
  cardHint: Card;
  currentLevel: GameLevel;

  resourceStorage: IResourceStorage;

  items: IBuyItem[] = [
    { label: "brick", cost: { coin: 2 }, icon: UrlConst.BRICK2, type: 0, amount: 6 ,description:"buy brick"},
    { label: "lumber", cost: { coin: 2 }, icon: UrlConst.LUMBER2, type: 1, amount: 6,description:"buy lumber" },
    { label: "wild", cost: { coin: 3 }, icon: UrlConst.WILD, type: 2, amount: 3 ,description:"buy wild-card"},
    { label: "undo", cost: { coin: 1 }, icon: UrlConst.UNDO, type: 3, amount: 9 ,description:"undo last action"},
   // { label: "buldoze", cost: { coin: 6 }, icon: UrlConst.BULDOZE, type: 4, amount: 3 },
    //{ label: "move", cost: { coin: 6 }, icon: UrlConst.MOVE, type: 5 },
  ]

  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.currentLevel$.subscribe(currentLevel => {
      this.currentLevel = currentLevel;
      setTimeout(() => {
        this.popProgress = 0;
      }, 1000);
    });
    this.gameEngine.cardHint$.subscribe(cardHint => this.cardHint = cardHint);
    this.gameEngine.currentCard$.subscribe(currentCard => this.currentCard = currentCard);
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
    this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
  }


  move(target: number) {
    console.log('1111 ' + target)
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

  openStore() {
    this.showStore = !this.showStore;
  }

  onBuyItem(buyItem: IBuyItem) {
    this.showStore = false;

    if (!buyItem) return;
    switch (buyItem.type) {
      case 3:
        this.gameEngine.doUndo();
        break;
      case 1:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.LUMBER, 1)
        break;
      case 0:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.BRICK, 1)
        break;
      case 2:
        this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(CardFamilyTypeEnum.WILD)
        break;


    }
  }


  ngOnInit() {
  }

}
