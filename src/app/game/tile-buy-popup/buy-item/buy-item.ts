export interface ICost {
    lumber?: number;
    block?: number;
    coin?: number;
    wheat?: number;
}

export interface IBuyItem {
    label?:string;
    description?:string,
    cost: ICost;
    icon: string;
    type: number;
    amount? :number;
}

export class BuyItem {
    woodCost: number;
    coinCost: number;
    stoneCost: number;

    constructor() {

    }
}
