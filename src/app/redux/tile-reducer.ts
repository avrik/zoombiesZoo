import { Tile } from "app/game/board/tile/tile";
import { TileState } from '../enums/tile-state.enum';

export function clearTile(tile: Tile) {
    tile.card = null;
    tile.state == TileState.REGULAR;
}