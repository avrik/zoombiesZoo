import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ICard } from '../../../services/game-engine.service';
import { Tile } from './tile';


@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [
    trigger('slideLeft', [
      state('idle', style({
      })),
      state('left', style({
        left: '100px'
      })),
      state('right', style({
        overflow: 'hidden',
        left: '-100px',

      })),
      state('up', style({
        overflow: 'hidden',
        top: '-100px',

      })),
      state('down', style({
        overflow: 'hidden',
        top: '100px',

      })),
      transition('idle => left', animate('200ms ease-in-out')),
      transition('idle => right', animate('200ms ease-in-out'))
    ])
  ]
})
export class TileComponent implements OnInit {
  //slideTo: string = 'idle';

  @Input() data: Tile;
  @Input() onBoard: boolean = true;

  constructor() { }

  ngOnInit(): void {
    /* setTimeout(()=> {
      this.slideTo = "left";
    }, 1000); */
  }


  getCSSClass() {

    return this.onBoard? "tile block":"tile block-out";
  }

}
