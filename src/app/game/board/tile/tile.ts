import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Card } from '../../cards/card';
import { Terrain } from './terrain';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';

export class Tile {

    linked: Tile[] = [];
    card: Card;
    overMe: boolean;
    terrain: Terrain;
    terrainTop: Terrain;
    state: number = 0;
    private _selected$: BehaviorSubject<boolean>;

    constructor(public col: number = -1, public row: number = -1) {
        this.terrain = new Terrain();
        this._selected$ = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    }


    get selected$(): Observable<boolean> { return this._selected$.asObservable(); }
    set select(value: boolean) { this._selected$.next(value) };
    getAllEmpties(): Tile[] {
        return this.linked.filter(a => !a.card);
    }

    getCardsAround(): Tile[] {
        return this.linked.filter(a => a.card);
    }

    getMatchesAround(): Tile[] {
        let collector: Tile[] = [];

        if (this.linked) {
            let func: Function = (arr: Tile[]) => {
                arr.filter(item =>
                    this != item &&
                    this.card && item.card &&
                    ((this.card.mergeBy == MergeTypeEnum.MATCH && item.card.mergeBy == MergeTypeEnum.MATCH) ||
                        (this.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED && item.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED
                            && this.card.collect == this.card.collected && item.card.collect == item.card.collected)) &&
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

    reset() {
        this.clear();
        this.terrainTop = null;
        this.overMe = false;
    }
}
