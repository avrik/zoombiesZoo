import { ICard } from '../../../services/game-engine.service';
export class Tile {

    linked: Tile[] = [];
    bonus: number = 0;
    card: ICard;
    //age: number = 0;
    constructor(public col: number = -1, public row: number = -1) { }

    getAllEmpties(): Tile[] {
        return this.linked.filter(a => !a.card);
    }

    getCardsAround(): Tile[] {
        let aroundMe: Tile[] = [];
        let recurse: Function = (arr: Tile[]) => {
            
            arr.forEach(item => {
                aroundMe.push(item);
                let newArr: Tile[] = item.linked.filter(a => { return aroundMe.indexOf(a) == -1 && a.card && a.card.value })
                recurse(newArr);
            })
        }
        let arr: Tile[] = this.linked.filter(a => a.card && a.card.value);
        recurse(arr);

        return aroundMe;
    }

    getMatchesAround(): Tile[] {
        let collector: Tile[] = [];

        if (this.linked) {
            let func: Function = (arr: Tile[]) => {
                arr.filter(item =>
                    this != item &&
                    this.card &&
                    item.card &&
                    this.card.type == "match" &&
                    item.card.type == "match" &&
                    collector.indexOf(item) == -1 &&
                    (item.card.name === this.card.name))
                    .forEach(item => {
                        collector.push(item);
                        func(item.linked);
                    });
            }

            func(this.linked);
        }
        return collector;
    }

    clear() {
        this.card = null;
        this.bonus = 0;
    }
}
