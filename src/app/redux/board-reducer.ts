import { CardState } from './../enums/card-state.enum';
import { MergeTypeEnum } from './../enums/merge-type-enum.enum';
import { Card, ICardData, cardCollection } from './../game/cards/card';
import { CardTypeEnum } from './../enums/card-type-enum.enum';
import { CardFamilyTypeEnum } from './../enums/card-family-type-enum.enum';
import { TerrainEnum } from './../enums/terrain.enum';
import { Terrain } from './../game/board/tile/terrain';
import { Tile } from './../game/board/tile/tile';


export function generateWorld(totalRows: number, totalCols: number): Tile[] {

    let tiles: Tile[] = [];

    for (var i = 0; i < totalCols; i++) {
        for (var j = 0; j < totalRows; j++) {

            let newTile: Tile = new Tile(i, j);

            if (j >= Math.floor(totalRows / 2)) {
                newTile.terrain = new Terrain();
            } else {
                newTile.terrain = new Terrain(TerrainEnum.CITY);
            }

            tiles.push(newTile);
        }
    }

    let middle: number = Math.floor(totalRows / 2);
    tiles.find(a => a.col == 0 && a.row == middle).terrain = new Terrain(TerrainEnum.WATER);
    tiles.find(a => a.col == 1 && a.row == middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    tiles.find(a => a.col == 2 && a.row == middle).terrain = new Terrain(TerrainEnum.WATER);
    tiles.find(a => a.col == 3 && a.row == middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    tiles.find(a => a.col == 4 && a.row == middle).terrain = new Terrain(TerrainEnum.WATER);

    tiles.find(a => a.col == 0 && a.row == totalRows - 1).terrain = new Terrain(TerrainEnum.CARD_HOLDER);

    tiles.forEach(tile => {
        let tileLeft = tiles.find(a => a.col == tile.col - 1 && a.row == tile.row);
        if (tileLeft) tile.linked.push(tileLeft);
        let tileRight = tiles.find(a => a.col == tile.col + 1 && a.row == tile.row);
        if (tileRight) tile.linked.push(tileRight);
        let tileUp = tiles.find(a => a.col == tile.col && a.row == tile.row - 1);
        if (tileUp) tile.linked.push(tileUp);
        let tileDown = tiles.find(a => a.col == tile.col && a.row == tile.row + 1);
        if (tileDown) tile.linked.push(tileDown);
    });





    const options: number[] = [CardFamilyTypeEnum.BRICK, CardFamilyTypeEnum.LUMBER];

    let getRandomTile = (tilesFiltered: Tile[] = null): Tile => {
        let arr: Tile[] = tilesFiltered ? tilesFiltered : this.gameState.tiles;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    for (let i = 0; i < 5; i++) {
        let tile: Tile = getRandomTile(tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card));
        let rand: number = Math.floor(Math.random() * options.length);
        tile.setCard(getNewCard(options[rand]))
        tile.card.autoPlaced = true;
    }

    let arr: Tile[] = tiles.filter(a => a.terrain.type == TerrainEnum.CITY && a.row > 0 && a.row < (totalRows / 2 - 2) && a.linked.length > 3);
    let randTile: Tile = getRandomTile(arr.filter(a => !a.card));
    randTile.setCard(getNewCard(CardFamilyTypeEnum.STORAGE));
    randTile.card.autoPlaced = true;

    randTile = getRandomTile(arr.filter(a => !a.card));
    randTile.setCard(getNewCard(CardFamilyTypeEnum.HOUSE));
    randTile.card.autoPlaced = true;

    return tiles;
}




export function findMatch(tile: Tile) {
    if (!tile.card || !tile.card.family) return;

    if (tile.card.family.name == CardFamilyTypeEnum.WILD) {
        handleWild(tile);
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

                moveAndClear(linked, tile)
            });

            tile.setCard(new Card(tile.card.nextCard));

            if (tile.card.reward) {
                let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
                if (emptyTile) {
                    emptyTile.setCard(getNewCard(CardFamilyTypeEnum.COIN));
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
    tile.setCard(optionsForWild.length ? optionsForWild[0].card : getNewCard(CardFamilyTypeEnum.GRAVE));
}


export function getNewCard(familyName: number, level: number = 0): Card {

    let curCardData: ICardData = cardCollection.find(a => a.family.name == familyName);
    if (level) {
        for (let i = 0; i < level; i++) {
            if (curCardData.nextCard) curCardData = curCardData.nextCard;
        }
    }

    let card: Card = new Card(curCardData)

    return card;
}


function moveAndClear(from: Tile, to: Tile) {

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


export function moveWalkers(tiles: Tile[]): Tile[] {
    let newTiles = [...tiles];
    let walkers: Tile[] = tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER);

    walkers.forEach(tile => {
        let empties: Tile[] = tile.linked.filter(a => a.terrain.walkable && !a.card);
        if (empties.length) {

            let rand: number = Math.floor(Math.random() * (empties.length));
            let moveToTile: Tile = empties.find((item, index) => index == rand);
            moveToTile.card = tile.card;
            tile.clear();
        }
    })
    return newTiles;
}