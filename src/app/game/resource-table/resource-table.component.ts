import { Component, OnInit } from '@angular/core';
import { GameEngineService, ICard } from '../../services/game-engine.service';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {
  collected: ICard[] = [];

  lumber: number = 0;
  blocks: number = 0;
  coins: number = 0;
  graves: number = 0;
  blocksBonus: number = 0;
  
  constructor(public gameEngine: GameEngineService) {
    this.gameEngine.collected$.subscribe(collected => {
      this.collected = collected;
      if (collected && collected.length) {
        this.lumber = collected.filter(a => a.name === "lumber").length;
        this.blocks = collected.filter(a => a.name === "block").length;
        this.coins = collected.filter(a => a.name === "coin").length;
        this.graves = collected.filter(a => a.name === "grave").length;

        let arr: number[] = collected.filter(a => a.name === "block").map(a => a.bonus);
        if (arr && arr.length) {
          let bonus: number = arr.reduce((prev, cur) => { return prev + cur })
          this.blocksBonus = bonus ? bonus / 10 : 0;
        }

      }

    });
  }
  ngOnInit() {
  }

}
