
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { IResourceStorage } from 'app/services/game-engine.service';
import { IGameLevelData } from './../game/levels/game-level';
import { MessagesService } from './messages.service';
import { TerrainEnum } from './../enums/terrain.enum';
import { Injectable, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tile } from '../game/board/tile/tile';
import { Card, ICardData, cardCollection } from '../game/cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { BuildingEnum } from '../enums/building-enum.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { ResourceEnum } from 'app/enums/resource-enum.enum';
import { GameLevel } from '../game/levels/game-level';

interface IGameModel {
  turn: number,
  gameOver: boolean,
  currentLevel: GameLevel,
  currentCard: Card,
  tiles: Tile[],
  population: number,
  resourceStorage: IResourceStorage
}

export interface IResourceStorage {
  bricks?: number,
  lumber?: number,
  coins?: number,
  maxStorage?: number,
}

const initResourcesStorage: IResourceStorage = { bricks: 0, lumber: 0, coins: 0, maxStorage: 0 };
const gameStateInit: IGameModel = {
  tiles: [],
  gameOver: false,
  turn: 0,
  currentCard: null,
  currentLevel: null,
  population: 0,
  resourceStorage: null
}

export class GameEngineService {
  totalRows: number = 11;
  totalCols: number = 5;

  private tilesPos: any[] = [];
  private tilesMatches: Tile[] = [];
  private tilesCities: Tile[] = [];

  private prevGameState: IGameModel;;
  private gameState: IGameModel = gameStateInit;

  private _tiles$: BehaviorSubject<Tile[]>;
  private _cardHint$: BehaviorSubject<Card>;
  private _resourceStorage$: BehaviorSubject<IResourceStorage>;
  private _population$: BehaviorSubject<number>;
  private _currentCard$: BehaviorSubject<Card>;
  private _currentLevel$: BehaviorSubject<GameLevel>;
  private _years$: BehaviorSubject<number>;

  get cardHint$(): Observable<Card> { return this._cardHint$.asObservable(); }
  get population$(): Observable<number> { return this._population$.asObservable(); }
  get tiles$(): Observable<Tile[]> { return this._tiles$.asObservable(); }
  get resourceStorage$(): Observable<IResourceStorage> { return this._resourceStorage$.asObservable(); }
  get currentLevel$(): Observable<GameLevel> { return this._currentLevel$.asObservable(); }
  get currentCard$(): Observable<Card> { return this._currentCard$.asObservable(); }
  get years$(): Observable<number> { return this._years$.asObservable(); }

  set updateCurrentCard(card: Card) {
    this.prevGameState = Object.assign({}, this).gameState;
    this.gameState.currentCard = card;
    this._currentCard$.next(Object.assign({}, this.gameState).currentCard);
  }

  set updatePopulation(amount: number) {
    //this.population += amount;
    this.gameState.population += amount;
    this._population$.next(this.gameState.population);
  }

  set updateResourceStorage(storage: IResourceStorage) {
    // this.resourceStorage = storage;
    this.gameState.resourceStorage = storage;
    this._resourceStorage$.next(Object.assign({}, this.gameState).resourceStorage);
  }

  constructor() {
    this._resourceStorage$ = <BehaviorSubject<IResourceStorage>>new BehaviorSubject(initResourcesStorage);
    this._cardHint$ = <BehaviorSubject<Card>>new BehaviorSubject(null);
    this._population$ = <BehaviorSubject<number>>new BehaviorSubject(0);
    this._tiles$ = <BehaviorSubject<Tile[]>>new BehaviorSubject(null);
    this._currentCard$ = <BehaviorSubject<Card>>new BehaviorSubject(null);
    this._currentLevel$ = <BehaviorSubject<GameLevel>>new BehaviorSubject(null);
    this._years$ = <BehaviorSubject<number>>new BehaviorSubject(0);

    this.generateWorld();
  }

