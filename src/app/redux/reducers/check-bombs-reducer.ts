import { Tile } from "../../game/board/tile/tile";
import { IState } from "../interfaces";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { Terrain } from "../../game/board/tile/terrain";
import { TerrainEnum } from "../../enums/terrain.enum";
import { clearTile } from "./tile-reducer";

export function checkBombs(newState: IState) {
    let bombs: Tile[] = newState.tiles.filter(a => a != newState.tileClicked && a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);
    //let bombs: Tile[] = tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.BOMB);
    bombs.forEach(bomb => {
        bomb.card.collected--

        if (bomb.card.collected <= 0) {
            let around: Tile[] = [...bomb.linked];//.filter(a => a.card);
            around.push(bomb);
            around.forEach(tileNear => {
                clearTile(tileNear);
                tileNear.terrainTop = new Terrain(TerrainEnum.EXPLOSION);
                newState.boardState = "shake";
                setTimeout(() => {
                    tileNear.terrainTop = null;
                }, 300);
            })
        } else {
            newState.boardState = "";
        }
    })
}