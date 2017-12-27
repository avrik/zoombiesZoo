import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from '../../cards/card';
import { Resources } from 'app/enums/resources.enum';
import { CardFamilyTypeEnum } from '../../../enums/card-family-type-enum.enum';
import { GameLevel } from '../../levels/game-level';
import { IResourceStorage } from '../../../services/game-engine.service';

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
  total: number;
  population: number;
  currentCard: Card;

  showStore: boolean;

  popProgress: number = 0;
  cardHint: Card;
  currentLevel: GameLevel;

  resourceStorage:IResourceStorage;

  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.currentLevel$.subscribe(currentLevel => this.currentLevel = currentLevel);
    this.gameEngine.cardHint$.subscribe(cardHint => this.cardHint = cardHint);
    this.gameEngine.currentCard$.subscribe(currentCard => this.currentCard = currentCard);
    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        this.total = 0;
        tiles.filter(a => a.card && a.card.value > 0).forEach(a => this.total += a.card.value);
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

  ngOnInit() {
  }

}
