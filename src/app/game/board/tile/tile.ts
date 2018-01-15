import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { CardState } from './../../../enums/card-state.enum';
import { TileState } from './../../../enums/tile-state.enum';
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
    private _move$: BehaviorSubject<string>;

    constructor(public col: number = -1, public row: number = -1) {
        this.terrain = new Terrain();
        this._selected$ = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this._move$ = <BehaviorSubject<string>>new BehaviorSubject("");
        this.state = TileState.REGULAR;
    }


    get selected$(): Observable<boolean> { return this._selected$.asObservable(); }
    get move$(): Observable<string> { return this._move$.asObservable(); }

    set moveMe(value: string) {
        this.state = TileState.MOVING;
        this.card.state = CardState.MOVING;
        this._move$.next(value)
    };

    set select(value: boolean) { this._selected$.next(value) };

    isCardTrapped(): boolean {
        if (!this.card || this.card.type != CardTypeEnum.WALKER) return false;

        return this.linked.filter(a => !a.card || (a.card && a.card.type == CardTypeEnum.WALKER)).length ? false : true;
        //return this.getAllEmpties().length?false:true;
    }

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
        this.state = TileState.REGULAR;
    }

    reset() {
        this.clear();
        this.terrainTop = null;
        this.overMe = false;
    }
}
