import { Injectable, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tile } from '../game/board/tile/tile';
import { log } from 'util';
import { Resources } from '../enums/resources.enum';
import { Card, ICardData, cardCollection, WILD_CARD, ENEMY, cardCityCollection, WALKING, MATCH, TRAP } from '../game/cards/card';
import { ICost } from '../game/board/tile/tile-buy-popup/buy-item/buy-item';
import { Terrain } from 'app/game/board/tile/terrain';
import { Building } from 'app/game/board/tile/building';
import { timeout } from 'rxjs/operators/timeout';

export class GameEngineService {
  totalRows: number = 11;
  totalCols: number = 5;
  turn: number = 0;
  private collected: Card[] = [];
  private spawnEnemies: Card[] = [];

  private tiles: Tile[] = [];
  private population: number = 0;
  private tilesMatches: Tile[] = [];
  private tilesCities: Tile[] = [];

  private _tiles$: BehaviorSubject<Tile[]>;

  private _population$: BehaviorSubject<number>;
  private _currentCard$: BehaviorSubject<Card>;
  private _years$: BehaviorSubject<number>;
  private _collected$: BehaviorSubject<Card[]>;
  private _spawnEnemies$: BehaviorSubject<Card[]>;
  private tilesPos: any[] = [];

  gameOver: boolean;

  get population$(): Observable<number> { return this._population$.asObservable(); }
  get tiles$(): Observable<Tile[]> { return this._tiles$.asObservable(); }
  get currentCard$(): Observable<Card> { return this._currentCard$.asObservable(); }
  get collected$(): Observable<Card[]> { return this._collected$.asObservable(); }
  get years$(): Observable<number> { return this._years$.asObservable(); }
  get spawnEnemies$(): Observable<Card[]> { return this._spawnEnemies$.asObservable(); }

  set updateCurrentCard(card: Card) {
    this._currentCard$.next(card);
  }

  set updatePopulation(amount: number) {
    this.population += amount;
    this._population$.next(this.population);
  }

  constructor() {
    this._population$ = <BehaviorSubject<number>>new BehaviorSubject(0);
    this._tiles$ = <BehaviorSubject<Tile[]>>new BehaviorSubject(null);
    this._currentCard$ = <BehaviorSubject<Card>>new BehaviorSubject(null);
    this._collected$ = <BehaviorSubject<Card[]>>new BehaviorSubject(null);
    this._years$ = <BehaviorSubject<number>>new BehaviorSubject(0);
    this._spawnEnemies$ = <BehaviorSubject<Card[]>>new BehaviorSubject(null);

    let count: number = 0;
    for (var i = 0; i < this.totalCols; i++) {
      this.tilesPos[i] = [];
      for (var j = 0; j < this.totalRows; j++) {

        let newTile: Tile = new Tile(i, j);
        // if (count >= Math.floor((this.totalCols * this.totalRows) / 2)) {
        if (j >= Math.floor(this.totalRows / 2)) {
          //newTile = new TileMatch(i, j);
          newTile.terrain = new Terrain();
          this.tilesMatches.push(newTile);
        } else {
          //newTile = new TileCity(i, j)
          newTile.terrain = new Terrain("city");
          this.tilesCities.push(newTile);
        }


        this.tiles.push(newTile);
        this.tilesPos[i][j] = newTile;
        count++;
      }
    }


    let middle: number = Math.floor(this.totalRows / 2);
    this.getTileByCord(0, middle).terrain = new Terrain('water');
    this.getTileByCord(1, middle).terrain = new Terrain('bridge');
    this.getTileByCord(2, middle).terrain = new Terrain('water');
    this.getTileByCord(3, middle).terrain = new Terrain('bridge');
    this.getTileByCord(4, middle).terrain = new Terrain('water');
    //this.getTileByCord(5, 6).terrain = new Terrain('water');


    /* let t: Tile
    for (let i = 0; i < 1; i++) {
      do {
        t = this.getRandomTile();
      } while (t.terrain.type == "water");

      t.terrain = new Terrain('water');
    } */


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

  getTileByCord(col: number, row: number): Tile {
    return this.tilesPos[col][row];
  }
  getRandomTile(): Tile {
    return this.tiles[Math.floor(Math.random() * this.tiles.length)];
  }

  restart() {
    this.turn = 0;
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

    this.tiles.filter(tile => tile.card && tile.card.type == WALKING).forEach(tile => {
      tile.card.age++;//= isNaN(tile.card.age) ? 0 : tile.card.age + 1;
      tile.card.moved = false;
    });

    this.moveWalkers();
    this.trapWalkers();

    this.turn++;
    this._years$.next(this.turn);
    this.setNextValue();
    this._tiles$.next(Object.assign({}, this).tiles);

    setTimeout(() => {
      this.findGraveMatches();
      this.placeZoombies();
      this.roundComplete();
    }, 200);


  }

  roundComplete() {
    if (!this.anyEmptyCells) {
      this.gameIsOver();
    } 
  }

  getCityTile(): Tile {
    let tile: Tile = this.tilesCities.filter(a => !a.card)[0];

    return tile;
  }

  gameIsOver() {
    this.gameOver = true;
  }

  moveWalkers() {
    let actionTaken: boolean = false;
    let walkers: Tile[] = this.tiles.filter(tile => tile.card && tile.card.type === WALKING && !tile.card.moved);

    walkers.forEach(walker => {
      if (walker && this.moveCardToRandomEmpty(walker) == true) {
        actionTaken = true;
      }
    })

    if (actionTaken) {
      this.moveWalkers();
    }
  }

  trapWalkers() {
    let people: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.name === Resources.PERSON));
    this.testGroupTrapped(people);

