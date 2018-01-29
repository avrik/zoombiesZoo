
import { IState } from './../redux/main-reducer';
import { Store, createStore } from 'redux';
import { mainReducerFunc } from 'app/redux/main-reducer';
import { IGameLevelData, GameLevel } from '../game/levels/game-level';
import { MessagesService } from 'app/services/messages.service';
import { MessageType } from '../enums/message-type.enum';
import { Card } from '../game/cards/card';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { TerrainEnum } from '../enums/terrain.enum';

export interface IResourceStorage {
  bricks?: number,
  lumber?: number,
  coins?: number,
  maxStorage?: number,
}

export class GameEngineService {
  currentLevel: GameLevel;
  currentState: IState;
  store: Store<any>;

  totalRows: number = 11;
  totalCols: number = 5;

  constructor() {
    this.store = createStore(mainReducerFunc);

    this.store.subscribe(() => {
      this.currentState = this.store.getState();
      /* let cache = [];
      localStorage.setItem('gameState', JSON.stringify(this.currentState, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      }));
      cache = null; */

      /* if (this.currentLevel && newState.population >= newState.level.goal) {
        this.gameEngine.store.dispatch({ type: NEXT_LEVEL_ACTION });
      }*/

      




      if (this.currentLevel != this.currentState.level) {

        console.log("NEW LEVEL!!!!!!")
        this.currentLevel = this.currentState.level;
        if (this.currentLevel) {
          /* this.messagesService.postMessage({
            type: MessageType.CURTAIN, title: "Well done! ", message: `level ${this.currentLevel.index} completed!\n${this.currentLevel.reward.coins} coin rewarded`
            , butns: [{ label: 'next level' }]
          }); */
        }
      }
    })
  }


  checkIfLevelCompleted(): boolean {
    if (!this.currentLevel) return false;
    if (this.currentState.population && this.currentState.population >= this.currentLevel.goal.population) {
      return true;
    }

    if (this.currentLevel.goal.building) {
      let foundGoal: any = this.currentState.tiles.find(a => a.card && a.card.type == this.currentLevel.goal.building.type)
      return foundGoal ? true : false;
    }

    if (this.currentLevel.goal.roads) {
      let foundGoal: any = this.currentState.tiles.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD);
      return foundGoal ? true : false;
    }

    if (this.currentLevel.goal.resources) {
      let foundGoal: any = (
        (!this.currentLevel.goal.resources.bricks || this.currentState.resources.bricks >= this.currentLevel.goal.resources.bricks) &&
        (!this.currentLevel.goal.resources.lumber || this.currentState.resources.lumber >= this.currentLevel.goal.resources.lumber) &&
        (!this.currentLevel.goal.resources.coins || this.currentState.resources.coins >= this.currentLevel.goal.resources.coins)
      );
      return foundGoal ? true : false;
    }
    return false;
  }

}
