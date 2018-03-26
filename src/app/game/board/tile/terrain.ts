import { TerrainEnum } from '../../../enums/terrain.enum';
import { UrlConst } from 'app/consts/url-const';

export class Terrain {
    url: string;
    type: number;
    clickable: boolean = true;
    walkable: boolean = true;
    locked: boolean = false;

    /* set locked(value: boolean) {
        this._locked = value;
        this.walkable = !value;
    }

    get locked() {
        return this._locked;

    } */

    constructor(type: number = 0) {
        this.type = type;
        switch (type) {
            case TerrainEnum.BLOCKED:
                this.walkable = false;
                this.url = UrlConst.TERRAIN_BLOCKED;
                break;
            case TerrainEnum.EXPLOSION:
                this.url = UrlConst.TERRAIN_EXPLOSION;
                break;
            case TerrainEnum.CARD_HOLDER_OPEN:
                this.walkable = false;
                this.url = UrlConst.TERRAIN_CARD_HOLDER_OPEN;
                break;
            case TerrainEnum.CARD_HOLDER:
                this.walkable = false;
                this.url = UrlConst.TERRAIN_CARD_HOLDER;
                break;
            case TerrainEnum.BRIDGE:
                this.clickable = false;
                this.url = UrlConst.TERRAIN_BRIDGE;
                break;
            case TerrainEnum.ROAD:
                //this.clickable = false;
                this.url = UrlConst.TERRAIN_ROAD;
                break;
            case TerrainEnum.WATER:
                this.clickable = false;
                this.walkable = false;
                this.url = UrlConst.TERRAIN_WATER;
                break;
            case TerrainEnum.CITY:
                this.walkable = false;
                this.url = UrlConst.TERRAIN_CITY;
                break;
            default:
                this.url = UrlConst.TERRAIN_RESOURCE;
        }
    }
}
