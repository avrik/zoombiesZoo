import { CardState } from './../enums/card-state.enum';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Card, ICardData, cardCollection } from './../game/cards/card';
import { CardTypeEnum } from './../enums/card-type-enum.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { Tile } from './../game/board/tile/tile';
import { TileState } from '../enums/tile-state.enum';
import { addResources } from 'app/redux/resources-reducer';
import { checkIfLevelCompleted } from './level-reducer';
import { clearTile } from './tile-reducer';
import { IState } from './interfaces';
import { getNewCard } from './common-reducer';


export function generateWorld(totalRows: number, totalCols: number): Tile[] {

    let tiles: Tile[] = [];

    for (var i = 0; i < totalCols; i++) {
        for (var j = 0; j < totalRows; j++) {
            let newTile: Tile = new Tile(i, j);
            let terrainType: number = j >= Math.floor(totalRows / 2) ? TerrainEnum.RESOURCES : TerrainEnum.CITY;
            newTile.terrain = new Terrain(terrainType);
            tiles.push(newTile);
        }
    }

    let middle: number = Math.floor(totalRows / 2);
    tiles.find(a => a.ypos == 0 && a.xpos == middle).terrain = new Terrain(TerrainEnum.WATER);
    tiles.find(a => a.ypos == 1 && a.xpos == middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    tiles.find(a => a.ypos == 2 && a.xpos == middle).terrain = new Terrain(TerrainEnum.WATER);
    tiles.find(a => a.ypos == 3 && a.xpos == middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    tiles.find(a => a.ypos == 4 && a.xpos == middle).terrain = new Terrain(TerrainEnum.WATER);

    tiles.find(a => a.ypos == 0 && a.xpos == totalRows - 1).terrain = new Terrain(TerrainEnum.CARD_HOLDER);

    tiles.forEach(tile => {
        let tileLeft = tiles.find(a => a.ypos == tile.ypos - 1 && a.xpos == tile.xpos);
        if (tileLeft) tile.linked.push(tileLeft);
        let tileRight = tiles.find(a => a.ypos == tile.ypos + 1 && a.xpos == tile.xpos);
        if (tileRight) tile.linked.push(tileRight);
        let tileUp = tiles.find(a => a.ypos == tile.ypos && a.xpos == tile.xpos - 1);
        if (tileUp) tile.linked.push(tileUp);
        let tileDown = tiles.find(a => a.ypos == tile.ypos && a.xpos == tile.xpos + 1);
        if (tileDown) tile.linked.push(tileDown);
    });

    const options: number[] = [CardFamilyTypeEnum.BRICK, CardFamilyTypeEnum.LUMBER];

    let getRandomTile = (tilesFiltered: Tile[] = null): Tile => {
        let arr: Tile[] = tilesFiltered ? tilesFiltered : tiles;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    for (let i = 0; i < 5; i++) {
        let tile: Tile = getRandomTile(tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card));
        let rand: number = Math.floor(Math.random() * options.length);
        tile.card = getNewCard(options[rand]);
        tile.card.autoPlaced = true;
    }

    /* let arr: Tile[] = tiles.filter(a => a.terrain.type == TerrainEnum.CITY && a.xpos > 0 && a.xpos < (totalRows / 2 - 2) && a.linked.length > 3);
    let randTile: Tile = getRandomTile(arr.filter(a => !a.card));
    randTile.setCard(getNewCard(CardFamilyTypeEnum.STORAGE));
    randTile.card.autoPlaced = true; */

    tiles.find(a => a.ypos == 0 && a.xpos == 0).card = getNewCard(CardFamilyTypeEnum.STORAGE);



    //randTile = getRandomTile(arr.filter(a => !a.card));
    //randTile.setCard(getNewCard(CardFamilyTypeEnum.HOUSE));
    //randTile.card.autoPlaced = true;

    return tiles;
}

export function clickTileOnBoard(state: IState): IState {
    let newState: IState = state;

    if (newState.tileClicked.terrain.type == TerrainEnum.CARD_HOLDER) {
        if (newState.tileClicked.card) {
            let temp = Object.assign({}, newState.tileClicked.card);
            newState.tileClicked.card = getNewCard(newState.nextCard.family.name);
            newState.nextCard = temp;
        } else {
            newState.tileClicked.card = getNewCard(newState.nextCard.family.name);
        }
    } else {
        newState.tileClicked.card = newState.nextCard;

        if (newState.tileClicked.card.mergeBy == MergeTypeEnum.MATCH) {
            findMatch(newState.tileClicked);
        }

        /* newState.tiles = moveWalkers(newState.tiles);
        newState.tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER).forEach(a => a.card.state = CardState.REGULAR)
        newState.nextCard = getNextCard(); */
    }

    /* let found: Tile = newState.tileClicked.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES)
    newState.floatTile = found ? found : newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);

    let houses: Tile[] = newState.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE)
    if (houses.length) {
        newState.population = houses.map(a => a.card.collected).reduce((prev, cur) => prev + cur);
    }

    newState.score += newState.tileClicked.card ? newState.tileClicked.card.value : 0; */

    return newState;
}


export function nextTurn(newState: IState) {
    newState.turn++;
    moveWalkers(newState.tiles);
    let bombs: Tile[] = newState.tiles.filter(a => a != newState.tileClicked && a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);
    checkBombs(bombs);

    newState.tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER).forEach(a => a.card.state = CardState.REGULAR)
    //newState.nextCard = getNextCard();

    let found: Tile = newState.tileClicked.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES)
    newState.floatTile = found ? found : newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);

    let houses: Tile[] = newState.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE)
    if (houses.length) {
        newState.population = houses.map(a => a.card.collected).reduce((prev, cur) => prev + cur);
    }

    newState.score += newState.tileClicked.card ? newState.tileClicked.card.value : 0;

    checkIfLevelCompleted(newState);
    checkIfGameOver(newState)
}

