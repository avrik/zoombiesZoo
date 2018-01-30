import { IState } from './../../../redux/main-reducer';
import { PLACE_CARD_ON_TILE_ACTION, COLLECT_RESOURCES_ACTION, MOVE_BUILDING_ACTION, PLACE_MOVE_BUILDING_ACTION } from './../../../redux/actions/actions';
import { CardState } from './../../../enums/card-state.enum';
import { TileCardComponent } from './tile-card/tile-card.component';
import { UrlConst } from './../../../consts/url-const';
import { CardTypeEnum } from './../../../enums/card-type-enum.enum';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Tile } from './tile';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { ICardData, Card } from '../../cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from './building';
import { TerrainEnum } from '../../../enums/terrain.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { CardFamilyTypeEnum } from '../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../services/messages.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';
import { MessageType } from '../../../enums/message-type.enum';
import { TileState } from '../../../enums/tile-state.enum';
import { CLICK_TILE, PLACE_CARD_ON_STASH_ACTION, PLACE_BUILDING } from '../../../redux/actions/actions';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [
    trigger('floatOver', [
      state('down', style({
        transform: 'scale(1)'
      })),
      state('up', style({
        transform: 'scale(1.2)'
      })),
      transition('* => up', animate('300ms ease-out')),
      transition('* => down', animate('300ms ease-out')),
      transition('up => down', animate('300ms ease-out')),
      transition('down => up', animate('300ms ease-out'))
    ]),

    trigger('moveAnimation', [
      state('up', style({ transform: 'translateY(-50px)' })),
      state('down', style({ transform: 'translateY(50px)' })),
      state('left', style({ transform: 'translateX(-50px)' })),
      state('right', style({ transform: 'translateX(50px)' })),
      transition('* => up', animate('200ms ease-out')),
      transition('* => down', animate('200ms ease-out')),
      transition('* => left', animate('200ms ease-out')),
      transition('* => right', animate('200ms ease-out')),

      state('upAndClear', style({ transform: 'translateY(-50px)' })),
      state('downAndClear', style({ transform: 'translateY(50px)' })),
      state('leftAndClear', style({ transform: 'translateX(-50px)' })),
      state('rightAndClear', style({ transform: 'translateX(50px)' })),
      transition('* => upAndClear', animate('150ms ease-out')),
      transition('* => downAndClear', animate('150ms ease-out')),
      transition('* => leftAndClear', animate('150ms ease-out')),
      transition('* => rightAndClear', animate('150ms ease-out')),

      state('upLeftAndClear', style({ transform: 'translateY(-50px) translateX(-50px)' })),
      state('upRightAndClear', style({ transform: 'translateY(-50px) translateX(50px)' })),
      state('downLeftAndClear', style({ transform: 'translateY(50px) translateX(-50px)' })),
      state('downRightAndClear', style({ transform: 'translateY(50px) translateX(50px)' })),
      transition('* => upLeftAndClear', animate('150ms ease-out')),
      transition('* => upRightAndClear', animate('150ms ease-out')),
      transition('* => downLeftAndClear', animate('150ms ease-out')),
      transition('* => downRightAndClear', animate('150ms ease-out')),
    ]),
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => hidden', animate('5ms ease-out')),
      transition('hidden => shown', animate('150ms ease-out'))
    ]),
    trigger('scaleAnimation', [
      state('up', style({ transform: 'scale(1)' })),
      state('down', style({ transform: 'scale(.5)' })),
      transition('* => up', animate('50ms ease-out')),
      transition('* => down', animate('50ms ease-out'))
    ]),
    trigger('collectAnimation', [
      state('collect', style({ transform: `translateY(-300%) translateX(-150%)`, opacity: '0.5' })),
      transition('* => collect', animate('250ms ease-in')),

    ])
  ]
})

export class TileComponent implements OnInit {
  @ViewChild('cardRef') cardRef: ElementRef;
  @ViewChild('resourceRef') resourceRef: ElementRef;
  @Input() tile: Tile;
  @Input() onBoard: boolean = true;
  @Output() openStore: EventEmitter<any> = new EventEmitter();
  @Output() chosen: EventEmitter<Tile> = new EventEmitter();
  currentState: IState;
  floatState: string = "";
  moveState: string = "idle";
  scaleState: string = "";
  colloectAnimationState: string = "";

