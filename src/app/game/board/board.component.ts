
import { Component, OnInit, ViewChild, ElementRef, trigger, transition, animate, keyframes, style } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { TileComponent } from './tile/tile.component';
import { Tile } from 'app/game/board/tile/tile';
import { IState } from '../../redux/interfaces';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [
    trigger('animationState', [
      transition('* => shake', [
        animate('300ms ease-out', keyframes([
          style({ transform: 'translateX(0%)', offset: 0 }),
          style({ transform: 'translateX(-3%)', offset: 0.15 }),
          style({ transform: 'translateX(3%)', offset: 0.30 }),
          style({ transform: 'translateX(-2%)', offset: 0.45 }),
          style({ transform: 'translateX(2%)', offset: 0.60 }),
          style({ transform: 'translateX(-1%)', offset: 0.75 }),
          style({ transform: 'translateX(0%)', offset: 1.0 }),
        ]))
      ]),
    ])
  ]
})
export class BoardComponent implements OnInit {

  tiles: Tile[] = [];
  state: string = "";

  constructor(public gameEngine: GameEngineService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      this.state = newState.boardState;

      this.tiles = newState.tiles;
    })
  }

  ngOnInit() {

  }

  getCols() {
    let str: string = ''
    for (var i = 0; i < this.gameEngine.totalRows; i++) {
      str += '63px '
    }
    return str;
  }

  onAnimationDone() {
    
  }

}
