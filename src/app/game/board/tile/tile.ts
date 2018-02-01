import { CardTypeEnum } from 'app/enums/card-type-enum.enum';
import { CardState } from './../../../enums/card-state.enum';
import { TileState } from './../../../enums/tile-state.enum';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Card } from '../../cards/card';
import { Terrain } from './terrain';
import { MergeTypeEnum } from 'app/enums/merge-type-enum.enum';


export interface ITileMove {
    dir: string;
    img: string;
}

export class Tile {

    linked: Tile[] = [];
    card: Card;
    //cardsHistroy: Card[] = [];
    terrain: Terrain;
    terrainTop: Terrain;
    movment: ITileMove;
    state: number = 0;
    showDelay: string;

    constructor(public col: number = -1, public row: number = -1) {
        //this.terrain = new Terrain();
        this.state = TileState.REGULAR;
    }

    set moveMe(value: string) {
        this.state = TileState.MOVING;
        this.card.state = CardState.MOVING;
    };

    //set select(value: boolean) { this._selected$.next(value) };

    /* getMatchesAround(): Tile[] {
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
    } */

    /* clear() {
        this.card = null;
        this.state = TileState.REGULAR;
    } */

    /* reset() {
        this.clear();
        this.terrainTop = null;
    } */

    /* setCard(card: Card) {
        this.card = card;
    } */

   /*  setNextTurn() {
        if (this.card) {
            this.card.age++;
            this.card.state = CardState.REGULAR;
        }
 
        this.cardsHistroy.push(Object.assign({}, this).card);
    } */

    /* undo() {
        if (this.cardsHistroy.length >= 2) {
            this.card = this.cardsHistroy[this.cardsHistroy.length - 2];
        }
    } */

    toString() {
        return JSON.stringify(this);
    }
}