function checkIfGameOver(newState: IState) {
    let emptyInCity: number = newState.tiles.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card).length;
    let emptyInResources: number = newState.tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card).length;

    if (!emptyInCity || !emptyInResources) newState.gameOver = true;
}



export function findMatch(tile: Tile) {
    if (!tile.card || !tile.card.family) return;

    if (tile.card.family.name == CardFamilyTypeEnum.WILD) {
        handleWild(tile);
    }

    //let matchedTiles: Tile[] = tile.getMatchesAround();
    let matchedTiles: Tile[] = getMatchesAround(tile);
    if (matchedTiles.length > 1) {

        if (tile.card.nextCard) {
            let totalCollected: number = tile.card.type == CardTypeEnum.RESOURCE ? Math.max(tile.card.collect, 1) : 0;

            matchedTiles.filter(a => a.card).forEach(linked => {
                if (!linked.card) return;
                if (tile.card.type == CardTypeEnum.BUILDING) {
                    if (linked.card.collected) totalCollected += linked.card.collected;
                } else {
                    if (linked.card && linked.card.nextCard && linked.card.nextCard.collect) {
                        totalCollected += Math.max(linked.card.collected, 1);
                    }
                }

                //move(linked, tile)
                linked.movment = { dir: getMoveDir(linked, tile), img: linked.card.img };
                tile.showDelay = "show";
                //linked.clear();
                clearTile(linked);
            });

            tile.card = new Card(tile.card.nextCard);

            if (tile.card.reward) {
                let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
                if (emptyTile) {
                    emptyTile.card = getNewCard(CardFamilyTypeEnum.COIN);
                    emptyTile.card.collected = tile.card.reward;
                }
            }

            tile.card.collected = totalCollected;

            /* let extra: number = matchedTiles.length - (tile.card.minForNextLevel - 1);
            if (extra) {
              const arr = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000];
              this.addToStorage(CardFamilyTypeEnum.COIN, (extra / 100) * (arr[(tile.card.level - 1)]));
            } */

            findMatch(tile);
        }
    }
}


function getMatchesAround(tile: Tile): Tile[] {
    let collector: Tile[] = [];

    if (tile.linked) {
        let func: Function = (arr: Tile[]) => {
            arr.filter(item =>
                tile != item &&
                tile.card && item.card &&
                ((tile.card.mergeBy == MergeTypeEnum.MATCH && item.card.mergeBy == MergeTypeEnum.MATCH) ||
                    (tile.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED && item.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED
                        && tile.card.collect == tile.card.collected && item.card.collect == item.card.collected)) &&
                collector.indexOf(item) == -1 &&
                (item.card.value === tile.card.value))
                .forEach(item => {
                    collector.push(item);
                    func(item.linked);
                });
        }

        func(tile.linked);
    }
    return collector;
}