  generateWorld() {
    for (var i = 0; i < this.totalCols; i++) {
      this.tilesPos[i] = [];
      for (var j = 0; j < this.totalRows; j++) {

        let newTile: Tile = new Tile(i, j);

        if (j >= Math.floor(this.totalRows / 2)) {
          newTile.terrain = new Terrain();
          this.tilesMatches.push(newTile);
        } else {
          newTile.terrain = new Terrain(TerrainEnum.CITY);
          this.tilesCities.push(newTile);
        }

        this.gameState.tiles.push(newTile);
        this.tilesPos[i][j] = newTile;
      }
    }

    let middle: number = Math.floor(this.totalRows / 2);
    this.getTileByCord(0, middle).terrain = new Terrain(TerrainEnum.WATER);
    this.getTileByCord(1, middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    this.getTileByCord(2, middle).terrain = new Terrain(TerrainEnum.WATER);
    this.getTileByCord(3, middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    this.getTileByCord(4, middle).terrain = new Terrain(TerrainEnum.WATER);

    this.getTileByCord(0, this.totalRows - 1).terrain = new Terrain(TerrainEnum.CARD_HOLDER);

    this.gameState.tiles.forEach(tile => {
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

  getRandomTile(tilesFiltered: Tile[] = null): Tile {
    let arr: Tile[] = tilesFiltered ? tilesFiltered : this.gameState.tiles;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  start() {
    let localData: string = localStorage.getItem('gameData')
    this.gameState = localData ? JSON.parse(localData) : Object.assign({}, gameStateInit);

    this.restart(true);
  }

  restart(firstTime: boolean = false) {
    if (!firstTime) {
      this.gameState.tiles.forEach(tile => tile.clear());
      this.gameState = Object.assign({}, gameStateInit);
    }

    this._tiles$.next(Object.assign({}, this.gameState).tiles);
    //this._resourceStorage$.next(Object.assign({}, this.gameState).resourceStorage);
    this._currentLevel$.next(this.gameState.currentLevel);
    this._population$.next(this.gameState.population);
    this._years$.next(this.gameState.turn);

    this.updateResourceStorage = initResourcesStorage;

    this.setNextLevel();
    this.placeRandomResources();
    this.setNextValue();
  }

  setNextLevel() {
    this.gameState.currentLevel = new GameLevel(this.gameState.currentLevel);
    this._currentLevel$.next(Object.assign({}, this.gameState).currentLevel)
    console.log("NEW LEVEL = " + this.gameState.currentLevel.index);
  }

  placeRandomResources() {
    const options: number[] = [CardFamilyTypeEnum.BRICK, CardFamilyTypeEnum.LUMBER];

    for (let i = 0; i < 5; i++) {
      let tile: Tile = this.getRandomTile(this.tilesMatches.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card));
      let rand: number = Math.floor(Math.random() * options.length);
      tile.card = this.getNewCard(options[rand]);
      tile.card.autoPlaced = true;
    }

    let arr: Tile[] = this.tilesCities.filter(a => a.row > 0 && a.row < (this.totalRows / 2 - 2) && a.linked.length > 3);
    let randTile: Tile = this.getRandomTile(arr.filter(a => !a.card));
    randTile.card = this.getNewCard(CardFamilyTypeEnum.STORAGE);
    randTile.card.autoPlaced = true;

    randTile = this.getRandomTile(arr.filter(a => !a.card));
    randTile.card = this.getNewCard(CardFamilyTypeEnum.HOUSE);
    randTile.card.autoPlaced = true;
  }

  private getTileOnPos(col: number, row: number): Tile {
    if (col < 0 || row < 0 || col >= this.totalCols || row >= this.totalRows) return null;

    return this.tilesPos[col][row];
  }

  nextTurn() {
    this.gameState.tiles.filter(tile => tile.card && tile.card.type == CardTypeEnum.WALKER).forEach(tile => {
      tile.card.age++;
      tile.card.moved = false;
    });

    this.moveWalkers();
    this.trapWalkers();

    this.gameState.turn++;
    this._years$.next(this.gameState.turn);
    this.setNextValue();

    this._tiles$.next(Object.assign({}, this.gameState).tiles);

    setTimeout(() => {
      this.roundComplete();
    }, 200);


    //localStorage.setItem('gameData', JSON.stringify(this.gameState.tiles));

  }

  roundComplete() {
    if (this.gameState.population >= this.gameState.currentLevel.goal) {
      this.setNextLevel();
    }
  }

  getCityTile(): Tile {
    let tile: Tile = this.tilesCities.filter(a => !a.card)[0];
    return tile;
  }


  moveWalkers() {
    let actionTaken: boolean = false;
    let walkers: Tile[] = this.gameState.tiles.filter(tile => tile.card && tile.card.type === CardTypeEnum.WALKER && !tile.card.moved);
    let people: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.PERSON);
    let animals: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ANIMAL);
    let zoombies: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ZOOMBIE);

    people.forEach(person => { if (this.movePersonToRandomEmpty(person) == true) actionTaken = true })
    animals.forEach(animal => { if (this.moveAnimalToRandomEmpty(animal) == true) actionTaken = true })
    zoombies.forEach(zoombie => { if (this.moveZoombiesToRandomEmpty(zoombie) == true) actionTaken = true })

    if (actionTaken) {
      this.moveWalkers();
    }
  }

  trapWalkers() {
    let walkers: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.mergeBy === MergeTypeEnum.TRAP && tile.terrain.type == TerrainEnum.RESOURCES));
    this.testGroupTrapped(walkers);
  }

