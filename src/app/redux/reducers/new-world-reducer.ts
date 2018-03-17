import { Tile } from "../../game/board/tile/tile";
import { Terrain } from "../../game/board/tile/terrain";
import { TerrainEnum } from '../../enums/terrain.enum';
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { getCardByFamily } from "./../reducers/getCardByFamily-reducer";

export function generateWorld(totalRows: number, totalCols: number): Tile[] {

    let tiles: Tile[] = [];

    for (var i = 0; i < totalRows; i++) {
        for (var j = 0; j < totalCols; j++) {
            let newTile: Tile = new Tile();
            newTile.xpos = j;
            newTile.ypos = i;
            let terrainType: number = j >= Math.floor(totalCols / 2) ? TerrainEnum.RESOURCES : TerrainEnum.CITY;
            newTile.terrain = new Terrain(terrainType);
            tiles.push(newTile);
        }
    }

    mapLinkedTiles(tiles);

    let middle: number = Math.floor(totalCols / 2);
    let middleRow: number = Math.floor(totalRows / 2);

    //place blocked
    tiles.filter(a => a.ypos == 0 || a.xpos == 0 || a.xpos == totalCols - 1 || a.ypos == totalRows - 1).forEach(b => b.terrain = new Terrain(TerrainEnum.BLOCKED));
    //place water
    tiles.filter(a => a.xpos == middle).forEach(b => b.terrain = new Terrain(TerrainEnum.WATER));

    //place bridges
    tiles.find(a => a.ypos == middleRow - 2 && a.xpos == middle).terrain = new Terrain(TerrainEnum.BRIDGE);
    tiles.find(a => a.ypos == middleRow + 1 && a.xpos == middle).terrain = new Terrain(TerrainEnum.BRIDGE);

    //place card holder
    tiles.find(a => a.ypos == 0 && a.xpos == totalCols - 1).terrain = new Terrain(TerrainEnum.CARD_HOLDER);
    //tiles.find(a => a.ypos == 0 && a.xpos == totalCols - 1).terrain = new Terrain(TerrainEnum.CARD_HOLDER);


    return tiles;
}


export function populateWorldWithResources(tiles: Tile[]) {

    const options: number[] = [CardFamilyTypeEnum.BRICK, CardFamilyTypeEnum.LUMBER];

    let getRandomTile = (tilesFiltered: Tile[] = null): Tile => {
        let arr: Tile[] = tilesFiltered ? tilesFiltered : tiles;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    for (let i = 0; i < 5; i++) {
        let tile: Tile = getRandomTile(tiles.filter(a => a.terrain.type == TerrainEnum.RESOURCES && !a.card));
        let rand: number = Math.floor(Math.random() * options.length);
        tile.card = getCardByFamily(options[rand]);
        tile.card.autoPlaced = true;
    }

    tiles.find(a => a.terrain.type == TerrainEnum.CITY).card = getCardByFamily(CardFamilyTypeEnum.STORAGE);
}

export function mapLinkedTiles(tiles: Tile[]) {

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
}