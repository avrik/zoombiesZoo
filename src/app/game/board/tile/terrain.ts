import { TerrainEnum } from '../../../enums/terrain.enum';
export class Terrain {
    url: string = "assets/terrain/Grass Block.png";
    type: number;
    clickable: boolean = true;
    walkable: boolean = true;

    constructor(type: number = 0) {
        this.type = type;
        switch (type) {
            case TerrainEnum.CARD_HOLDER:
                this.walkable = false;
                this.url = "assets/terrain/Plain Block.png";
                break;
            case TerrainEnum.BRIDGE:
                this.clickable = false;
                this.url = "assets/terrain/Wood Block.png";
                break;
            case TerrainEnum.WALL:
                this.clickable = false;
                this.walkable = false;
                this.url = "assets/terrain/Stone Block Tall.png";
                break;
            case TerrainEnum.ROAD:
                this.clickable = false;
                this.url = "assets/terrain/Stone Block.png";
                break;
            case TerrainEnum.WATER:
                this.clickable = false;
                this.walkable = false;
                this.url = "assets/terrain/Water Block.png";
                break;
            case TerrainEnum.CITY:
                this.url = "assets/terrain/Dirt Block.png";
                break;
            default:
                this.url = "assets/terrain/Grass Block.png";
        }
    }
}
