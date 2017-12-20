export class Terrain {
    url: string = "assets/terrain/Grass Block.png";
    type: string;
    clickable: boolean = true;

    constructor(type: string = "resource") {
        this.type = type;
        switch (type) {
            case "bridge":
            this.clickable = false;
                this.url = "assets/terrain/Wood Block.png";
                break;
            case "wall":
                this.url = "assets/terrain/Stone Block.png";
                break;
            case "plain":
                this.url = "assets/terrain/Plain Block.png";
                break;
            case "water":
                this.clickable = false;
                this.url = "assets/terrain/Water Block.png";
                break;
            case "city":
                this.url = "assets/terrain/Dirt Block.png";
                break;
            default:
                this.url = "assets/terrain/Grass Block.png";
        }
    }
}
