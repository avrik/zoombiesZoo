
import { IState } from './../redux/main-reducer';
import { GENERATE_WORLD_ACTION, NEW_GAME_ACTION } from './../redux/actions/actions';

import { IResourceStorage } from 'app/services/game-engine.service';
import { IGameLevelData } from './../game/levels/game-level';
import { MessagesService } from './messages.service';
import { Injectable, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tile } from '../game/board/tile/tile';
import { Card, ICardData, cardCollection } from '../game/cards/card';
import { Terrain } from 'app/game/board/tile/terrain';
import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';
import { GameLevel } from '../game/levels/game-level';
import { TileState } from '../enums/tile-state.enum';
import { CardState } from '../enums/card-state.enum';
import { CardFamilyTypeEnum } from '../enums/card-family-type-enum.enum';
import { TerrainEnum } from '../enums/terrain.enum';
import { createStore, combineReducers, Store } from 'redux'
import { mainReducerFunc } from 'app/redux/main-reducer';

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

export class GameEngineServiceee {

  currentState: IState;



  totalRows: number = 11;
  totalCols: number = 5;
  gameStarted: boolean;
  pendingTileBuilding: Tile;
  roundCompleted: boolean;
  private tilesPos: any[] = [];
  private tilesResources: Tile[] = [];
  private tilesCities: Tile[] = [];

  prevCurrentCard: Card;
  private prevGameState: IGameModel;
  private gameStateHistory: IGameModel[] = [];
  gameState: IGameModel = gameStateInit;

  private _tiles$: BehaviorSubject<Tile[]>;
  private _cardHint$: BehaviorSubject<Card>;
  private _resourceStorage$: BehaviorSubject<IResourceStorage>;
  private _population$: BehaviorSubject<number>;
  private _currentCard$: BehaviorSubject<Card>;
  private _currentLevel$: BehaviorSubject<GameLevel>;
  private _years$: BehaviorSubject<number>;
  store: Store<any>;

  get cardHint$(): Observable<Card> { return this._cardHint$.asObservable(); }
  get population$(): Observable<number> { return this._population$.asObservable(); }
  get tiles$(): Observable<Tile[]> { return this._tiles$.asObservable(); }
  get resourceStorage$(): Observable<IResourceStorage> { return this._resourceStorage$.asObservable(); }
  get currentLevel$(): Observable<GameLevel> { return this._currentLevel$.asObservable(); }
  get currentCard$(): Observable<Card> { return this._currentCard$.asObservable(); }
  get years$(): Observable<number> { return this._years$.asObservable(); }

  set updateCurrentCard(card: Card) {
    //this.prevGameState = Object.assign({}, this).gameState;.
    if (this.gameState.currentCard && this.gameState.currentCard.family) {

      this.prevCurrentCard = this.getNewCard(this.gameState.currentCard.family.name);
    }
    this.gameState.currentCard = Object.assign({}, card);
    this._currentCard$.next(card);
  }

  set updatePopulation(amount: number) {
    this.gameState.population += amount;
    this._population$.next(this.gameState.population);
  }

  set updateResourceStorage(storage: IResourceStorage) {
    this.gameState.resourceStorage = Object.assign({}, storage);
    this._resourceStorage$.next(this.gameState.resourceStorage);
  }

  constructor() {
    this.store = createStore(mainReducerFunc);

    /* let savedState = localStorage.getItem('gameState');
    if (savedState) {
      let initState: any = JSON.parse(savedState);

      this.store.dispatch({ type: "from_saved", payload: savedState });
    } */








    this._resourceStorage$ = <BehaviorSubject<IResourceStorage>>new BehaviorSubject(this.gameState.resourceStorage);
    this._cardHint$ = <BehaviorSubject<Card>>new BehaviorSubject(null);
    this._population$ = <BehaviorSubject<number>>new BehaviorSubject(this.gameState.population);

    this._currentCard$ = <BehaviorSubject<Card>>new BehaviorSubject(this.gameState.currentCard);
    this._currentLevel$ = <BehaviorSubject<GameLevel>>new BehaviorSubject(this.gameState.currentLevel);
    this._years$ = <BehaviorSubject<number>>new BehaviorSubject(this.gameState.turn);

    // this.generateWorld();

    this._tiles$ = <BehaviorSubject<Tile[]>>new BehaviorSubject(this.gameState.tiles);


    /* this.tiles$.subscribe(tiles => {
      if (tiles && this.gameStarted && !this.roundCompleted) {
        let done: number = tiles.filter(a => a.card && a.card.state != CardState.DONE).length;
        if (done === 0) {
          this.roundCompleted = true;
          setTimeout(() => { this.roundComplete(); }, 10);
        }
      }
    }) */

    this.store.subscribe(() => {
      if (!this.currentState || this.currentState.turn != this.store.getState().turn) {
        this.currentState = this.store.getState();
        console.info("GAME TURN = " + this.currentState.turn);
        if (this.currentState.tileClicked) {
          if (this.currentState.tileClicked.card.mergeBy == MergeTypeEnum.MATCH) {
            this.findMatch(this.currentState.tileClicked)
          }

          //this.moveWalkers();
        }

        /* if (this.currentState.level && this.currentState.population >= this.currentState.level.goal) {
          this.store.dispatch({ type: NEXT_LEVEL_ACTION });
        } */


      }
    });
  }

