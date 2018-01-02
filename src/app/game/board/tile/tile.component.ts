
import { UrlConst } from './../../../consts/url-const';
import { CardTypeEnum } from './../../../enums/card-type-enum.enum';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Tile } from './tile';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { ICardData, Card } from '../../cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from './building';
import { TerrainEnum } from '../../../enums/terrain.enum';
import { BuildingEnum } from '../../../enums/building-enum.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { CardFamilyTypeEnum } from '../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../services/messages.service';
import { IBuyItem } from 'app/game/tile-buy-popup/buy-item/buy-item';

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
  ]
})

export class TileComponent implements OnInit {

  @Input() tile: Tile;
  @Input() onBoard: boolean = true;
  @Output() openStore: EventEmitter<any> = new EventEmitter();
  @Output() chosen: EventEmitter<boolean> = new EventEmitter();
  state: string = "inactive";

  currentCard: Card;
  showStore: boolean;
  timeout: any;
  resourceStorage: IResourceStorage;
  showThinkBubble: boolean;

  collectState: string = "inactive";
  isSelectd: boolean;

  storeItems: IBuyItem[] = [

    { label: 'build', cost: { block: 12, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { label: 'build', cost: { block: 9, lumber: 3, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { label: 'build', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { label: 'build', cost: { block: 27, lumber: 9, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
  ]

  storeItems2: IBuyItem[] = [
    { cost: { block: 0, lumber: 0, coin: 6 }, icon: UrlConst.MOVE, type: 10, label: 'move', description: "move building" },
    { cost: { block: 0, lumber: 0, coin: 6 }, icon: UrlConst.BULDOZE, type: 10, label: 'remove', description: "destroy building" },
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
  }

  onCardCollected() {
    this.tile.overMe = false;
    this.tile.clear();
  }

  clickTile() {
    this.tile.overMe = false;
    if (this.tile.terrain.type == TerrainEnum.CITY) {
      this.showStore = !this.showStore;
      //this.openStore.emit(this);
    } else
      if (this.tile.terrain.type == TerrainEnum.CARD_HOLDER) {
        let temp = this.tile.card;
        this.tile.card = this.currentCard;

        if (temp) {
          this.gameEngine.updateCurrentCard = temp;
        } else {
          this.gameEngine.setNextValue();
        }
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
              this.messagesService.postMessage({ title: "No more storage place", message: "build more storage" });
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
    if (!buyItem) return;

    let testResources: IResourceStorage =
      {
        bricks: this.resourceStorage.bricks - buyItem.cost.block,
        lumber: this.resourceStorage.lumber - buyItem.cost.lumber,
        coins: this.resourceStorage.coins - buyItem.cost.coin
      }

    if (testResources.bricks >= 0 && testResources.lumber >= 0 && testResources.coins >= 0) {

      if (buyItem.type == CardFamilyTypeEnum.ROAD) {
        // this.tile.terrain = new Terrain(TerrainEnum.ROAD)
        this.tile.setTempTerrain(TerrainEnum.ROAD);
      }
      else {
        this.tile.card = this.gameEngine.getNewCard(buyItem.type);
        this.gameEngine.findMatch(this.tile);
      }

      this.gameEngine.updateResourceStorage = testResources;
      this.gameEngine.removeFromResourcesStorage(buyItem.cost.block + buyItem.cost.lumber);
      this.gameEngine.nextTurn();
    } else {
      console.warn("not enough resources!");
      this.messagesService.postMessage({ title: "not enough resources!" })
    }
  }

  outMe() {
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
    }

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
    return this.tile.col * 100;
  }

}
