import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { Card } from '../../cards/card';
import { Resources } from 'app/enums/resources.enum';

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

  showStore:boolean;
  
  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.currentCard$.subscribe(currentCard => this.currentCard = currentCard);
    this.gameEngine.tiles$.subscribe(tiles => {
      if (tiles) {
        this.total = 0;
        tiles.filter(a => a.card && a.card.value > 0).forEach(a => this.total += a.card.value);
      }

    })
    this.gameEngine.years$.subscribe(years => { this.years = years })
    this.gameEngine.population$.subscribe(population => {
      // if (!isNaN(this.population)) {
      this.population = population;
      this.move(Math.round(this.population*100/100));
      //}

    }
    )
    this.gameEngine.collected$.subscribe(collected => {
      this.collected = collected;
      if (collected && collected.length) {

        this.lumber = collected.filter(a => a && a.family.name == Resources.LUMBER).length;
        this.blocks = collected.filter(a => a && a.family.name == Resources.BLOCK).length;
        this.wheat = collected.filter(a => a && a.family.name == Resources.WHEAT).length;
        this.coins = collected.filter(a => a && a.family.name == Resources.COIN).length;
      }
    });
  }

  getBonusPoints(name: string): number {
    let arr: number[] = this.collected.filter(a => a.name === name).map(a => a.bonus);
    if (arr && arr.length) {
      let bonus: number = arr.reduce((prev, cur) => { return prev + cur })
      return bonus ? bonus / 10 : 0;
    }
    return 0;
  }

  move(target: number) {
    console.log('1111 '+target)
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
    this.showStore=!this.showStore;
  }

  ngOnInit() {
  }

}
