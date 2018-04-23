import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { IState } from 'app/redux/interfaces';
import { Tile } from '../board/tile/tile';

@Component({
  selector: 'guide-screen',
  templateUrl: './guide-screen.component.html',
  styleUrls: ['./guide-screen.component.css'],
})
export class GuideScreenComponent implements OnInit {
  animState
  show: boolean;
  brick = "brick";
  onPage: number = 1;

  //tiles1: Tile[] = [];

  constructor(private gameEngine: GameEngineService) {
    /* this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      if (newState) { 

        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            let newTile: Tile = new Tile();
            newTile.xpos = j;
            newTile.ypos = i;
            this.tiles1.push(newTile);
          }
        }

        this.show = newState.tutorialActive;
      }

    }) */

  }

  ngOnInit() {
  }

  onAnimDone() {

  }

  onClose() {
    this.gameEngine.closeTutorial();
  }

  onNext() {
    this.onPage++;
  }

  onPrev() {
    this.onPage--;
  }

  butnClicked(){
    this.gameEngine.closeTutorial();
  }
}
