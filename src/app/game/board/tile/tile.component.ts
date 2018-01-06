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

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [
    trigger('floatOver', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.2)'
      })),
      transition('inactive => active', animate('300ms ease-out')),
      transition('active => inactive', animate('300ms ease-out'))
    ]),

    trigger('collect', [
      state('inactive', style({
        transform: 'translateY(140px)'
      })),
      state('fly', style({
        transform: 'translateY(140px)'
      })),
      transition('inactive => fly', animate('1300ms ease-out')),
      transition('fly => inactive', animate('1300ms ease-out'))
    ])
    ,

    trigger('moveAnimation', [
      state('up', style({ transform: 'translateY(-50px)' })),
      state('down', style({ transform: 'translateY(50px)' })),
      state('left', style({ transform: 'translateX(-50px)' })),
      state('right', style({ transform: 'translateX(50px)' })),
      transition('* => up', animate('200ms ease-out')),
      transition('* => down', animate('200ms ease-out')),
      transition('* => left', animate('200ms ease-out')),
      transition('* => right', animate('200ms ease-out')),

    ])
  ]
})

export class TileComponent implements OnInit {
  @ViewChild('cardRef') cardRef: ElementRef;
  @Input() tile: Tile;
  @Input() onBoard: boolean = true;
  @Output() openStore: EventEmitter<any> = new EventEmitter();
  @Output() chosen: EventEmitter<Tile> = new EventEmitter();
  state: string = "inactive";
  moveState: string = "idle";

  currentCard: Card;
  showStore: boolean;
  timeout: any;
  resourceStorage: IResourceStorage;
  showThinkBubble: boolean;

  collectState: string = "inactive";
  isSelectd: boolean;

  storeItems: IBuyItem[] = [

    { label: 'house', cost: { block: 12, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { label: 'storage', cost: { block: 9, lumber: 3, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { label: 'church', cost: { block: 21, lumber: 12, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
  ]

  storeItems2: IBuyItem[] = [
    { cost: { block: 0, lumber: 0, coin: 2 }, icon: UrlConst.MOVE, type: 10, label: 'move', description: "move me" },
    //{ cost: { block: 0, lumber: 0, coin: 6 }, icon: UrlConst.BULDOZE, type: 10, label: 'remove', description: "destroy building" },
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

  clickTile() {
    this.tile.overMe = false;
    if (this.tile.terrain.type == TerrainEnum.CITY) {

      if (this.tile.state == TileState.WAIT_FOR_MOVE) {
        this.tile.card = this.gameEngine.pendingTileBuilding.card;
        this.gameEngine.moveBuildingDone();
        this.gameEngine.findMatch(this.tile);
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

          if (this.tile.card.collect && this.tile.card.type == CardTypeEnum.RESOURCE) {
            if (this.gameEngine.collectResources(this.tile.card.family.name, this.tile.card.collected)) {
              /* if (this.tile.card.bonus) {
                this.gameEngine.addToStorage(CardFamilyTypeEnum.COIN, this.tile.card.bonus);
              } */

              this.collectState = "fly";
              //this.tile.overMe = false;
              this.tile.clear();
            } else {

              this.messagesService.postMessage({ type: MessageType.TOOLBAR, title: "No more storage place", message: "build more storage" });
            }

            this.overMe();
          }
        } else

          if (this.tile.terrain.type == TerrainEnum.RESOURCES) {

            this.tile.card = this.currentCard;

            if (this.tile.card.mergeBy == MergeTypeEnum.MATCH) {
              this.gameEngine.findMatch(this.tile);
            }

            // setTimeout(() => {
            this.gameEngine.nextTurn();
            //}, 100);

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
      else {
        this.tile.card = this.gameEngine.getNewCard(buyItem.type);
        this.gameEngine.findMatch(this.tile);
      }

      this.gameEngine.nextTurn();
    }
  }

  outMe() {
    if (this.tile.terrainTop && this.tile.terrainTop.type == TerrainEnum.CARD_HOLDER_OPEN && !this.tile.card) {
      this.tile.terrainTop = null;
    }

    if (!this.isSelectd) {
      this.state = 'inactive';
      this.tile.overMe = false;
      clearTimeout(this.timeout);
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

        this.timeout = setTimeout(() => {
          this.state = 'active';
          this.goDown();
        }, 50);

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

  get gotCard():boolean{
    return this.tile.card?true:false;
  }


  goUp() {
    this.timeout = setTimeout(() => {
      this.state = 'active';
      this.goDown();
    }, 320);
  }

  goDown() {
    this.timeout = setTimeout(() => {
      this.state = 'inactive';
      this.goUp()
    }, 320);
  }

  getIndex() {
    return this.tile.col * 10;
  }

}
