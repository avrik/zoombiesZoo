import { TerrainEnum } from '../../../enums/terrain.enum';
import { UrlConst } from 'app/consts/url-const';

export class Terrain {
    url: string;
    type: number;
    clickable: boolean = true;
    walkable: boolean = false;
    walkableForAnimal: boolean = false;
    locked: boolean = false;

    constructor(type: number = 0) {
        this.type = type;

        switch (type) {
            case TerrainEnum.BLOCKED:
                this.url = UrlConst.TERRAIN_BLOCKED;
                break;

            case TerrainEnum.EXPLOSION:
                this.url = UrlConst.TERRAIN_EXPLOSION;
                break;

            case TerrainEnum.CARD_HOLDER_OPEN:
                this.url = UrlConst.TERRAIN_CARD_HOLDER_OPEN;
                break;

            case TerrainEnum.CARD_HOLDER:
                this.url = UrlConst.TERRAIN_CARD_HOLDER;
                break;

            case TerrainEnum.BRIDGE:
                this.clickable = false;
                this.walkable = true;
                this.url = UrlConst.TERRAIN_BRIDGE;
                break;

            case TerrainEnum.ROAD:
                this.walkable = true;
                this.url = UrlConst.TERRAIN_ROAD;
                break;

            case TerrainEnum.WATER:
                this.clickable = false;
                this.url = UrlConst.TERRAIN_WATER;
                break;

            case TerrainEnum.CITY:
                this.url = UrlConst.TERRAIN_CITY;
                break;

            default:
                this.walkable = true;
                this.walkableForAnimal = true;
                this.url = UrlConst.TERRAIN_RESOURCE;
        }
    }
}
