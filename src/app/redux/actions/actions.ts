import { Tile } from "app/game/board/tile/tile";

export const INIT_GAME_ACTION: string = "INIT_GAME_ACTION";
export const NEW_GAME_ACTION: string = "NEW_GAME_ACTION";

export const GENERATE_WORLD_ACTION: string = "GENERATE_WORLD_ACTION";
export const PLACE_CARD_ON_TILE_ACTION: string = "PLACE_CARD_ON_TILE_ACTION";

export const COLLECT_RESOURCES_ACTION: string = "COLLECT_RESOURCES_ACTION";
export const REMOVE_RESOURCES_ACTION: string = "REMOVE_RESOURCES_ACTION";

export const SET_NEXT_CARD: string = "SET_NEXT_CARD";
export const UNDO_ACTION: string = "UNDO_ACTION";
export const MOVE_BUILDING_ACTION: string = "MOVE_BUILDING_ACTION";
export const PLACE_MOVE_BUILDING_ACTION: string = "PLACE_MOVE_BUILDING_ACTION";
export const GAME_OVER: string = "GAME_OVER";
export const CLICK_TILE: string = "CLICK_TILE";
export const OPEN_STORE: string = "OPEN_STORE";
export const CLOSE_STORE: string = "CLOSE_STORE";
export const PLACE_BUILDING: string = "PLACE_BUILDING";
export const PLACE_CARD_ON_STASH_ACTION: string = "PLACE_CARD_ON_STASH_ACTION";
export const BUY_ITEM: string = "BUY_ITEM";


/* export function initGameAction() {
    return { type: INIT_GAME_ACTION }
}

export function newGameAction() {
    return { type: NEW_GAME_ACTION }
}

export function placeCardOnBoardAction(tile: Tile) {
    return { type: CLICK_TILE, payload: tile }
} */




