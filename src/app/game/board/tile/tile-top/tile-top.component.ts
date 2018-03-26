import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'app/game/board/tile/tile';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'tile-top',
  templateUrl: './tile-top.component.html',
  styleUrls: ['./tile-top.component.css'],
  animations: [
    trigger('animState', [
      transition('* => init', [
        animate('500ms ease', keyframes([
          style({ transform: 'scale(0) translateY(0%)', offset: 0 }),
          style({ transform: 'scale(1.2) translateY(-10%)', offset: 0.6 }),
          style({ transform: 'scale(1) translateY(0%)', offset: 1.0 }),
        ]))
      ]),
      
      transition('* => up', [
        animate('500ms ease', keyframes([
          style({ transform: 'translateY(0%)', offset: 0 }),
          style({ transform: 'translateY(-50%)', offset: 0.8 }),
          style({ opacity: 0, offset: 1.0 }),
        ]))
      ]),


      //state('up', style({ transform: 'translateY(-50%)' })),
      state('down', style({ transform: 'translateY(50%)' })),
      state('upLeft', style({ transform: 'translateY(-30%) translateX(-90%)' })),
      state('upRight', style({ transform: 'translateY(-30%) translateX(90%)' })),
      state('downLeft', style({ transform: 'translateY(30%) translateX(-90%)' })),
      state('downRight', style({ transform: 'translateY(30%) translateX(90%)' })),
  
      transition('* => up', animate('300ms ease-out')),
      transition('* => down', animate('300ms ease-out')),
      transition('* => upLeft', animate('300ms ease-out')),
      transition('* => upRight', animate('300ms ease-out')),
      transition('* => downLeft', animate('300ms ease-out')),
      transition('* => downRight', animate('300ms ease-out')),
  
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
