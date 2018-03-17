
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UrlConst } from '../../../consts/url-const';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { IResourceStorage, IState } from 'app/redux/interfaces';
import { MessagesService } from 'app/services/messages.service';
import { MessageType } from '../../../enums/message-type.enum';
import { Messages } from '../../../enums/messages.enum';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit {

  @ViewChild('brickRef') brickRef;
  @ViewChild('lumberRef') lumberRef;
  @ViewChild('coinRef') coinRef;
  //@ViewChild('silverRef') silverRef;

  resourceStorage: IResourceStorage;

  constructor(public gameEngine: GameEngineService, private messagesService: MessagesService) {

    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (this.resourceStorage != newState.resources) {

        if (this.resourceStorage) {
          if (this.brickRef && newState.resources.bricks > this.resourceStorage.bricks) this.brickRef.animate();
          if (this.lumberRef && newState.resources.lumber > this.resourceStorage.lumber) this.lumberRef.animate();
          if (this.coinRef && newState.resources.coins > this.resourceStorage.coins) this.coinRef.animate();
          //if (newState.resources.silver > this.resourceStorage.silver) this.silverRef.animate();
        }

        this.resourceStorage = Object.assign({}, newState.resources);
      }
    });
  }

  ngOnInit() {

  }

  openSettings() {
    //this.gameEngine.newGame();
    this.messagesService.postMessage(
      {
        type: MessageType.POPUP, title: Messages.GAME_RESET_TITLE,
        message: Messages.GAME_RESET_MESSAGE, butns: [
          { label: Messages.GAME_RESET_BUTN1, action: a => { this.gameEngine.restart() } },
          { label: Messages.GAME_RESET_BUTN2, action: a => { } }
        ]
      })

  }

  openStore() {
    //this.gameEngine.store.dispatch({ type: OPEN_STORE });
    this.gameEngine.openStore();
  }


}