  generateWorld() {
    for (var i = 0; i < this.totalCols; i++) {
      this.tilesPos[i] = [];
      for (var j = 0; j < this.totalRows; j++) {

        let newTile: Tile = new Tile(i, j);

        if (j >= Math.floor(this.totalRows / 2)) {
          newTile.terrain = new Terrain();
          this.tilesResources.push(newTile);
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


    this.store.dispatch({ type: GENERATE_WORLD_ACTION, payload: this.gameState.tiles });
  }

  getTileByCord(col: number, row: number): Tile {
    return this.tilesPos[col][row];
  }

  getRandomTile(tilesFiltered: Tile[] = null): Tile {
    let arr: Tile[] = tilesFiltered ? tilesFiltered : this.gameState.tiles;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  start() {
    /* let localData: string = localStorage.getItem('gameData')
    this.gameState = localData ? JSON.parse(localData) : Object.assign({}, gameStateInit);

    this.restart(true); */
    this.generateWorld();
    this.placeRandomResources();

    this.store.dispatch({ type: NEW_GAME_ACTION, payload: [...this.gameState.tiles] });
  }

  restart(firstTime: boolean = false) {
    /* if (!firstTime) {
      this.gameState.tiles.forEach(tile => tile.reset());
      this.gameState = Object.assign({}, gameStateInit);
      this._currentLevel$.next(this.gameState.currentLevel);
      this._population$.next(this.gameState.population);
      this._years$.next(this.gameState.turn);

    }
    this.gameStarted = true;
    this.updateBoard();

    this.updateResourceStorage = initResourcesStorage;
    this.setNextLevel();
    this.placeRandomResources();

    */
  }

  setNextLevel() {
    this.gameState.currentLevel = new GameLevel(this.gameState.currentLevel);
    this._currentLevel$.next(Object.assign({}, this.gameState).currentLevel)
    console.log("NEW LEVEL = " + this.gameState.currentLevel.index);

    if (this.gameState.currentLevel.index && this.gameState.currentLevel.reward) {
      let options: Tile[] = this.tilesResources.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
      let rand: number = Math.floor(Math.random() * options.length);
      let getRandomTile: Tile = options.find((a, index) => index == rand);

      // getRandomTile.card = this.getNewCard(CardFamilyTypeEnum.COIN);
      getRandomTile.setCard(this.getNewCard(CardFamilyTypeEnum.COIN));
      getRandomTile.card.collected = getRandomTile.card.collect;
    }
  }

  placeRandomResources() {
    const options: number[] = [CardFamilyTypeEnum.BRICK, CardFamilyTypeEnum.LUMBER];

    for (let i = 0; i < 5; i++) {
      let tile: Tile = this.getRandomTile(this.tilesResources.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card));
      let rand: number = Math.floor(Math.random() * options.length);
      // tile.card = this.getNewCard(options[rand]);
      tile.setCard(this.getNewCard(options[rand]))
      tile.card.autoPlaced = true;
    }

    let arr: Tile[] = this.tilesCities.filter(a => a.terrain.type == TerrainEnum.CITY && a.row > 0 && a.row < (this.totalRows / 2 - 2) && a.linked.length > 3);
    let randTile: Tile = this.getRandomTile(arr.filter(a => !a.card));
    //randTile.card = this.getNewCard(CardFamilyTypeEnum.STORAGE);
    randTile.setCard(this.getNewCard(CardFamilyTypeEnum.STORAGE));
    randTile.card.autoPlaced = true;

    randTile = this.getRandomTile(arr.filter(a => !a.card));
    // randTile.card = this.getNewCard(CardFamilyTypeEnum.HOUSE);
    randTile.setCard(this.getNewCard(CardFamilyTypeEnum.HOUSE));
    randTile.card.autoPlaced = true;
  }

  private getTileOnPos(col: number, row: number): Tile {
    if (col < 0 || row < 0 || col >= this.totalCols || row >= this.totalRows) return null;

    return this.tilesPos[col][row];
  }

  updateBoard() {
    let newObj: IGameModel = Object.assign({}, this.gameState)
    newObj.tiles = newObj.tiles.map(a => Object.assign({}, a));
    newObj.currentCard = Object.assign({}, this.gameState).currentCard

    this.gameStateHistory.push(newObj);


    //this.prevGameState = Object.assign({}, this.gameState);
    this._tiles$.next(Object.assign({}, this.gameState).tiles);
  }


  placeCardOnBoard(tile: Tile, card: Card) {
    /* this.roundCompleted = false;
    
    this.updateCurrentCard = null;

    if (card.family.name != CardFamilyTypeEnum.ROAD) {
      //tile.card = card;
      tile.setCard(card);
      if (tile.card.mergeBy == MergeTypeEnum.MATCH) {
        this.findMatch(tile);
      }
    }

    this.moveWalkers();
    this.gameState.tiles.filter(tile => tile.card && tile.card.state == CardState.REGULAR).forEach(tile => tile.card.state = CardState.DONE);
    this.checkBombs();

    this.updateBoard();

    this.gameState.turn++;
    this._years$.next(this.gameState.turn); */
  }

  checkBombs() {
    let bombs: Tile[] = this.tilesResources.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);

    bombs.forEach(bomb => {
      bomb.card.collected--

      if (bomb.card.collected <= 0) {
        let around: Tile[] = bomb.linked.filter(a => a.card);
        around.push(bomb);
        around.forEach(tileNear => {
          tileNear.clear();
          tileNear.terrainTop = new Terrain(TerrainEnum.EXPLOSION);
          setTimeout(() => {
            tileNear.terrainTop = null;
            //this.updateBoard();
          }, 200);
        })
      }

    })
  }

  roundComplete() {
    //this.gameStateHistory.push(Object.assign({}, this.gameState));

    this.gameState.tiles.forEach(tile => tile.setNextTurn());
    console.log(`Round ${this.gameState.turn} complete`);

    //this.setNextValue();


    /* if (this.gameState.population >= this.gameState.currentLevel.goal) {
      this.setNextLevel();
    } */
  }

  getCityTile(): Tile {
    let tile: Tile = this.tilesCities.filter(a => !a.card)[0];
    return tile;
  }

  moveWalkers() {
    let actionTaken: boolean = false;
    let walkers: Tile[] = this.gameState.tiles.filter(tile =>
      tile.card &&
      tile.card.type === CardTypeEnum.WALKER &&
      tile.card.state == CardState.REGULAR &&
      (tile.terrain.type != TerrainEnum.CARD_HOLDER)
    );

    let people: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.PERSON);
    let animals: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ANIMAL);
    let zoombies: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ZOOMBIE);

