import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
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
      state('in', style({
        transform: 'scale(1.4)'
      })),
      state('out', style({
        transform: 'scale(1)'
      })),
      transition('in => out', animate('150ms ease-in')),
      transition('out => in', animate('200ms ease-out'))
    ])
  ]
})
export class ResourceItemComponent implements OnInit {

  @Input() type: number;
  @Input() amount: number;
  @Input() icon: string;

  state: string = "out";
  resourceStorage: IResourceStorage;
  currentState: IState;
  totalStorage: number;

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      let storages: Tile[];

      switch (this.type) {
        case 0:
          if (newState.tiles) {
            storages = newState.tiles.filter(a => a.card && a.card.family &&  a.card.family.name == CardFamilyTypeEnum.STORAGE);
            this.totalStorage = storages.length ? storages.map(a => a.card.collect).reduce((prev, cur) => prev + cur) : 0;
          }

          break;
        case 1:
          if (newState.tiles) {
            storages = newState.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.SAWMILL);
            this.totalStorage = storages.length ? storages.map(a => a.card.collect).reduce((prev, cur) => prev + cur) : 0;
          }
          break;
        case 2:
          this.totalStorage = 0
          break;
        default:
          break;
      }

    })
  }

  animate() {
    this.state = "in";
    setTimeout(() => {
      this.state = "out";
    }, 300);
  }

  onClick() {
    this.amount++;
  }

}
