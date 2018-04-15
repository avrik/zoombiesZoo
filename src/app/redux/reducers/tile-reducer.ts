import { Tile } from "app/game/board/tile/tile";
import { TileState } from '../../enums/tile-state.enum';
import { IState } from "../interfaces";
import { TerrainEnum } from "../../enums/terrain.enum";

export function clearTile(tile: Tile) {
    tile.card = null;
    tile.state == TileState.REGULAR;
}

export function getFloatTile(newState: IState): Tile {
    let found: Tile;
    if (newState.tileClicked && newState.tileClicked.linked) {
        found = newState.tileClicked.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
    }

    return found ? found : newState.tiles.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
}

export function getRandomEmptyTile(tiles: Tile[]): Tile {
    let rand: Tile;

    let options: Tile[] = tiles.filter(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
    rand = options[Math.floor(Math.random() * (options.length-1))];
    return rand;
}