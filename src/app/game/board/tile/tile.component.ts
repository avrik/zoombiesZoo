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
//import * as createjs from 'createjs-module';
//import { Tween, Stage } from 'createjs-module';

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
      transition('* => upAndClear', animate('100ms ease-out')),
      transition('* => downAndClear', animate('100ms ease-out')),
      transition('* => leftAndClear', animate('100ms ease-out')),
      transition('* => rightAndClear', animate('100ms ease-out')),

      state('upLeftAndClear', style({ transform: 'translateY(-50px) translateX(-50px)' })),
      state('upRightAndClear', style({ transform: 'translateY(-50px) translateX(50px)' })),
      state('downLeftAndClear', style({ transform: 'translateY(50px) translateX(-50px)' })),
      state('downRightAndClear', style({ transform: 'translateY(50px) translateX(50px)' })),
      transition('* => upLeftAndClear', animate('100ms ease-out')),
      transition('* => upRightAndClear', animate('100ms ease-out')),
      transition('* => downLeftAndClear', animate('100ms ease-out')),
      transition('* => downRightAndClear', animate('100ms ease-out')),
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
  floatState: string = "";
  moveState: string = "idle";
  scaleState: string = "";
  colloectAnimationState: string = "";

  currentCard: Card;
  showStore: boolean;
  timeout: any;
  resourceStorage: IResourceStorage;
  showThinkBubble: boolean;
  isSelectd: boolean;
  collectedIcon: string;
  storeItems: IBuyItem[] = [
    { label: 'house', cost: { block: 12, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { label: 'storage', cost: { block: 9, lumber: 3, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { label: 'church', cost: { block: 21, lumber: 12, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
  ]

  storeItems2: IBuyItem[] = [
    { cost: { block: 0, lumber: 0, coin: 2 }, icon: UrlConst.MOVE, type: 10, label: 'move', description: "move me" },
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
  ]

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {
    this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });
  }



  ngOnInit(): void {
    this.tile.selected$.subscribe(selected => {
      this.isSelectd = selected;
      if (selected) {
        this.overMe()
      } else this.outMe();
    });

    this.tile.move$.subscribe(move => {
      if (move) {
        if (move == "up") this.cardRef.nativeElement.style.marginTop = "50px"
        if (move == "down") this.cardRef.nativeElement.style.marginTop = "-50px"
        if (move == "left") this.cardRef.nativeElement.style.marginLeft = "50px"
        if (move == "right") this.cardRef.nativeElement.style.marginLeft = "-50px"
        this.moveState = move;
        //this.tile.state = TileState.MOVING;

        setTimeout(() => {
          this.cardRef.nativeElement.style.marginTop = 0;
          this.cardRef.nativeElement.style.marginLeft = 0;
          this.moveState = "idle";
        }, 200);
      }
    })
  }

  onCardCollected() {
    this.tile.overMe = false;
    this.tile.clear();
  }

  doCollectAnimation() {
    //this.collectedIcon = "lumber";
    //let tween:Tween = createjs.Tween.get(this.resourceRef, { loop: true });
    //tween.to({ x: 400 }, 2000)
  }

  clickTile() {
    this.tile.overMe = false;
    if (this.tile.terrain.type == TerrainEnum.CITY) {

      if (this.tile.state == TileState.WAIT_FOR_MOVE) {
        this.tile.card = this.gameEngine.pendingTileBuilding.card;
        this.gameEngine.moveBuildingDone();
        this.gameEngine.findMatch(this.tile);
        this.gameEngine.updateBoard();
      } else {
        this.showStore = !this.showStore;
        this.openStore.emit(this);
      }
    } else
      if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        let temp = this.tile.card;
        this.tile.card = this.currentCard;

        if (temp) {
          this.gameEngine.updateCurrentCard = temp;
        } else {
          this.gameEngine.setNextValue();
        }
        this.gameEngine.updateBoard();
        this.overMe();
      } else

        if (this.tile.card) {
          this.doCollectAnimation();

          if (this.tile.card.collect && this.tile.card.type == CardTypeEnum.RESOURCE) {
            if (this.gameEngine.collectResources(this.tile.card.family.name, this.tile.card.collected)) {
              this.tile.clear();
            } else {

              this.messagesService.postMessage({ type: MessageType.TOOLBAR, title: "No more storage place", message: "build more storage" });
            }

            this.overMe();
          }
        } else

          if (this.tile.terrain.type == TerrainEnum.RESOURCES) {
            //this.scaleState="down";
            this.gameEngine.placeCardOnBoard(this.tile, this.currentCard);
            this.chosen.emit();
          }
  }

  buyItem(buyItem: IBuyItem) {
    this.showStore = false;
    if (!buyItem) {
      this.openStore.emit(null);
      return;
    }


    if (buyItem.type == 10) {
      this.gameEngine.moveTileBuilding(this.tile);
    } else {
      if (buyItem.type == CardFamilyTypeEnum.ROAD) {
        this.tile.terrainTop = new Terrain(TerrainEnum.ROAD)
      }
      // else {
      //this.tile.card = this.gameEngine.getNewCard(buyItem.type);
      //this.gameEngine.findMatch(this.tile);

      this.gameEngine.placeCardOnBoard(this.tile, this.gameEngine.getNewCard(buyItem.type))
      // }

      //this.gameEngine.nextTurn();
    }
  }

  outMe() {
    if (this.tile.terrainTop && this.tile.terrainTop.type == TerrainEnum.CARD_HOLDER_OPEN && !this.tile.card) {
      this.tile.terrainTop = null;
    }

    if (!this.isSelectd) {
      this.floatState = 'inactive';
      this.tile.overMe = false;
      //clearTimeout(this.timeout);
      if (this.tile.card) {
        this.hideCardMatch();
      }
    }
  }

  onMouseOver() {
    //this.chosen.emit(this.tile);
    if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
      this.tile.terrainTop = new Terrain(TerrainEnum.CARD_HOLDER_OPEN)
    }
    if (!this.isSelectd) {
      this.overMe();
    }
  }

  overMe() {
    if (this.tile.card) {
      this.showCardMatch();
    } else {
      if (this.tile.terrain.type == TerrainEnum.RESOURCES || this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        this.tile.overMe = true;
        this.floatState = 'up';

      } else if (this.tile.terrain.type == TerrainEnum.CITY) {
        this.gameEngine.showCardMatchHint(this.gameEngine.getNewCard(CardFamilyTypeEnum.WILD));
      }
    }
  }

  hideCardMatch() {
    this.gameEngine.showCardMatchHint(null);
    this.showThinkBubble = false;
  }
  showCardMatch() {
    //console.log('show card match')
    if (this.tile.card.nextCard) {
      this.gameEngine.showCardMatchHint(this.tile.card);
    } else if (this.tile.card.family.name == CardFamilyTypeEnum.PERSON) {
      this.showThinkBubble = true;
      this.gameEngine.showCardMatchHint(this.gameEngine.getNewCard(CardFamilyTypeEnum.WILD));
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

  onMoveDone(event) {
    //this.tile.state = TileState.REGULAR;
    if (this.tile.card) {
      this.tile.card.state = CardState.DONE;

      if (event.toState.indexOf('AndClear') != -1) {
        this.tile.clear();
      }

      this.gameEngine.updateBoard();
    }

  }

}
