import { TerrainEnum } from "../../enums/terrain.enum";
import { Tile } from "../../game/board/tile/tile";
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { MergeTypeEnum } from "../../enums/merge-type-enum.enum";
import { CardState } from "../../enums/card-state.enum";
import { CardTypeEnum } from "../../enums/card-type-enum.enum";
import { findMatch } from "./find-match-reducer";
import { getCardByFamily } from "./getCardByFamily-reducer";
import { getMoveDir } from "./common-reducer";
import { clearTile } from "./tile-reducer";


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
    walkerGroup.forEach(walker => walker.card = getCardByFamily(CardFamilyTypeEnum.GRAVE));
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
        // let foundRoad: Tile = empties.find(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD && a != tile.card.preTile);
        let foundRoads: Tile[] = empties.filter(a => a.terrainTop && a.terrainTop.type == TerrainEnum.ROAD);
        if (foundRoads && foundRoads.length) {
            empties = foundRoads;
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
        //moveToTile.card.preTile = tile;
        moveToTile.showDelay = "show";
        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };
        clearTile(tile);

        return true;
    } else {
        return false;
    }
}