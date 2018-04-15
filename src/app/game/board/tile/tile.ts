import { Card } from "../../cards/card";
import { Terrain } from "./terrain";
import { ITileMove } from "../../interfaces/ITileMove";
import { TileState } from "../../../enums/tile-state.enum";

export class Tile {

    disabled: boolean;
    linked: Tile[] = [];
    card: Card;
    terrain: Terrain;
    terrainTop: Terrain;
    movment: ITileMove;
    state: number = 0;
    showDelay: string;
    ypos: number = -1;
    xpos: number = -1;

    constructor(data: any = null) {
        this.state = TileState.REGULAR;
        this.linked = [];

        if (data) {
            this.xpos = data.xpos;
            this.ypos = data.ypos;
            this.card = data.card;
            this.terrain = data.terrain;
            this.terrainTop = data.terrainTop;
            this.movment = data.movment;
            this.state = data.state;
            this.showDelay = data.showDelay;
        }
    }

    get oddTile(): boolean {
        return this.xpos % 2 == 1 ? true : false;
    }

    get id(): string {
        return this.xpos.toString() + this.ypos.toString()
    }

    toString() {

        let newObj: any = {};
        newObj.card = this.card ? Object.assign({}, this.card) : null;
        newObj.terrain = this.terrain ? Object.assign({}, this.terrain) : null;
        newObj.terrainTop = this.terrainTop ? Object.assign({}, this.terrainTop) : null;
        newObj.movment = this.movment ? Object.assign({}, this.movment) : null;
        newObj.state = this.state;
        newObj.showDelay = this.showDelay;
        newObj.ypos = this.ypos;
        newObj.xpos = this.xpos;

        return newObj;
    }
}