  currentCard: Card;
  showStore: boolean;
  timeout: any;
  resourceStorage: IResourceStorage;
  showThinkBubble: boolean;
  collectedIcon: string;
  storeItems: IBuyItem[] = [
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { label: 'laboratory', cost: { block: 18, lumber: 6, coin: 3 }, icon: UrlConst.LABORATORY, type: CardFamilyTypeEnum.LABORATORY, description: "cathedrals are used to trap the undead" },
    { label: 'church', cost: { block: 21, lumber: 12, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
  ]

  storeItems2: IBuyItem[] = [
    { label: 'move', cost: { block: 0, lumber: 0, coin: 0 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
  ]

  showNextHint: boolean;
  onMe: boolean;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {
    // this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
    /* this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    }); */

    this.gameEngine.store.subscribe(() => {
      this.currentState = this.gameEngine.store.getState();
      this.currentCard = this.currentState.nextCard;
      this.showNextHint = this.currentState.floatTile == this.tile ? true : false;

      this.floatState = this.showNextHint ? 'up' : ""

      switch (this.tile.state) {
        case TileState.MOVE_UP:
          this.moveState = "upAndClear";
          break;
        case TileState.MOVE_DOWN:
          this.moveState = "downAndClear";
          break;
        case TileState.MOVE_RIGHT:
          this.moveState = "rightAndClear";
          break;
        case TileState.MOVE_LEFT:
          this.moveState = "leftAndClear";
          break;

        case TileState.MOVE_UP_LEFT:
          this.moveState = "upLeftAndClear";
          break;
        case TileState.MOVE_UP_RIGHT:
          this.moveState = "upRightAndClear";
          break;
        case TileState.MOVE_DOWN_LEFT:
          this.moveState = "downLeftAndClear";
          break;
        case TileState.MOVE_DOWN_RIGHT:
          this.moveState = "downRightAndClear";
          break;
      }
    }
    )
  }

  ngOnInit(): void {

  }

  clickTile() {

    if (this.tile.terrain.type == TerrainEnum.CITY) {

      if (this.tile.state == TileState.WAIT_FOR_MOVE) {
        /* this.tile.card = this.gameEngine.pendingTileBuilding.card;
        this.gameEngine.moveBuildingDone();
        this.gameEngine.findMatch(this.tile);
        this.gameEngine.updateBoard(); */
        this.gameEngine.store.dispatch({ type: PLACE_MOVE_BUILDING_ACTION, payload: this.tile })
      } else {
        this.showStore = !this.showStore;
        this.openStore.emit(this);
      }
    } else {
      if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        this.gameEngine.store.dispatch({ type: PLACE_CARD_ON_STASH_ACTION, payload: this.tile })
      } else
        if (this.tile.card) {
          if (this.tile.card.collect && this.tile.card.type == CardTypeEnum.RESOURCE) {
            this.gameEngine.store.dispatch({ type: COLLECT_RESOURCES_ACTION, payload: this.tile })
          }
        } else
          if (this.tile.terrain.type == TerrainEnum.RESOURCES) {
            this.gameEngine.store.dispatch({ type: CLICK_TILE, payload: this.tile })
          }
    }
  }

  buyItem(buyItem: IBuyItem) {
    this.showStore = false;
    if (!buyItem) {
      this.openStore.emit(null);
      return;
    }

    if (buyItem.type == 10) {
      //this.gameEngine.moveTileBuilding(this.tile);
      this.gameEngine.store.dispatch({ type: MOVE_BUILDING_ACTION, payload: this.tile });
    } else {
      this.gameEngine.store.dispatch({ type: PLACE_BUILDING, payload: { tile: this.tile, buyItem: buyItem } });
    }
  }

  outMe() {
    this.onMe = false;
    if (this.tile.terrainTop && this.tile.terrainTop.type == TerrainEnum.CARD_HOLDER_OPEN && !this.tile.card) {
      this.tile.terrainTop = null;
    }

    if (!this.showNextHint) {
      this.floatState = '';

      if (this.tile.card) {
        //this.hideCardMatch();
        this.showThinkBubble = false;
      }
    }
  }

  onMouseOver() {
    this.onMe = true;

    if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
      this.tile.terrainTop = new Terrain(TerrainEnum.CARD_HOLDER_OPEN)
    }

    if (this.gameEngine.rollOverTile != this.tile) {
      this.gameEngine.rollOverTile = this.tile;
    }

    if (!this.showNextHint) {
      if (this.tile.card) {
        if (this.tile.card.family.name == CardFamilyTypeEnum.PERSON) {
          this.showThinkBubble = true;
        }
      } else {
        if (this.tile.terrain.type == TerrainEnum.RESOURCES || this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
          this.floatState = 'up';

        } else if (this.tile.terrain.type == TerrainEnum.CITY) {
          //this.gameEngine.showCardMatchHint(this.gameEngine.getNewCard(CardFamilyTypeEnum.WILD));
        }
      }
    }
  }


  get gotCard(): boolean {
    return this.tile.card ? true : false;
  }

  onFloatDone(event) {
    if (event.toState == 'up') {
      this.floatState = 'down';
    } else if (event.toState == 'down') {
      this.floatState = 'up';
    } else
      this.floatState = "";
  }

  getIndex() {
    return this.tile.col * 10;
  }

  onCollectDone(event) {
    this.colloectAnimationState = "";
    this.collectedIcon = "";
  }

  onScaleDone(event) {

    if (event.toState == "down") {
      this.scaleState = "up";
    }
  }

  onDelayDone(event) {

    if (event.toState == "hidden") {
      this.tile.showDelay = "shown";
    } else {
      this.tile.showDelay = "";
    }
  }

  onMoveDone(event) {
    this.tile.state = TileState.REGULAR;
    this.tile.movment = null;
    /* if (this.tile.card) {
      this.tile.card.state = CardState.DONE;

      if (event.toState.indexOf('AndClear') != -1) {
        this.tile.clear();
      }
    } */

  }

}
