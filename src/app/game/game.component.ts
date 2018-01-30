import { NEW_GAME_ACTION } from './../redux/actions/actions';
import { environment } from './../../environments/environment';
import { TerrainEnum } from './../enums/terrain.enum';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../services/game-engine.service';
import { MessagesService } from '../services/messages.service';
import { GameLevel } from 'app/game/levels/game-level';
import { MessageType } from '../enums/message-type.enum';
import { Tile } from './board/tile/tile';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { IState } from '../redux/main-reducer';
import { INIT_GAME_ACTION } from '../redux/actions/actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  currentLevel: GameLevel;
  debug: boolean;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();
      let cache = [];
      localStorage.setItem('gameState', JSON.stringify(newState, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      }));
      cache = null;

      /* if (this.currentLevel && newState.population >= newState.level.goal) {
        this.gameEngine.store.dispatch({ type: NEXT_LEVEL_ACTION });
      }
 */


      /* if (newState.currentMessage) {
        this.messagesService.postMessage(newState.currentMessage);
        newState.currentMessage = null;
      } */

      /* if (this.currentLevel != newState.level) {

        this.currentLevel = newState.level;
        if (this.currentLevel.index) {
          this.messagesService.postMessage({
            type: MessageType.CURTAIN, title: "Well done! ", message: `level ${this.currentLevel.index} completed!\n${this.currentLevel.reward.coins} coin rewarded`
            , butns: [{ label: 'next level' }]
          });
        }
      } */
    })
  }

  ngOnInit() {
    this.debug = !environment.production;
    this.gameEngine.store.dispatch({ type: INIT_GAME_ACTION });

    setTimeout(() => {
      this.gameEngine.store.dispatch({ type: NEW_GAME_ACTION });
    }, 50);
  }

  gameOver() {
    this.messagesService.postMessage({ type: MessageType.POPUP, title: "GAME OVER", butns: [{ label: "start over", action: a => { this.restart() } }] })
  }

  restart() {
    //this.gameEngine.restart();
  }
}
