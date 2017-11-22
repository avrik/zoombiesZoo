import { Injectable, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tile } from '../game/board/tile/tile';
import { log } from 'util';

export const WILD_CARD = "wild-card"
export const MATCH = "match"
export const TRAP = "trap"

export interface ICard {
  name: string;
  type: string;
  minForNextLevel: number;
  value: number;
  symbol: string;
  color: string;
  nextCard?: ICard;
  chance?: number;
  age?: number;
  bonus?: number;
  img?: string;
  moved?: boolean;
}

export class Card implements ICard {
  name: string;
  type: string;
  minForNextLevel: number;
  value: number;
  symbol: string;
  color: string;
  nextCard?: ICard;
  chance?: number;
  age: number;
  bonus: number;
  img: string;
  moved: boolean;

  constructor(data: ICard) {
    if (!data) return;
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.age = 0;
    this.bonus = 0;
    this.minForNextLevel = data.minForNextLevel;
    this.symbol = data.symbol;
    this.color = data.color;
    this.nextCard = data.nextCard;
    this.chance = data.chance;
    this.img = data.img;
    this.moved = false;
  }
}

const cardCollection: ICard[] = [
  {
    name: "stone", type: MATCH, minForNextLevel: 3, value: 10, symbol: "rock", color: "#9DCAB5", chance: 100, img: "assets/rock.png",
    nextCard: {
      /* name: "stones", type: MATCH, minForNextLevel: 3, value: 11, symbol: "Rs", color: "#A3D1BB",
      nextCard: { */
      name: "block", type: MATCH, minForNextLevel: 3, value: 12, symbol: "block", color: "#AFE0C9", img: "assets/brick.png",
      /* nextCard: {
        name: "wall", type: MATCH, minForNextLevel: 3, value: 13, symbol: "W", color: "#BAEFD7"
      } */
      //}
    }
  },
  {
    name: "tree", type: MATCH, minForNextLevel: 3, value: 20, symbol: "tree", color: "#FC9F5B", chance: 50, img: "assets/tree.png",
    /* nextCard: {
      name: "trees", type: MATCH, minForNextLevel: 3, value: 21, symbol: "Ts", color: "#E58F52", */
    nextCard: {
      name: "lumber", type: MATCH, minForNextLevel: 3, value: 22, symbol: "lumber", color: "#CE814A", img: "assets/wood.png",
      /* nextCard: {
        name: "house", type: MATCH, minForNextLevel: 3, value: 23, symbol: "H", color: "#B57141"
      } */
    }
    //}
  },
  {
    name: "gold", type: MATCH, minForNextLevel: 3, value: 30, symbol: "gold", color: "gold", chance: 50, img: "assets/gold.png",
    nextCard: {
      /* name: "golds", type: MATCH, minForNextLevel: 3, value: 31, symbol: "Gs", color: "gold",
      nextCard: { */
      name: "coin", type: MATCH, minForNextLevel: 3, value: 32, symbol: "coin", color: "gold", img: "assets/coin.png",
      /* nextCard: {
        name: "coins", type: MATCH, minForNextLevel: 3, value: 33, symbol: "8$", color: "gold"
      } */
    }
    //}
  },
  //{ name: "soldier", type: TRAP, minForNextLevel: 3, value: 100, symbol: "SS", color: "#1AA1B6", chance: 0 },
  {
    name: "grave", type: MATCH, minForNextLevel: 3, value: 50, symbol: "RIP", color: "gray", img: "assets/grave.png",
    /* nextCard: {
      name: "zoombie", type: TRAP, minForNextLevel: 3, value: 200, symbol: "ZZ", color: "black"
    } */
  },
  { name: "zoombie", type: TRAP, minForNextLevel: 3, value: 200, symbol: "ZZ", color: "gray", chance: 50, img: "assets/zoombie.png", },
  { name: "wild", type: WILD_CARD, minForNextLevel: 3, value: -1, symbol: "*", color: "yellow", chance: 0 }
]

export class GameEngineService {
  totalRows: number = 5;
  totalCols: number = 5;

  private collected: ICard[] = [];
  private tiles: Tile[] = [];
  private _tiles$: BehaviorSubject<Tile[]>;
  private _currentCard$: BehaviorSubject<ICard>;
  private _collected$: BehaviorSubject<ICard[]>;
  private tilesPos: any[] = [];

  gameOver: boolean;

  get tiles$(): Observable<Tile[]> { return this._tiles$.asObservable(); }
  get currentCard$(): Observable<ICard> { return this._currentCard$.asObservable(); }
  get collected$(): Observable<ICard[]> { return this._collected$.asObservable(); }

  set updateCurrentCard(card: ICard) {
    this._currentCard$.next(card);
  }

  tilesWithCards: Tile[];
  constructor() {
    this._tiles$ = <BehaviorSubject<Tile[]>>new BehaviorSubject(null);
    this._currentCard$ = <BehaviorSubject<ICard>>new BehaviorSubject(null);
    this._collected$ = <BehaviorSubject<ICard[]>>new BehaviorSubject(null);

    for (var i = 0; i < this.totalCols; i++) {
      this.tilesPos[i] = [];
      for (var j = 0; j < this.totalRows; j++) {
        let newTile = new Tile(i, j)
        this.tiles.push(newTile)
        this.tilesPos[i][j] = newTile;
      }
    }

    this.tiles.forEach(tile => {
      let tileLeft = this.getTileOnPos(tile.col - 1, tile.row);
      if (tileLeft) tile.linked.push(tileLeft);
      let tileRight = this.getTileOnPos(tile.col + 1, tile.row);
      if (tileRight) tile.linked.push(tileRight);
      let tileUp = this.getTileOnPos(tile.col, tile.row - 1);
      if (tileUp) tile.linked.push(tileUp);
      let tileDown = this.getTileOnPos(tile.col, tile.row + 1);
      if (tileDown) tile.linked.push(tileDown);
    });

  }

