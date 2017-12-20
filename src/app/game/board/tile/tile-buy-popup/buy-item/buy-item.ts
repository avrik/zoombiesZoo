export interface ICost {
    lumber?: number;
    block?: number;
    coin?: number;
    wheat?: number;
  }

  export interface IBuyItem {
    cost:ICost;
    icon:string;
    type:string;
}

export class BuyItem {
    woodCost:number;
    coinCost:number;
    stoneCost:number;

    constructor() {
        
    }
}
