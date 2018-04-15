import { Component, OnInit, Input, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { IResourceStorage, IState } from 'app/redux/interfaces';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { Card } from '../../../cards/card';
import { Tile } from '../../../board/tile/tile';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css'],
  animations: [
    trigger('animate', [
      /* state('in', style({
        transform: 'scale(1.4)'
      })),
      state('out', style({
        transform: 'scale(1)'
      })),
      transition('in => out', animate('150ms ease-in')),
      transition('out => in', animate('200ms ease-out')) */

      transition('* => collect', [
        animate('400ms ease', keyframes([
          style({ transform: 'scale(1) translateY(0%)', opacity: 1, offset: 0 }),
          style({ transform: 'scale(1.3) translateY(0%)', opacity: 1, offset: 0.5 }),
          style({ transform: 'scale(1) translateY(0%)', opacity: 1, offset: 1.0 }),
        ]))
      ])])]
})
export class ResourceItemComponent implements OnInit {

  @Input() type: number;
  @Input() amount: number;
  @Input() icon: string;

  state: string = "out";
  resourceStorage: IResourceStorage;
  currentState: IState;
  // totalStorage: number;

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      let storages: Tile[];

      if (newState.tiles) {
        switch (this.type) {
          case 0:
            storages = newState.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE);
            //this.totalStorage = storages.length ? storages.map(a => a.card.collect).reduce((prev, cur) => prev + cur) : 0;
            break;
          case 1:

            storages = newState.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.SAWMILL);
            //this.totalStorage = storages.length ? storages.map(a => a.card.collect).reduce((prev, cur) => prev + cur) : 0;

            break;
          /*  case 2:
             this.totalStorage = 0
             break; */
        }
      }

    })
  }

  animate(event) {
    this.state = "collect";
    /* this.state = "in";
    setTimeout(() => {
      this.state = "out";
    }, 300); */
  }

  animationEnd() {
    this.state = "";
  }

  onClick() {
    this.amount++;
  }

}