  getLinkedGroup(firstOne: Tile): Tile[] {
    let group: Tile[] = [];
    group.push(firstOne);

    let addToQue: Function = (tile: Tile) => {
      tile.linked.forEach(linked => {
        if (linked.card && linked.card.value == firstOne.card.value && group.indexOf(linked) == -1) {
          group.push(linked);
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
          if (linked.card && linked.card.mergeBy == MergeTypeEnum.TRAP && walkersGroup.indexOf(linked) == -1) {
            walkersGroup.push(linked);
            walkers.splice(walkers.indexOf(linked), 1);
            addToQue(linked)
          }
        })
      }

      addToQue(firstOne);

      let foundEmpty: boolean;
      walkersGroup.filter(walkers => {
        if (walkers.getAllEmpties().filter(a => a.terrain.type == TerrainEnum.RESOURCES).length > 0) {
          foundEmpty = true;
        }
      })

      if (!foundEmpty) {
        this.trapWalkersGroup(walkersGroup);
        this.findMatch(walkersGroup[0])
      }

      this.testGroupTrapped(walkers);
    }
  }

  trapWalkersGroup(walkerGroup: Tile[]) {
    walkerGroup.forEach(walker => walker.card = this.getNewCard(CardFamilyTypeEnum.GRAVE))

  }

  findGraveMatches() {
    let actionTaken: boolean;
    let graves: Tile[] = this.tilesMatches.filter(tile => (tile.card && tile.card.family.name === CardFamilyTypeEnum.GRAVE));
    graves.sort((a, b) => a.card.age > a.card.age ? 0 : 1);
    graves.forEach(grave => {
      this.findMatch(grave);
    })
  }