    //let zoombies: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.name === ENEMY));
    //this.testGroupTrapped(zoombies);
  }

  getLinkedGroup(firstOne: Tile): Tile[] {
    let group: Tile[] = [];
    group.push(firstOne);

    let addToQue: Function = (tile: Tile) => {
      tile.linked.forEach(linked => {
        if (linked.card && linked.card.value == firstOne.card.value && group.indexOf(linked) == -1) {
          group.push(linked);
          //walkers.splice(walkers.indexOf(linked), 1);
          addToQue(linked)
        }
      })
    }

    addToQue(firstOne);

    return group;
  }

  testGroupTrapped(walkers: Tile[]) {
    if (walkers.length) {
      let walkersGroup: Tile[] = [];
      let firstOne: Tile = walkers.pop();
      walkersGroup.push(firstOne);

      let addToQue: Function = (tile: Tile) => {
        tile.linked.forEach(linked => {
          if (linked.card && linked.card.name == Resources.PERSON && walkersGroup.indexOf(linked) == -1) {
            walkersGroup.push(linked);
            walkers.splice(walkers.indexOf(linked), 1);
            addToQue(linked)
          }
        })
      }

      addToQue(firstOne);

      let foundEmpty: boolean;
      walkersGroup.filter(walkers => {
        if (walkers.getAllEmpties().filter(a => a.terrain.type == "resource").length > 0) {
          foundEmpty = true;
        }
      })

      if (!foundEmpty) {
        this.trapWalkersGroup(walkersGroup);
      }

      this.testGroupTrapped(walkers);
    }
  }

  trapWalkersGroup(walkerGroup: Tile[]) {
    //walkerGroup.forEach(walker => walker.card = this.getNewCard(Resources.GRAVE))
    walkerGroup.forEach(walker => walker.card = this.getNewCardByValue(walker.card.nextCard.id))
  }

  findGraveMatches() {
    let actionTaken: boolean;
    let graves: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.name === Resources.GRAVE));
    graves.sort((a, b) => a.card.age > a.card.age ? 0 : 1);
    graves.forEach(grave => {
      this.findMatch(grave);
    })
  }

  placeZoombies() {
    let enemies: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.name === ENEMY));

    enemies.forEach(enemyTile => {
      let spotOptions: Tile[] = this.tilesCities.filter(tile => (!tile.building && !tile.card));
      let emptyCitySlot: Tile = spotOptions[Math.floor(Math.random() * spotOptions.length)];

      emptyCitySlot.card = this.getNewCardByValue(enemyTile.card.id);
      enemyTile.clear();
    })

  }

  moveCardToRandomEmpty(tile: Tile): boolean {
    if (!tile) return false;
    let empties: Tile[] = tile.getAllEmpties().filter(a => (a.terrain.type != "water" && a.terrain.type != "bridge"));

    if (tile.card.name == ENEMY) {

      //empties = tile.getAllEmpties().filter(a => (a.terrain.type != "water"));
      /* if (tile.terrain.type == "resource") {
        empties = empties.filter(a => (a.row <= tile.row));
      }
      
      if (empties.filter(a => a.building).length) {
        empties = empties.filter(a => a.building);
      } */
    } else {
      empties = tile.getAllEmpties().filter(a => (a.terrain.type == "resource"));
    }

    if (empties.length) {
      let rand: number = Math.floor(Math.random() * (empties.length));
      let moveToTile: Tile = empties.find((item, index) => index == rand);

      tile.card.moved = true;
      moveToTile.card = tile.card;

      if (tile.card.name == ENEMY) {
        if (moveToTile.building) {
          moveToTile.building = null;
          setTimeout(() => {
            moveToTile.clear();
          }, 500);
        }

        if (moveToTile.getAllEmpties().find(a => a.building && a.building.type == "tower")) {
          console.log("KILL ZOOMBIE!");
          setTimeout(() => {
            moveToTile.clear();
          }, 500);
        }
      }

      tile.clear();
      return true;
    }
    return false;
  }

  collect(card: Card, amount: number) {
    if (!card) return;
    console.log("+card collected " + amount);

    for (let i = 0; i < amount; i++) {
      let newCard: Card = this.getNewCardByValue(card.id)

      if (card.name == Resources.GRAVE) {
        this._spawnEnemies$.next([Object.assign({}, newCard)]);
      } else {
        this.collected.push(newCard);
        this._collected$.next(Object.assign({}, this).collected);
      }
    }

    console.log("total collected = " + this.collected.length);
  }

  setNextValue() {
    let rand: number = Math.round(Math.random() * 100);


    let pickFrom: ICardData[] = []
    cardCollection.filter(item => item.chance).forEach(a => {
      pickFrom.push(a);
      if (a.nextCard && a.nextCard.chance) {
        pickFrom.push(a.nextCard);
      }
    })

    pickFrom = pickFrom.filter(item => item.chance >= rand)
    let randCard: ICardData = pickFrom[Math.floor(Math.random() * (pickFrom.length))];

    this.updateCurrentCard = new Card(randCard);
  }

  findMatch(tile: Tile) {
    if (!tile.card) return;

    if (tile.card.name == Resources.WILD) {
      this.handleWild(tile);
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

      if (tile.card.nextCard) {
        let bonus: number = (matchedTiles.length - (tile.card.minForNextLevel - 1)) * Math.max(tile.card.bonus, 1);
        tile.card = new Card(tile.card.nextCard)

        if (tile.card.collect) {
          tile.card.collect += bonus;
        }

        if (tile.card.bonus) {
          let coinChance: number = tile.card.bonus;

          /* if (coinChance > Math.random() * 100) {
            this.collect(this.getNewCard(Resources.COIN), 1);
          } */
          if (coinChance) {
            this.collect(this.getNewCard(Resources.COIN), bonus);
          }

        }

        this.findMatch(tile);
      } else {
        //this.collect(tile.card, matchedTiles.length + 1);
        //tile.clear();
      }
    }
  }

  handleWild(tile: Tile) {

    let optionsForWild: Card[] = tile.linked.filter(a => a.card && a.terrain.type == "resource" && a.card.type == MATCH).map(a => a.card);
    let selectedCard: Card = null;

    if (optionsForWild.length) {
      let groupScore: number = 0;

      optionsForWild.forEach(tileInList => {
        tile.card = tileInList;
        if (this.getLinkedGroup(tile).length > 2) {

          if (tileInList.family.value + (100000 - tileInList.id) > groupScore) {
            groupScore = tileInList.family.value;
            selectedCard = tileInList;
          }
          tile.card = null;
        }
      })
    }

    //tile.card = selectedCard ? selectedCard : this.getNewCard(Resources.GRAVE);
    tile.card = selectedCard ? selectedCard : this.getNewCardByValue(this.getNewCard(Resources.WILD).nextCard.id);
  }



  getNewCardByValue(value: number): Card {
    let newCard: Card;

    let recurse: Function = (cardData: ICardData) => {
      if ((cardData.id) == value) {
        newCard = new Card(cardData)
      } else if (cardData.nextCard) recurse(cardData.nextCard);
    }

    cardCollection.forEach(a => recurse(a));
    //log("return card for " + value + " = " + newCard.value);
    //return Object.assign({}, cardRef);
    return newCard;
  }

  getNewCard(name: string): Card {
    let card: Card = new Card(cardCollection.find(a => a.name == name))
    return card;
  }

  getNewCityCard(name: string): Card {
    let card: Card = new Card(cardCityCollection.find(a => a.name == name))
    return card;
  }

  get anyEmptyCells() {
    return this.tilesMatches.filter(a => !a.card).length;
  }


  useResources(cost: ICost): boolean {
    if (this.collected) {
      let canUseBlocks: boolean = !cost.block || this.collected.filter(a => a.family.name == Resources.BLOCK).length >= cost.block;
      let canUseLumber: boolean = !cost.lumber || this.collected.filter(a => a.family.name == Resources.LUMBER).length >= cost.lumber;
      let canUseCoins: boolean = !cost.coin || this.collected.filter(a => a.family.name == Resources.COIN).length >= cost.coin;

      if (canUseBlocks && canUseLumber && canUseCoins) {
        let i: number;
        let card: Card;

        let func: Function = (total: number, name: string) => {
          for (i = 0; i < total; i++) {
            let arr = this.collected.filter(item => { return item.family.name == name });
            if (arr && arr.length) {
              card = arr[0];
              this.collected.splice(this.collected.indexOf(card), 1);
            }
          }
        }

        func(cost.block, Resources.BLOCK);
        func(cost.lumber, Resources.LUMBER);
        func(cost.coin, Resources.COIN);
        this._collected$.next(Object.assign({}, this).collected);

        return true;
      }
    }
    return false;
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