  restart() {
    this.gameOver = false;
    this._collected$.next([]);
    this.tiles.forEach(tile => tile.clear());
    this.nextTurn();
  }

  private getTileOnPos(col: number, row: number): Tile {
    if (col < 0 || row < 0 || col >= this.totalCols || row >= this.totalRows) return null;

    return this.tilesPos[col][row];
  }

  nextTurn() {

    if (this.anyEmptyCells) {
      this.tilesWithCards = this.tiles.filter(tile => tile.card);
      this.tilesWithCards.forEach(tile => {
        tile.card.age = isNaN(tile.card.age) ? 0 : tile.card.age + 1;
        tile.card.moved = false;
      });
      //let aliveTiles: Tile[] = this.tilesWithCards.filter(tile => tile.card.type == TRAP && tile.card.age);

      this.moveZoombies();
      this.trapZoombies();
      this.findGraveMatches();

      this.setNextValue();
      this._tiles$.next(Object.assign({}, this).tiles);
    } else {
      this.gameOver = true;
    }
  }

  moveZoombies() {
    let actionTaken: boolean = false;
    let zoombies: Tile[] = this.tiles.filter(tile => tile.card && tile.card.name === "zoombie" && !tile.card.moved);

    zoombies.forEach(zoombie => {
      if (zoombie && this.moveCardToRandomEmpty(zoombie) == true) {
        actionTaken = true;
      }
    })

    if (actionTaken) {
      this.moveZoombies();
    }
  }

  trapZoombies() {
    let zoombies: Tile[] = this.tiles.filter(tile => (tile.card && tile.card.name === "zoombie"));
    zoombies.forEach(zoombie => {
      if (zoombie.getAllEmpties().length == 0) {
        zoombie.card = this.getNewCard("grave");
      }
    })
  }

  findGraveMatches() {
    let actionTaken: boolean;
    let graves: Tile[] = this.tiles.filter(tile => (tile.card && tile.card.name === "grave"));
    graves.forEach(grave => {
      this.findMatch(grave);
    })

  }

  moveCardToRandomEmpty(tile: Tile): boolean {

    if (!tile) return false;
    let empties: Tile[] = tile.getAllEmpties();
    if (empties.length) {
      let rand: number = Math.floor(Math.random() * (empties.length));
      let moveToTile: Tile = empties.filter((item, index) => index == rand)[0];
      tile.card.moved = true;
      moveToTile.card = tile.card;

      tile.clear();
      return true;
    }
    return false;
  }



  collect(card: ICard) {
    if (!card) return;
    console.log("card collected " + card.name);

    this.collected.push(card);
    this._collected$.next(Object.assign({}, this).collected);
    console.log("total collected = " + this.collected.length);
  }

  setNextValue() {
    let rand: number = Math.round(Math.random() * 100);
    let pickFrom: ICard[] = cardCollection.filter(item => item.chance >= rand)
    let randCard: ICard = pickFrom[Math.floor(Math.random() * (pickFrom.length))];

    this.updateCurrentCard = new Card(randCard);
  }

  findMatch(tile: Tile) {
    if (!tile.card) return;

    if (tile.card.type === WILD_CARD) {
      let cardsAround: Tile[] = tile.getCardsAround();

      if (cardsAround.length > 1) {
        let arr: number[] = this.findDup(cardsAround.map(a => a.card.value));

        if (arr.length) {
          let wildValue: number = arr.reduce((prev, cur) => { return prev ? (cur > 0 && cur > prev) ? cur : prev : cur });
          log("wildValue = " + wildValue)

          if (wildValue) {
            tile.card = this.getNewCardByValue(wildValue);
          } else {
            tile.card = this.getNewCard("grave");
          }

        } else {
          tile.card = this.getNewCard("grave");
        }
      } else {
        tile.card = this.getNewCard("grave");
      }
    }




    let matchedTiles: Tile[] = tile.getMatchesAround();

    if (matchedTiles.length > 1) {
      tile.card.bonus = 0;
      matchedTiles.forEach(linked => {

        if (linked && linked.card && linked.card.bonus) {
          tile.card.bonus += linked.card.bonus;
        }
        linked.clear();

      });
      log('bonus = ' + tile.card.bonus)
      //tile.card = tile.card.nextCard ? tile.card.nextCard : null;
      if (tile.card.nextCard) {
        tile.card = new Card(tile.card.nextCard)
        tile.card.bonus += matchedTiles.length - (tile.card.minForNextLevel - 1);
        //tile.card.bonus ++;
        //debugger
        this.findMatch(tile);
      } else {
        this.collect(tile.card);
        tile.clear();
      }
    }

  }

  getNewCardByValue(value: number): Card {
    let newCard: Card;

    let recurse: Function = (card: ICard) => {
      if (card.value == value) {
        newCard = new Card(cardCollection.find(a => a.value === value))
      }
      if (card.nextCard) recurse(card.nextCard)
    }

    cardCollection.forEach(a => recurse(a));
    log("return card for " + value + " = " + newCard.name);
    return newCard;
  }

  getNewCard(name: string): Card {
    let card: Card = new Card(cardCollection.find(a => a.name == name))
    return card;
  }

  get anyEmptyCells() {
    return this.tiles.filter(a => !a.card).length;
  }

  findDup(arr): any[] {
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < arr.length - 1; i++) {
      if (sorted_arr[i + 1] && sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }

    return results;
  }

}
