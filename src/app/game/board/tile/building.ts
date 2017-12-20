export class Building {
    url: string;
    type: string;
    //clickable: boolean = true;

    constructor(type: string) {
        this.type = type;
        switch (type) {
            case "ruins":
                this.url = "assets/buildings/ruins.png";
                break;
            case "selector":
                this.url = "assets/buildings/Selector.png";
                break;
            case "wall":
                this.url = "assets/buildings/Stone Block.png";
                break;
            case "house":
                this.url = "assets/buildings/Door Tall Closed.png";
                break;
            case "tower":
                this.url = "assets/buildings/Wall Block Tall.png";
                break;
        }
    }
}
