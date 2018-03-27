import { CardState } from './../../../enums/card-state.enum';
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
      //transition('up => down', animate('300ms ease-out')),
      //transition('down => up', animate('300ms ease-out'))
    ]),

    trigger('moveAnimation', [
      state('up', style({ transform: 'translateY(-100%)' })),
      state('down', style({ transform: 'translateY(100%)' })),
      //state('left', style({ transform: 'translateX(-100%) translateY(-50%)' })),
      //state('right', style({ transform: 'translateX(100%) translateY(-50%)' })),
      state('upLeft', style({ transform: 'translateY(-50%) translateX(-100%)' })),
      state('upRight', style({ transform: 'translateY(-50%) translateX(100%)' })),
      state('downLeft', style({ transform: 'translateY(50%) translateX(-100%)' })),
      state('downRight', style({ transform: 'translateY(50%) translateX(100%)' })),

      transition('* => up', animate('300ms ease-out')),
      transition('* => down', animate('300ms ease-out')),
      //transition('* => left', animate('100ms ease-out')),
      //transition('* => right', animate('100ms ease-out')),
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
      ]),
    ]),

    trigger('visibilityChanged', [
      transition('* => merge', [
        animate('300ms ease', keyframes([
          style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.4)', opacity: 1, offset: 0.6 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1.0 })
        ]))
      ]),
      transition('* => show', [
        animate('100ms', keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 1, offset: 1.0 }),
        ]))
      ]),
    ]),
    trigger('scaleAnimation', [
      state('up', style({ transform: 'scale(1)' })),
      state('down', style({ transform: 'scale(.5)' })),
      transition('* => up', animate('50ms ease-out')),
      transition('* => down', animate('50ms ease-out'))
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
  showThinkBubble: boolean;
  isCardFloating: boolean;
  onMe: boolean;


  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

  }

  ngOnInit(): void {
    this.terrainAnimation = "down";

    this.gameEngine.store.subscribe(() => {
      this.currentState = this.gameEngine.store.getState();
      this.currentCard = this.currentState.nextCard;
      this.isCardFloating = (this.currentState.floatTile && this.currentState.floatTile.id == this.tile.id) ? true : false;

      this.floatState = this.isCardFloating ? 'up' : ""
      //this.moveState = this.tile.movment ? this.tile.movment.dir : "";
    }
    )
    if (this.tile.xpos == 1 && this.tile.ypos == 1) {
      //if (this.tile.card) {
      setTimeout(() => {
        //this.moveState="up";

        this.tile.movment = { img: UrlConst.BRICK1, dir: "up" }
      }, 1000);

      setTimeout(() => {
        this.moveState = "upRight";
        this.tile.movment = { img: UrlConst.BRICK1, dir: "upRight" }
      }, 2000);

      setTimeout(() => {
        this.moveState = "downRight";
        this.tile.movment = { img: UrlConst.BRICK1, dir: "downRight" }
      }, 3000);


      setTimeout(() => {
        this.moveState = "down";
        this.tile.movment = { img: UrlConst.BRICK1, dir: "down" }
      }, 4000);

      setTimeout(() => {
        this.moveState = "downLeft";
        this.tile.movment = { img: UrlConst.BRICK1, dir: "downLeft" }
      }, 5000);

      setTimeout(() => {
        this.moveState = "upLeft";
        this.tile.movment = { img: UrlConst.BRICK1, dir: "upLeft" }
      }, 6000);
    }

  }



  clickTile() {
    if (!this.tile.terrain) return;

    if (this.tile.terrain.locked) {
      this.gameEngine.handleBlockedTile(this.tile);
      return;
    }

    switch (this.tile.terrain.type) {
      case TerrainEnum.BLOCKED:
        this.gameEngine.handleBlockedTile(this.tile);
        break;

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

    /* if (this.tile.terrain.type == TerrainEnum.BLOCKED) {
      this.gameEngine.handleBlockedTile(this.tile);
    }

    if (this.tile.terrain.type == TerrainEnum.CITY) {
      if (this.tile.state == TileState.WAIT_FOR_MOVE) {
        this.gameEngine.placeMovingBuilding(this.tile);
      } else {
        this.gameEngine.openStore(this.tile);
      }
    } else {
      if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        this.gameEngine.clickStashTile(this.tile);
      } else
        if (this.tile.card) {
          if (this.tile.card.collect && this.tile.card.type == CardTypeEnum.RESOURCE) {
            this.gameEngine.collectResources(this.tile);
          }
        } else
          if (this.tile.terrain.type == TerrainEnum.RESOURCES) {
            this.gameEngine.clickTile(this.tile);
          }
    } */
  }

  onMouseOut() {
    if (this.onMe && !this.tile.terrain.locked) {
      // this.tile.linked.forEach(a => a.opacity = 1)
      this.onMe = false;

      if (this.tile.terrainTop && this.tile.terrainTop.type == TerrainEnum.CARD_HOLDER_OPEN && !this.tile.card) {
        this.tile.terrainTop = null;
      }

      if (!this.isCardFloating) {
        this.floatState = '';

        if (this.tile.card) {
          this.showThinkBubble = false;
        }
      }

      if (this.terrainAnimation != "down") {
        this.terrainAnimation = "down";
      }
    }
  }

  onMouseOver() {
    if (!this.onMe && !this.tile.terrain.locked) {
      this.onMe = true;

      if (this.tile.terrain && this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        this.tile.terrainTop = new Terrain(TerrainEnum.CARD_HOLDER_OPEN)
      }

      if (!this.tile.card && this.tile.terrain.clickable) {
        if (this.terrainAnimation != "up") {
          this.terrainAnimation = "up";
        }

        /* if (!this.tile.terrain.locked) {
          this.tile.linked.filter(a => !a.card && a.terrain.clickable).forEach(a => a.opacity = 0.6);
        } */
      }

      if (this.gameEngine.rollOverTile != this.tile) {
        this.gameEngine.rollOverTile = this.tile;



      }

      /* if (this.isCardFloating) {
        this.floatState = 'up';
      } */
      else
        if (this.tile.card) {
          if (this.tile.card.family.name == CardFamilyTypeEnum.PERSON) {
            this.showThinkBubble = true;
          }
          /* } else {
            if (this.tile.terrain.type == TerrainEnum.RESOURCES || this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
              this.floatState = 'up';
            }
          } */
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
    }

    if (this.tile.card) {

      switch (this.tile.card.type) {
        case CardTypeEnum.RESOURCE:
          return `${(this.tile.card.level + 2) * 2}px 0 0 0`;
      }
    }



    return "0"
  }


  get isShowOver():boolean {
    return this.onMe && !this.tile.card && (this.tile.terrain.type==TerrainEnum.RESOURCES || this.tile.terrain.type==TerrainEnum.CARD_HOLDER)
  }
}