function handleWild(tile: Tile) {

    let optionsForWild: Tile[] = tile.linked.filter(a => a.card && a.card.mergeBy == MergeTypeEnum.MATCH);
    optionsForWild = optionsForWild.filter(a => {
        tile.card = a.card;
        return getLinkedGroup(a).length >= a.card.minForNextLevel;
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
    tile.card = optionsForWild.length ? optionsForWild[0].card : getNewCard(CardFamilyTypeEnum.GRAVE);
}

function getMoveDir(from: Tile, to: Tile): string {
    if (to.ypos < from.ypos && to.xpos < from.xpos) { return "upLeft" }
    if (to.ypos < from.ypos && to.xpos > from.xpos) { return "upRight" }
    if (to.ypos > from.ypos && to.xpos < from.xpos) { return "downLeft" }
    if (to.ypos > from.ypos && to.xpos > from.xpos) { return "downRight" }

    if (to.ypos < from.ypos && to.xpos == from.xpos) { return "up" }
    if (to.ypos > from.ypos && to.xpos == from.xpos) { return "down" }
    if (to.xpos < from.xpos && to.ypos == from.ypos) { return "left" }
    if (to.xpos > from.xpos && to.ypos == from.ypos) { return "right" }
}

function getLinkedGroup(firstOne: Tile): Tile[] {
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

function checkBombs(tiles: Tile[]) {
    let bombs: Tile[] = tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);
    bombs.forEach(bomb => {
        bomb.card.collected--

        if (bomb.card.collected <= 0) {
            let around: Tile[] = [...bomb.linked];//.filter(a => a.card);
            around.push(bomb);
            around.forEach(tileNear => {
                clearTile(tileNear);
                tileNear.terrainTop = new Terrain(TerrainEnum.EXPLOSION);
                setTimeout(() => {
                    tileNear.terrainTop = null;
                }, 300);
            })
        }
    })
}

export function moveWalkers(tiles: Tile[]): Tile[] {
    let newTiles = tiles;
    let actionTaken: boolean = false;
    let walkers: Tile[] = newTiles.filter(tile =>
        tile.card &&
        tile.card.type === CardTypeEnum.WALKER &&
        tile.card.state == CardState.REGULAR &&
        tile.terrain.type != TerrainEnum.CARD_HOLDER
    );
    if (!walkers.length) return newTiles;
    let people: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.PERSON);
    let animals: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ANIMAL);
    let zoombies: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ZOOMBIE);

    people.forEach(person => { if (movePersonToRandomEmpty(person) == true) actionTaken = true })
    animals.forEach(animal => { if (moveAnimalToRandomEmpty(animal) == true) actionTaken = true })
    zoombies.forEach(zoombie => { if (moveZoombiesToRandomEmpty(zoombie) == true) actionTaken = true })

    if (actionTaken) {
        newTiles = moveWalkers(newTiles);
    } else {
        let walkers: Tile[] = newTiles.filter(tile => (tile.card && tile.card.mergeBy === MergeTypeEnum.TRAP && tile.terrain.type == TerrainEnum.RESOURCES));
        tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER).forEach(a => a.card.state = CardState.REGULAR);
        testGroupTrapped(walkers);
    }

    return newTiles;
}


function testGroupTrapped(walkers: Tile[]) {
    if (walkers.length) {
        let walkersGroup: Tile[] = [];
        let firstOne: Tile = walkers.pop();
        let isZoombieGroup: boolean;
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
            if (walkers.linked.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES).length > 0) {
                foundEmpty = true;
            }
        })

        if (!foundEmpty) {
            trapWalkersGroup(walkersGroup);
            findMatch(walkersGroup[0]);
        }

        testGroupTrapped(walkers);
    }
}

function trapWalkersGroup(walkerGroup: Tile[]) {
    walkerGroup.forEach(walker => walker.card = getNewCard(CardFamilyTypeEnum.GRAVE));
}

function moveZoombiesToRandomEmpty(tile: Tile): boolean {
    let churchsAround: Tile[] = tile.linked.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.CHURCH && a.card.collected < a.card.collect)
    if (churchsAround.length) {
        let rand: number = Math.floor(Math.random() * (churchsAround.length));
        let moveToTile: Tile = churchsAround.find((item, index) => index == rand);
        moveToTile.card.collected++;
        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };
        clearTile(tile);
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

        return moveToRandomSpot(tile, empties);
    }
}
function moveAnimalToRandomEmpty(tile: Tile): boolean {
    let empties: Tile[] = tile.linked.filter(a => !a.card && a.terrain.walkable && a.terrain.type == TerrainEnum.RESOURCES);

    return moveToRandomSpot(tile, empties);
}

function movePersonToRandomEmpty(tile: Tile): boolean {
    let housesAround: Tile[] = tile.linked.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.HOUSE && a.card.collected < a.card.collect)

    if (housesAround.length) {
        let rand: number = Math.floor(Math.random() * (housesAround.length));
        let moveToTile: Tile = housesAround.find((item, index) => index == rand);

        moveToTile.card.collected++;
        moveToTile.card.state = CardState.MOVING;

        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };
        clearTile(tile);
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

        return moveToRandomSpot(tile, empties);
    }
}

function moveToRandomSpot(tile: Tile, empties: Tile[]): boolean {
    if (empties.length) {
        let rand: number = Math.floor(Math.random() * (empties.length));
        let moveToTile: Tile = empties.find((item, index) => index == rand);

        moveToTile.card = tile.card;
        moveToTile.card.state = CardState.MOVING;
        moveToTile.card.preTile = tile;
        moveToTile.showDelay = "show";
        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };
        clearTile(tile);

        return true;
    } else {
        return false;
    }
}