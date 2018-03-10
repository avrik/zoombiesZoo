import { Card } from "../../cards/card";
import { Terrain } from "./terrain";
import { ITileMove } from "../../interfaces/ITileMove";
import { TileState } from "../../../enums/tile-state.enum";

export class Tile {

    linked: Tile[] = [];
    card: Card;
    terrain: Terrain;
    terrainTop: Terrain;
    movment: ITileMove;
    state: number = 0;
    showDelay: string;

    constructor(public ypos: number = -1, public xpos: number = -1) {
        this.state = TileState.REGULAR;
    }

    get id(): string {
        return this.xpos.toString() + this.ypos.toString()
    }

    toString() {

        let newObj: any = {};
        newObj.linked = [];
        newObj.card = this.card;
        newObj.terrain = this.terrain;
        newObj.terrainTop = this.terrainTop;
        newObj.movment = this.movment;
        newObj.state = this.state;
        newObj.showDelay = this.showDelay;
        newObj.ypos = this.ypos;
        newObj.xpos = this.xpos;

        return newObj;
    }
}
