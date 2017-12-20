import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Tile } from './tile';
import { GameEngineService } from 'app/services/game-engine.service';
import { TileMatch } from 'app/game/board/tile/tile-match';
import { ICardData, Card, MATCH } from '../../cards/card';
import { Resources } from '../../../enums/resources.enum';
import { IBuyItem } from './tile-buy-popup/buy-item/buy-item';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from './building';


@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  animations: [
    trigger('floatOver', [
      state('inactive', style({
        //backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active', style({
        //backgroundColor: '#cfd8dc',
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
  //over: boolean;
  // matchTile: boolean;
  showStore: boolean;
  timeout: any;

  constructor(private gameEngine: GameEngineService) {

    this.gameEngine.currentCard$.subscribe(currentCard => {
      this.currentCard = currentCard;
    });
  }

  ngOnInit(): void {
    // this.matchTile = (this.tile instanceof TileMatch) ? true : false;
    //this.matchTile = this.tile.terrain.type == "resource"?true:false;

  }

  onCardCollected() {
    this.tile.overMe = false;
    this.tile.clear();
  }

  clickTile() {
    this.tile.overMe = false;

    if (this.tile.terrain.type == "plain") {
      let temp = this.tile.card;
      this.tile.card = this.currentCard;

      if (temp) {
        this.gameEngine.updateCurrentCard = temp;
      } else {
        this.gameEngine.setNextValue();
      }
    } else

      if (this.tile.terrain.type == "resource") {

        this.tile.card = this.currentCard;

        if (this.tile.card.type == MATCH) {
          this.gameEngine.findMatch(this.tile);
        }

        // setTimeout(() => {
        this.gameEngine.nextTurn();
        //}, 100);
      }
      else if (this.tile.terrain.type == "city") {
        this.showStore = !this.showStore;

        this.openStore.emit(this);
      }
  }

  buyItem(buyItem: IBuyItem) {

    this.showStore = false;
    let canBuy: boolean = this.gameEngine.useResources(buyItem.cost)

    if (canBuy == true) {
      this.tile.building = new Building(buyItem.type)
      /* if (buyItem.type == Resources.WALL) {
        this.tile.terrain = new Terrain('wall')
      } else 
      {
        this.tile.card = this.gameEngine.getNewCityCard(buyItem.type);
        this.gameEngine.findMatch(this.tile)
      } */
      if (buyItem.type == "house") {
        this.gameEngine.updatePopulation = 5;
      }
    } else {
      console.warn("not enough resources!")
    }
  }

  outMe() {
    this.state = 'inactive';
    this.tile.overMe = false;
    clearTimeout(this.timeout);

  }

  overMe() {
    if (this.tile.terrain.type == "resource" || this.tile.terrain.type == "plain") {
      this.tile.overMe = true;

      this.timeout = setTimeout(() => {
        this.state = 'active';
        this.goDown();
      }, 50);

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


}
