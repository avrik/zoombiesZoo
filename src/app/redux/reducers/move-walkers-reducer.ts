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
import { TileState } from '../../enums/tile-state.enum';
import { IState } from "../interfaces";

export function moveWalkers(newState: IState): IState {

    let actionTaken: boolean = false;

    let walkers: Tile[] = newState.tiles.filter(tile =>
        tile.card &&
        tile.card.type === CardTypeEnum.WALKER &&
        tile.card.state == CardState.REGULAR &&
        tile.terrain.type != TerrainEnum.CARD_HOLDER
    );
    if (!walkers.length) return;

    let people: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.PERSON);
    let animals: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ANIMAL);
    //let zoombies: Tile[] = walkers.filter(a => a.card.family.name == CardFamilyTypeEnum.ZOOMBIE);

    people.forEach(person => { if (movePersonToRandomEmpty(person) == true) { actionTaken = true } })
    animals.forEach(animal => { if (moveAnimalToRandomEmpty(animal) == true) { actionTaken = true } })
    //zoombies.forEach(zoombie => { if (moveZoombiesToRandomEmpty(zoombie) == true) actionTaken = true })

    if (actionTaken) {
        newState = moveWalkers(newState);
    } else {
        let walkers: Tile[] = newState.tiles.filter(tile => (tile.card && tile.card.mergeBy === MergeTypeEnum.TRAP && tile.terrain.type == TerrainEnum.RESOURCES));
        newState.tiles.filter(a => a.card && a.card.type == CardTypeEnum.WALKER).forEach(a => a.card.state = CardState.REGULAR);

        testGroupTrapped(newState, walkers);
    }

    return newState;
}


function testGroupTrapped(newState: IState, walkers: Tile[]): IState {

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
        walkersGroup.filter(walker => {
            if (walker.card.family.name == CardFamilyTypeEnum.ANIMAL) {
                if (walker.linked.filter(a => !a.card && a.terrain.walkableForAnimal && !a.terrain.locked).length > 0) {
                    foundEmpty = true;
                }
            } else {
                if (walker.linked.filter(a => !a.card && a.terrain.walkable && !a.terrain.locked).length > 0) {
                    foundEmpty = true;
                }
            }
        })

        if (!foundEmpty) {
            trapWalkersGroup(walkersGroup);
            let youngest = walkersGroup.sort((a, b) => {
                if (a.card.age > b.card.age) { return -1 }
                if (a.card.age < b.card.age) { return 1 }
                return 0;
            })[0];

            findMatch(newState, youngest);
        }

        testGroupTrapped(newState, walkers);
    }

    return newState;
}

function trapWalkersGroup(walkerGroup: Tile[]) {
    walkerGroup.forEach(walker => walker.card = getCardByFamily(CardFamilyTypeEnum.OIL));
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

        let empties: Tile[] = tile.linked.filter(a => !a.card && !a.terrain.locked && a.terrain.walkable);

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
    let empties: Tile[] = tile.linked.filter(a => !a.card && !a.terrain.locked && a.terrain.walkable && a.terrain.type != TerrainEnum.BRIDGE);

    return moveToRandomSpot(tile, empties);
}

function movePersonToRandomEmpty(tile: Tile): boolean {
    let housesAround: Tile[] = tile.linked.filter(a =>
        a.card && a.card.collected < a.card.collect && a.card.family.name == CardFamilyTypeEnum.HOUSE
        /* (
            (a.card.family.name == CardFamilyTypeEnum.HOUSE && tile.card.level == 0) ||
            (a.card.family.name == CardFamilyTypeEnum.CHURCH && tile.card.level == 1) ||
            (a.card.family.name == CardFamilyTypeEnum.PALACE && tile.card.level == 2)
        ) */
    )

    if (housesAround.length) {
        let rand: number = Math.floor(Math.random() * (housesAround.length));
        let moveToTile: Tile = housesAround.find((item, index) => index == rand);

        moveToTile.card.collected++;
        moveToTile.card.state = CardState.MOVING;

        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };

        clearTile(tile);
        return true;
    } else {
        let empties: Tile[] = tile.linked.filter(a => !a.card && !a.terrain.locked && a.terrain.walkable);
        return moveToRandomSpot(tile, empties);
    }
}

function moveToRandomSpot(tile: Tile, empties: Tile[]): boolean {
    if (empties.length) {
        let rand: number = Math.floor(Math.random() * (empties.length));
        let moveToTile: Tile = empties.find((item, index) => index == rand);

        moveToTile.card = tile.card;
        moveToTile.card.state = CardState.MOVING;
        moveToTile.card.showDelay = 130;
        tile.movment = { dir: getMoveDir(tile, moveToTile), img: tile.card.img };

        clearTile(tile);

        return true;
    } else {
        return false;
    }
}