  moveZoombiesToRandomEmpty(tile: Tile): boolean {
    let churchsAround: Tile[] = tile.getCardsAround().filter(a => a.card.family.name == CardFamilyTypeEnum.CHURCH && a.card.collected < a.card.collect)
    if (churchsAround.length) {
      let rand: number = Math.floor(Math.random() * (churchsAround.length));
      let moveToTile: Tile = churchsAround.find((item, index) => index == rand);

      tile.clear();
      moveToTile.card.collected++;
      this.findMatch(moveToTile);
      return true;
    } else {

      let empties: Tile[] = tile.getAllEmpties().filter(a => (a.terrain.walkable));

      switch (tile.terrain.type) {
        case TerrainEnum.BRIDGE:
          empties = empties.filter(a => (a.terrain.type != TerrainEnum.RESOURCES));
          break;
        case TerrainEnum.CITY:
          // case TerrainEnum.ROAD:
          empties = empties.filter(a => (a.terrain.type != TerrainEnum.BRIDGE));
          break;
      }

      return this.moveToRandomSpot(tile, empties);
    }
  }
  moveAnimalToRandomEmpty(tile: Tile): boolean {
    let empties: Tile[] = tile.getAllEmpties().filter(a => (a.terrain.walkable)).filter(a => (a.terrain.type == TerrainEnum.RESOURCES));

    return this.moveToRandomSpot(tile, empties);
  }

  movePersonToRandomEmpty(tile: Tile): boolean {
    let housesAround: Tile[] = tile.getCardsAround().filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE && a.card.collected < a.card.collect)
    if (housesAround.length) {
      let rand: number = Math.floor(Math.random() * (housesAround.length));
      let moveToTile: Tile = housesAround.find((item, index) => index == rand);
      //tile.card.moved = true;
      console.log("POPULATE HOUSE!!!!");
      tile.clear();
      moveToTile.card.collected++;
      this.updatePopulation = 1;
      return true;
    } else {
      let empties: Tile[] = tile.getAllEmpties().filter(a => (a.terrain.walkable));
      let foundRoad: Tile = empties.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD && a != tile.card.preTile);
      if (foundRoad) {
        empties = [foundRoad];
      } else {
        switch (tile.terrain.type) {
          case TerrainEnum.BRIDGE:
            empties = empties.filter(a => (a.terrain.type != TerrainEnum.RESOURCES));
            break;
          case TerrainEnum.CITY:
            // case TerrainEnum.ROAD:
            empties = empties.filter(a => (a.terrain.type != TerrainEnum.BRIDGE));
            break;
        }
      }

