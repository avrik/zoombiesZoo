import { Card } from '../../cards/card';
import { Terrain } from './terrain';
import { Building } from './building';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';

export class Tile {

    linked: Tile[] = [];
    card: Card;
    overMe:boolean;
    terrain:Terrain
    building:Building;

    constructor(public col: number = -1, public row: number = -1) 
    { 
        this.terrain = new Terrain();
    }

    getAllEmpties(): Tile[] {
        return this.linked.filter(a => !a.card);
    }

    getCardsAround(): Tile[] {
        /* let aroundMe: Tile[] = [];
        let recurse: Function = (arr: Tile[]) => {

            arr.forEach(item => {
                aroundMe.push(item);
                let newArr: Tile[] = item.linked.filter(a => { return aroundMe.indexOf(a) == -1 && a.card })
                recurse(newArr);
            })
        }
        let arr: Tile[] = this.linked.filter(a => a.card && a.card.value);
        recurse(arr);

        return aroundMe; */
        return this.linked.filter(a => a.card);
    }

    getMatchesAround(): Tile[] {
        let collector: Tile[] = [];

        if (this.linked) {
            let func: Function = (arr: Tile[]) => {
                arr.filter(item =>
                    this != item &&
                    this.card &&
                    item.card &&
                    this.card.mergeBy == MergeTypeEnum.MATCH &&
                    item.card.mergeBy == MergeTypeEnum.MATCH &&
                    collector.indexOf(item) == -1 &&
                    (item.card.value === this.card.value))
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
    }
}
