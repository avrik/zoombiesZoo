import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'app/game/cards/card';

@Component({
  selector: 'tile-frame',
  templateUrl: './tile-frame.component.html',
  styleUrls: ['./tile-frame.component.css']
})
export class TileFrameComponent implements OnInit {
  @Input() card:Card;
  
  constructor() { }

  ngOnInit() {
  }

}
