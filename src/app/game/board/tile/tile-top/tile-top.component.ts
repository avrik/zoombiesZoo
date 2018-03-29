import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'app/game/board/tile/tile';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

const percentX = '75%'
const percentY = '40%'
const percentXY = '20%'
const selay = '150ms linear';

@Component({
  selector: 'tile-top',
  templateUrl: './tile-top.component.html',
  styleUrls: ['./tile-top.component.css'],
  animations: [
    trigger('animState', [
      transition('* => init', [
        animate(selay, keyframes([
          style({ transform: 'scale(0) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.2) translateY(-10%)', offset: 0.6 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 }),
        ]))
      ]),
      
      transition('* => up', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateY(-${percentY})`, offset: 1 }),
        ]))
      ]),

      transition('* => down', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateY(${percentY})`, offset: 1 }),
        ]))
      ]),

      transition('* => upLeft', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateX(-${percentX}) translateY(-${percentXY})`, offset: 1 }),
        ]))
      ]),

      transition('* => upRight', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateX(${percentX}) translateY(-${percentXY})`, offset: 1 }),
        ]))
      ]),

      transition('* => downLeft', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateX(-${percentX}) translateY(${percentXY})`, offset: 1 }),
        ]))
      ]),

      transition('* => downRight', [
        animate(selay, keyframes([
          style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
          style({ transform: `translateX(${percentX}) translateY(${percentXY})`, offset: 1 }),
        ]))
      ]),


      /* state('up', style({ transform: 'translateY(-100%)' })),
      state('down', style({ transform: 'translateY(100%)' })),
      state('upLeft', style({ transform: 'translateY(-40%) translateX(-100%)' })),
      state('upRight', style({ transform: 'translateY(-40%) translateX(100%)' })),
      state('downLeft', style({ transform: 'translateY(40%) translateX(-100%)' })),
      state('downRight', style({ transform: 'translateY(40%) translateX(100%)' })), */
  
      /* transition('* => up', animate('1300ms ease-out')),
      transition('* => down', animate('1300ms ease-out')),
      transition('* => upLeft', animate('1300ms ease-out')),
      transition('* => upRight', animate('1300ms ease-out')),
      transition('* => downLeft', animate('1300ms ease-out')),
      transition('* => downRight', animate('1300ms ease-out')), */
  
      transition('* => collect', [
        animate('200ms ease', keyframes([
          style({ transform: 'scale(1) translateY(0%)', opacity: 1, offset: 0 }),
          style({ transform: 'scale(1.5) translateY(-20%)', opacity: 1, offset: 0.8 }),
          style({ transform: 'scale(0) translateY(0%)', opacity: 1, offset: 1.0 }),
        ]))
      ])]
    
    )]
})
export class TileTopComponent implements OnInit {
  @Input() tile: Tile;

  constructor() { }

  ngOnInit() {
  }

  onMoveDone(event) {
    this.tile.movment = null;

  }

}