    people.forEach(person => { if (this.movePersonToRandomEmpty(person) == true) actionTaken = true })
    animals.forEach(animal => { if (this.moveAnimalToRandomEmpty(animal) == true) actionTaken = true })
    zoombies.forEach(zoombie => { if (this.moveZoombiesToRandomEmpty(zoombie) == true) actionTaken = true })

    if (actionTaken) {
      this.moveWalkers();
    } else {
      this.trapWalkers();
    }
  }

  trapWalkers() {
    let walkers: Tile[] = this.tilesResources.filter(tile => (tile.card && tile.card.mergeBy === MergeTypeEnum.TRAP && tile.terrain.type == TerrainEnum.RESOURCES));
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
      let isZoombieGroup: boolean;
      walkersGroup.push(firstOne);

      let addToQue: Function = (tile: Tile) => {
        tile.linked.forEach(linked => {
          // if (linked.card && linked.card.mergeBy == MergeTypeEnum.TRAP && walkersGroup.indexOf(linked) == -1) {
          if (linked.card && linked.card.mergeBy == MergeTypeEnum.TRAP && walkersGroup.indexOf(linked) == -1) {
            // if (walkersGroup.indexOf(linked) == -1 && linked.card && linked.card.type == CardTypeEnum.RESOURCE) {

            walkersGroup.push(linked);
            walkers.splice(walkers.indexOf(linked), 1);
            addToQue(linked)

          }
        })
      }

      addToQue(firstOne);

      let foundEmpty: boolean;
      walkersGroup.filter(walkers => {
        if (walkers.linked.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES).length > 0) {
          foundEmpty = true;
        }
      })

      /* isZoombieGroup = walkersGroup.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.ZOOMBIE).length ? true : false;

      if (isZoombieGroup) {
        walkersGroup.forEach(a => { if (a.card.type == CardTypeEnum.WALKER) a.card = this.getNewCard(CardFamilyTypeEnum.ZOOMBIE) })
      } */

      if (!foundEmpty) {
        this.trapWalkersGroup(walkersGroup);
        this.findMatch(walkersGroup[0])
      }

      this.testGroupTrapped(walkers);
    }
  }

  trapWalkersGroup(walkerGroup: Tile[]) {
    //walkerGroup.forEach(walker => walker.card = this.getNewCard(CardFamilyTypeEnum.GRAVE))
    walkerGroup.forEach(walker => walker.setCard(this.getNewCard(CardFamilyTypeEnum.GRAVE)));

  }

  moveZoombiesToRandomEmpty(tile: Tile): boolean {
    let churchsAround: Tile[] = tile.linked.filter(a => a.card).filter(a => a.card.family.name == CardFamilyTypeEnum.CHURCH && a.card.collected < a.card.collect)
    if (churchsAround.length) {
      let rand: number = Math.floor(Math.random() * (churchsAround.length));
      let moveToTile: Tile = churchsAround.find((item, index) => index == rand);

      //tile.clear();
      moveToTile.card.collected++;

      this.moveAndClear(tile, moveToTile);

      //this.findMatch(moveToTile);
      return true;
    } else {

      let empties: Tile[] = tile.linked.filter(a => !a.card && a.terrain.walkable);

      switch (tile.terrain.type) {
        case TerrainEnum.BRIDGE:
          empties = empties.filter(a => (a.terrain.type != TerrainEnum.RESOURCES));
          break;
        case TerrainEnum.CITY:
          empties = empties.filter(a => (a.terrain.type != TerrainEnum.BRIDGE));
          break;
      }

      return this.moveToRandomSpot(tile, empties);
    }
  }
  moveAnimalToRandomEmpty(tile: Tile): boolean {
    let empties: Tile[] = tile.linked.filter(a => !a.card && a.terrain.walkable && a.terrain.type == TerrainEnum.RESOURCES);

    return this.moveToRandomSpot(tile, empties);
  }

  movePersonToRandomEmpty(tile: Tile): boolean {
    let housesAround: Tile[] = tile.linked.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE && a.card.collected < a.card.collect)
    if (housesAround.length) {
      let rand: number = Math.floor(Math.random() * (housesAround.length));
      let moveToTile: Tile = housesAround.find((item, index) => index == rand);

      //tile.clear();
      //tile.card.moved = true;
      moveToTile.card.collected++;
      this.updatePopulation = 1;

      this.moveAndClear(tile, moveToTile);
      return true;
    } else {
      let empties: Tile[] = tile.linked.filter(a => !a.card && a.terrain.walkable);
      let foundRoad: Tile = empties.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD && a != tile.card.preTile);
      if (foundRoad) {
        empties = [foundRoad];
      } else {
        switch (tile.terrain.type) {
          case TerrainEnum.BRIDGE:
            empties = empties.filter(a => (a.terrain.type != TerrainEnum.RESOURCES));
            break;
          case TerrainEnum.CITY:
            empties = empties.filter(a => (a.terrain.type != TerrainEnum.BRIDGE));
            break;
        }
      }

      return this.moveToRandomSpot(tile, empties);
    }
  }

  moveAndClear(from: Tile, to: Tile) {

    from.card.state = CardState.MOVING;
    if (to.col < from.col && to.row < from.row) { from.moveMe = "upLeftAndClear"; return }
    if (to.col < from.col && to.row > from.row) { from.moveMe = "upRightAndClear"; return }
    if (to.col > from.col && to.row < from.row) { from.moveMe = "downLeftAndClear"; return }
    if (to.col > from.col && to.row > from.row) { from.moveMe = "downRightAndClear"; return }

    if (to.col < from.col) { from.moveMe = "upAndClear"; return }
    if (to.col > from.col) { from.moveMe = "downAndClear"; return }
    if (to.row < from.row) { from.moveMe = "leftAndClear"; return }
    if (to.row > from.row) { from.moveMe = "rightAndClear"; return }
  }

  moveToRandomSpot(tile: Tile, empties: Tile[]): boolean {
    if (empties.length) {
      let rand: number = Math.floor(Math.random() * (empties.length));
      let moveToTile: Tile = empties.find((item, index) => index == rand);

      //tile.card.state = CardState.MOVING;
      moveToTile.card = tile.card;
      moveToTile.card.state = CardState.MOVING;
      moveToTile.card.preTile = tile;

      if (moveToTile.col < tile.col) moveToTile.moveMe = "up";
      if (moveToTile.col > tile.col) moveToTile.moveMe = "down";
      if (moveToTile.row < tile.row) moveToTile.moveMe = "left";
      if (moveToTile.row > tile.row) moveToTile.moveMe = "right";
      tile.clear();

      return true;
    } else {
      //tile.card.state = CardState.CANT_MOVE;
      return false;
    }
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

    //this._tiles$.next(Object.assign({}, this.gameState).tiles);

    this.updateBoard();
    return collected;
  }

  addToStorage(type: number, amount: number): boolean {

    let newResources: IResourceStorage = this.gameState.resourceStorage;
    if (!newResources) return;
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

      if (tile.card.nextCard) {
        let totalCollected: number = tile.card.type == CardTypeEnum.RESOURCE ? Math.max(tile.card.collect, 1) : 0;

        matchedTiles.filter(a => a.card).forEach(linked => {

          if (tile.card.type == CardTypeEnum.BUILDING) {
            if (linked.card.collected) totalCollected += linked.card.collected;
          } else {
            if (linked.card.nextCard.collect) {
              totalCollected += Math.max(linked.card.collected, 1);
            }
          }

          this.moveAndClear(linked, tile)
        });

        //tile.card = new Card(tile.card.nextCard)
        tile.setCard(new Card(tile.card.nextCard));

        if (tile.card.reward) {
          let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
          if (emptyTile) {
            //emptyTile.card = this.getNewCard(CardFamilyTypeEnum.COIN);
            emptyTile.setCard(this.getNewCard(CardFamilyTypeEnum.COIN));
            emptyTile.card.collected = tile.card.reward;
          }
        }

        tile.card.collected = totalCollected;

        let extra: number = matchedTiles.length - (tile.card.minForNextLevel - 1);
        if (extra) {
          const arr = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000];
          this.addToStorage(CardFamilyTypeEnum.COIN, (extra / 100) * (arr[(tile.card.level - 1)]));
        }

        this.findMatch(tile);
      }
    }
  }


  /* clearTile(tile: Tile) {
    tile.card = null;
    tile.state = TileState.REGULAR;
  }

  resetTile(tile: Tile) {
    tile.card = null;
    tile.state = TileState.REGULAR;
    tile.terrainTop = null;
    tile.overMe = false;
  } */

  handleWild(tile: Tile) {

    let optionsForWild: Tile[] = tile.linked.filter(a => a.card && a.card.mergeBy == MergeTypeEnum.MATCH);
    optionsForWild = optionsForWild.filter(a => {
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

    // tile.card = optionsForWild.length ? optionsForWild[0].card : this.getNewCard(CardFamilyTypeEnum.GRAVE);
    tile.setCard(optionsForWild.length ? optionsForWild[0].card : this.getNewCard(CardFamilyTypeEnum.GRAVE));
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
    this.gameState.tiles.forEach(tile => tile.undo())
    this.updateCurrentCard = this.prevCurrentCard;
    this.gameState.turn--;
    this._years$.next(Object.assign({}, this.gameState).turn);

    this.updateBoard();
  }

  moveTileBuilding(tile: Tile) {
    this.gameState.tiles.forEach(a => a.state = TileState.DISABLED);

    let moveOptions: Tile[] = this.tilesCities.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card);
    moveOptions.forEach(a => { a.state = TileState.WAIT_FOR_MOVE });

    this.pendingTileBuilding = tile;
    this.updateBoard();
  }

  moveBuildingDone() {
    this.gameState.tiles.forEach(a => a.state = TileState.REGULAR);
    this.pendingTileBuilding.clear();

    //this.updateBoard();
  }

  showCardMatchHint(card: Card) {
    this._cardHint$.next(card);
  }

}
