import { CardTypeEnum } from './../../../enums/card-type-enum.enum';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Tile } from './tile';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';
import { ICardData, Card } from '../../cards/card';
import { IBuyItem } from './tile-buy-popup/buy-item/buy-item';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from './building';
import { TerrainEnum } from '../../../enums/terrain.enum';
import { BuildingEnum } from '../../../enums/building-enum.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { CardFamilyTypeEnum } from '../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../services/messages.service';

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
    ])
  ]
})

export class TileComponent implements OnInit {

  @Input() tile: Tile;
  @Input() onBoard: boolean = true;
  @Output() openStore: EventEmitter<any> = new EventEmitter();
  state: string = "inactive";
  currentCard: Card;
  showStore: boolean;
  timeout: any;
  resourceStorage: IResourceStorage;
  showThinkBubble:boolean;
  
  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {
    this.gameEngine.resourceStorage$.subscribe(resourceStorage => this.resourceStorage = resourceStorage)
    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });
  }

  ngOnInit(): void {

  }

  onCardCollected() {
    this.tile.overMe = false;
    this.tile.clear();
  }

  clickTile() {
    this.tile.overMe = false;

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
          if (this.gameEngine.collectResources(this.tile.card.family.name, this.tile.card.collect)) {
            if (this.tile.card.bonus) {
              this.gameEngine.addToStorage(CardFamilyTypeEnum.COIN, this.tile.card.bonus);
            }
            //this.collected.emit();

            this.tile.overMe = false;
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
        }
        else if (this.tile.terrain.type == TerrainEnum.CITY) {
          this.showStore = !this.showStore;
          //this.openStore.emit(this);
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
        this.tile.terrain = new Terrain(TerrainEnum.ROAD)
      } else if (buyItem.type == CardFamilyTypeEnum.WALL) {
        this.tile.terrain = new Terrain(TerrainEnum.WALL)
      } else if (buyItem.type == CardFamilyTypeEnum.ZOOMBIE_TRAP) {
        this.tile.terrain = new Terrain(TerrainEnum.ZOOMBIE_TRAP)
      } else{
        this.tile.card = this.gameEngine.getNewCard(buyItem.type);
        this.gameEngine.findMatch(this.tile);
      }

      this.gameEngine.updateResourceStorage = testResources;
      this.gameEngine.removeFromResourcesStorage(buyItem.cost.block + buyItem.cost.lumber + buyItem.cost.coin);
      this.gameEngine.nextTurn();
    } else {
      console.warn("not enough resources!");
      this.messagesService.postMessage({ title: "not enough resources!" })
    }
  }

  outMe() {
    this.state = 'inactive';
    this.tile.overMe = false;
    clearTimeout(this.timeout);
    if (this.tile.card) {
      this.hideCardMatch();
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
        this.gameEngine.showCardMatchHint(this.gameEngine.getNewCardByValue(CardFamilyTypeEnum.WILD));
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
