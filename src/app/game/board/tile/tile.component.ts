
import { TileCardComponent } from './tile-card/tile-card.component';
import { UrlConst } from './../../../consts/url-const';
import { CardTypeEnum } from './../../../enums/card-type-enum.enum';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Tile } from './tile';
import { GameEngineService } from 'app/services/game-engine.service';
import { ICardData, Card } from '../../cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from './building';
import { TerrainEnum } from '../../../enums/terrain.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { CardFamilyTypeEnum } from '../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../services/messages.service';
import { MessageType } from '../../../enums/message-type.enum';
import { TileState } from '../../../enums/tile-state.enum';
import { IState } from '../../../redux/interfaces';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [
    trigger('floatOver', [
      state('down', style({
        transform: 'scale(1)', opacity: 0.3
      })),
      state('up', style({
        transform: 'scale(1.2)', opacity: 0.6
      })),
      transition('* => up', animate('300ms ease-out')),
      transition('up => down', animate('300ms ease-out')),
    ]),

    trigger('terrainAnimation', [
      state('up', style({ transform: 'translateY(-15%)' })),
      state('down', style({ transform: 'translateY(0%)' })),
      transition('* => up', animate('150ms ease-out')),
      transition('* => down', animate('150ms ease-out'))
    ]),
  ]
})

export class TileComponent implements OnInit {
  @Input() tile: Tile;
  terrainAnimation: string;
  currentState: IState;
  floatState: string = "";
  moveState: string = "";
  currentCard: Card;
  isCardFloating: boolean;
  onMe: boolean;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

  }

  get terrainImg():string {
    if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
      if (this.tile.card || this.onMe) {
        return this.tile.terrain.url2;
      }
    } 

    return this.tile.terrain.url;
  }

  ngOnInit(): void {
    this.terrainAnimation = "down";

    this.gameEngine.store.subscribe(() => {
      this.currentState = this.gameEngine.store.getState();
      this.currentCard = this.currentState.nextCard;
      //this.isCardFloating = (this.currentState.floatTile && this.currentState.floatTile.id == this.tile.id) ? true : false;

      this.floatState = this.isCardFloating ? 'up' : ""
      //this.moveState = this.tile.movment ? this.tile.movment.dir : "";
    }
    )

  }

  clickTile() {
    if (!this.tile.terrain) return;

    if (this.tile.terrain.locked) {
      this.gameEngine.handleBlockedTile(this.tile);
      return;
    }

    switch (this.tile.terrain.type) {
      /* case TerrainEnum.BLOCKED:
        this.gameEngine.handleBlockedTile(this.tile);
        break; */

      case TerrainEnum.CARD_HOLDER:
        this.gameEngine.clickStashTile(this.tile);
        break;

      case TerrainEnum.ROAD:
        this.gameEngine.openStore(this.tile);
        break;
      case TerrainEnum.CITY:
        if (this.tile.state == TileState.WAIT_FOR_MOVE) {
          this.gameEngine.placeMovingBuilding(this.tile);
        } else {
          this.gameEngine.openStore(this.tile);
        }
        break;

      case TerrainEnum.RESOURCES:
        if (this.tile.card) {
          if (this.tile.card.collect && this.tile.card.type == CardTypeEnum.RESOURCE) {
            this.gameEngine.collectResources(this.tile);
          }

        } else {
          this.gameEngine.clickTile(this.tile);
        }
        break;
    }
  }

  onMouseOut() {
    if (this.onMe && !this.tile.terrain.locked) {
      this.onMe = false;

      if (!this.isCardFloating) {
        this.floatState = '';
      }

      if (this.terrainAnimation != "down") {
        this.terrainAnimation = "down";
      }

      //if (this.tile.card) {
      this.gameEngine.clearMatchHint(this.tile);
      //}
    }
  }

  onMouseOver() {

    if (!this.onMe && !this.tile.terrain.locked) {
      this.onMe = true;

      if (!this.tile.card && this.tile.terrain.clickable) {
        this.gameEngine.showMatchHint(this.tile);

        if (this.terrainAnimation != "up") {
          this.terrainAnimation = "up";
        }
      }

      if (this.gameEngine.rollOverTile != this.tile) {
        this.gameEngine.rollOverTile = this.tile;
      }
    }
  }

  get gotCard(): boolean {
    return this.tile.card ? true : false;
  }

  get getIndex(): number {
    return this.tile.ypos;
  }

  onFloatDone(event) {
    if (!event) {
      this.floatState = "";
      return;
    }

    if (event.toState == 'up') {
      this.floatState = 'down';
    } else if (event.toState == 'down') {
      this.floatState = 'up';
    } else
      this.floatState = "";
  }

  onMoveDone(event) {
    this.tile.state = TileState.REGULAR;
    this.tile.movment = null;
  }

  getimgFilter() {
    return this.tile.terrain.locked ? "grayscale(1)" : "none";
  }

  gettilemargin() {
    if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER || this.tile.terrain.type == TerrainEnum.CARD_HOLDER_OPEN) {
      return "-40px 0 0 0"
    } else {
      if (this.tile.card) {
        return `${(this.tile.card.level + 2) * 2}px 0 0 0`;
      }
    }

    return "0"
  }

  get isShowOver(): boolean {
    return this.onMe && !this.tile.card && (this.tile.terrain.type == TerrainEnum.RESOURCES || this.tile.terrain.type == TerrainEnum.CARD_HOLDER)
  }

  get isShowCardOnTile(): boolean {

    return this.tile.card ? true : false;
  }
}
