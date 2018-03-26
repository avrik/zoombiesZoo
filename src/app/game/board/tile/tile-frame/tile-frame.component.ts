import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'app/game/cards/card';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'tile-frame',
  templateUrl: './tile-frame.component.html',
  styleUrls: ['./tile-frame.component.css'],
  animations: [
    trigger('glow', [
      transition('* => in', [
        animate(3000, keyframes([
          style({ opacity: 1, offset: 0 }),
          style({ opacity: 0.2, offset: 0.4 }),
          style({ opacity: 1, offset: 1 }),
        ]))
      ]),
    ])
  ]
})
export class TileFrameComponent implements OnInit {
  @Input() card: Card;
  animState;
  constructor() { }

  ngOnInit() {
    this.animState = "in"
  }

  animEnd(event) {
    //debugger
    //this.animState = event.fromState == "in" ? "out" : "in";
    this.animState = "out"
    setTimeout(() => {
      this.animState = "in"
    }, 1000);
    
  }

}
