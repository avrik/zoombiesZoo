

const WILD_CARD = "wild-card"
const MATCH = "match"
const TRAP = "trap"

export interface ICardData {
    name: string,
    type: string,
    minForNextLevel: number,
    value: number,
    symbol: string,
    color: string,
    nextCard?: ICardData,
    chance?: number,
    age?: number,
    bonus?: number
}


const cardCollection: ICardData[] = [
    {
        name: "stone", type: MATCH, minForNextLevel: 3, value: 10, symbol: "rock", color: "#9DCAB5", chance: 100,
        nextCard: {
            /* name: "stones", type: MATCH, minForNextLevel: 3, value: 11, symbol: "Rs", color: "#A3D1BB",
            nextCard: { */
            name: "block", type: MATCH, minForNextLevel: 3, value: 12, symbol: "block", color: "#AFE0C9",
            /* nextCard: {
              name: "wall", type: MATCH, minForNextLevel: 3, value: 13, symbol: "W", color: "#BAEFD7"
            } */
            //}
        }
    },
    {
        name: "tree", type: MATCH, minForNextLevel: 3, value: 20, symbol: "tree", color: "#FC9F5B", chance: 50,
        /* nextCard: {
          name: "trees", type: MATCH, minForNextLevel: 3, value: 21, symbol: "Ts", color: "#E58F52", */
        nextCard: {
            name: "lumber", type: MATCH, minForNextLevel: 3, value: 22, symbol: "lumber", color: "#CE814A",
            /* nextCard: {
              name: "house", type: MATCH, minForNextLevel: 3, value: 23, symbol: "H", color: "#B57141"
            } */
        }
        //}
    },
    {
        name: "gold", type: MATCH, minForNextLevel: 3, value: 30, symbol: "gold", color: "gold", chance: 50,
        nextCard: {
            /* name: "golds", type: MATCH, minForNextLevel: 3, value: 31, symbol: "Gs", color: "gold",
            nextCard: { */
            name: "coin", type: MATCH, minForNextLevel: 3, value: 32, symbol: "coin", color: "gold",
            /* nextCard: {
              name: "coins", type: MATCH, minForNextLevel: 3, value: 33, symbol: "8$", color: "gold"
            } */
        }
        //}
    },
    { name: "soldier", type: TRAP, minForNextLevel: 3, value: 100, symbol: "SS", color: "#1AA1B6", chance: 0 },
    {
        name: "grave", type: MATCH, minForNextLevel: 3, value: 50, symbol: "RIP", color: "gray",
        /* nextCard: {
            name: "zoombie", type: TRAP, minForNextLevel: 3, value: 200, symbol: "ZZ", color: "black"
        } */
    },
    { name: "zoombie", type: TRAP, minForNextLevel: 3, value: 200, symbol: "ZZ", color: "black", chance: 50 },
    { name: "wild", type: WILD_CARD, minForNextLevel: 3, value: -1, symbol: "*", color: "yellow", chance: 0 }
]

export interface IPosition {
    xpos: number;
    ypos: number;
}

export class Card {
    positions: IPosition[] = [];
    currentPosition: IPosition;
    name: string;
    type: string;
    minForNextLevel: number;
    value: number;
    symbol: string;
    color: string;
    nextCard?: ICardData;
    chance?: number;
    age: number;
    bonus: number;

    constructor(data: ICardData, xpos: number, ypos: number) {
        if (!data) return;
        //this.currentPosition = { xpos: xpos, ypos: xpos };
        //this.positions = [this.currentPosition];
        this.moveTo({ xpos: xpos, ypos: xpos });
        this.name = data.name;
        this.value = data.value;
        this.type = data.type;
        this.age = 0;
        this.bonus = 0;
        this.minForNextLevel = data.minForNextLevel;
        this.symbol = data.symbol;
        this.color = data.color;
        this.nextCard = data.nextCard;
        this.chance = data.chance;
    }

    moveTo(position: IPosition) {
        this.positions.push(position)
        this.currentPosition = position;
    }
}
