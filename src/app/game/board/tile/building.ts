
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
export class Building {
    url: string;
    type: number;

    constructor(type: number) {
        this.type = type;
        switch (type) {
            /* case "ruins":
                this.url = "assets/buildings/ruins.png";
                break;
            case "selector":
                this.url = "assets/buildings/Selector.png";
                break; */
            case CardFamilyTypeEnum.ROAD:
                this.url = "assets/buildings/Stone Block.png";
                break;
            case CardFamilyTypeEnum.HOUSE:
                this.url = "assets/buildings/Door Tall Closed.png";
                break;
            case CardFamilyTypeEnum.TOWER:
                this.url = "assets/buildings/Wall Block Tall.png";
                break;
            case CardFamilyTypeEnum.STORAGE:
                this.url = "assets/buildings/storage.png";
                break;
        }
    }
}