      return this.moveToRandomSpot(tile, empties);
    }
  }



  moveToRandomSpot(tile: Tile, empties: Tile[]): boolean {
    if (empties.length) {
      let rand: number = Math.floor(Math.random() * (empties.length));
      let moveToTile: Tile = empties.find((item, index) => index == rand);
      tile.card.moved = true;
      moveToTile.card = tile.card;
      moveToTile.card.preTile = tile;
      tile.clear();
      return true;
    }
    return false;
  }

  removeFromResourcesStorage(amount: number) {
    for (let i = 0; i < amount; i++) {
      let storages: Tile[] = this.tilesCities.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE && a.card.collected)
      if (storages && storages.length) {
        storages[0].card.collected--;
      }
    }
  }

  collectResources(type: number, amount: number): boolean {
    let collected: boolean = this.addToStorage(type, amount);

    this._tiles$.next(Object.assign({}, this.gameState).tiles);
    return collected;
  }

  addToStorage(type: number, amount: number): boolean {

    let newResources: IResourceStorage = this.gameState.resourceStorage;

    if (type == CardFamilyTypeEnum.COIN) {
      newResources.coins += amount;
      this.updateResourceStorage = newResources;
      return true;
    } else {
      let storages: Tile[] = this.tilesCities.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE && (a.card.collected + amount) <= a.card.collect);

      if (storages.length) {
        storages[0].card.collected += amount

        switch (type) {
          case CardFamilyTypeEnum.LUMBER:
            newResources.lumber += amount;
            break;
          case CardFamilyTypeEnum.BRICK:
            newResources.bricks += amount;
            break;
          case CardFamilyTypeEnum.COIN:
            newResources.coins += amount;
            break;
        }

        this.updateResourceStorage = newResources;
        return true;
      } else {
        console.log("no place in storage");
        return false;
      }
    }

  }

  setNextValue() {
    let rand: number = Math.round(Math.random() * 100);
    let pickFrom: ICardData[] = [];
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
    if (!tile.card || !tile.card.family) return;

    if (tile.card.family.name == CardFamilyTypeEnum.WILD) {
      this.handleWild(tile);
    }

    let matchedTiles: Tile[] = tile.getMatchesAround();

    if (matchedTiles.length > 1) {
      let totalCollected: number = 0;

      matchedTiles.filter(a => a.card).forEach(linked => {
        if (linked.card && linked.card.collected) totalCollected += linked.card.collected;
        /* if (tile.card.type == CardTypeEnum.BUILDING) {
          if (linked.card.collected) totalCollected += linked.card.collected;
        } else {
          if (linked.card.collected) totalCollected += linked.card.collected;
        }
 */
        linked.clear();
      });


      if (tile.card.nextCard) {

        let extra: number = matchedTiles.length - (tile.card.minForNextLevel - 1) // * Math.max(tile.card.bonus, 1);
        let bonus: number = tile.card.collect ? extra * tile.card.collect : extra;

        tile.card = new Card(tile.card.nextCard)

        if (tile.card.bonus) {
          //this.addToStorage(CardFamilyTypeEnum.COIN, tile.card.bonus);
          let empties: Tile[] = tile.getAllEmpties();
          if (empties.length) {
            empties[0].card = this.getNewCard(CardFamilyTypeEnum.COIN);
            empties[0].card.collected = tile.card.bonus;
          }
        }

        if (tile.card.type == CardTypeEnum.BUILDING) {
          tile.card.collected = totalCollected;
        } else {
          if (tile.card.collect) {
            // tile.card.collect += totalCollected;
            tile.card.collected = tile.card.collect + bonus;
          };// + extra * (tile.card.level);
        }
        // debugger;
        /* if (tile.card.collect) {
          tile.card.collect += totalCollected + extra * (tile.card.level - 1);
          tile.card.collected = totalCollected
        } */

        if (bonus) {
          const arr = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000];
          this.addToStorage(CardFamilyTypeEnum.COIN, (bonus / 100) * (arr[(tile.card.level - 1)]));
        }

        this.findMatch(tile);
      }
    }
  }

  handleWild(tile: Tile) {

    let optionsForWild: Tile[] = tile.linked.filter(a => a.card && a.card.mergeBy == MergeTypeEnum.MATCH);
    optionsForWild = optionsForWild.filter(a=>{
      tile.card = a.card;
      return this.getLinkedGroup(a).length >= a.card.minForNextLevel;
    })
    optionsForWild.sort((a, b) => {
      if (a.card.family != b.card.family) {
        if (a.card.value > b.card.value) return -1;
        if (b.card.value > a.card.value) return 1;
      }
      else if (a.card.family == b.card.family) {
        if (a.card.level == (b.card.level - 1)) return -1;
        if (b.card.level == (a.card.level - 1)) return 1;

        if (a.card.level > b.card.level) return -1;
        if (b.card.level > a.card.level) return 1;
      }

      return 0;
    });

    tile.card = optionsForWild.length ? optionsForWild[0].card : this.getNewCard(CardFamilyTypeEnum.GRAVE);
  }

  getNewCard(familyName: number, level: number = 0): Card {

    let curCardData: ICardData = cardCollection.find(a => a.family.name == familyName);
    if (level) {
      for (let i = 0; i < level; i++) {
        if (curCardData.nextCard) curCardData = curCardData.nextCard;
      }
    }

    let card: Card = new Card(curCardData)


    return card;
  }


  doUndo() {
    this.gameState = Object.assign({}, this).prevGameState;

    this._currentCard$.next(Object.assign({}, this.gameState).currentCard);
    this._tiles$.next(Object.assign({}, this.gameState).tiles);
    this._population$.next(Object.assign({}, this.gameState).population);
    this._years$.next(Object.assign({}, this.gameState).turn);
  }

  showCardMatchHint(card: Card) {
    this._cardHint$.next(card);
  }

}
