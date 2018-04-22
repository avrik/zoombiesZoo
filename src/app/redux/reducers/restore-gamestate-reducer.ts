import { Tile } from '../../game/board/tile/tile';
import { mapLinkedTiles } from './new-world-reducer';
import { IState } from '../interfaces';

export function restoreGameState(takeState: IState = null): IState {
    let lastState: string = localStorage.getItem('lastState');

    if (!lastState) return null;

    let parsedState: IState = JSON.parse(lastState);

    console.info("!!!!! parsedState = "+parsedState);

    if (parsedState && parsedState.tiles && parsedState.tiles.length) {
        parsedState.tiles = parsedState.tiles.map(a => new Tile(a));
        mapLinkedTiles(parsedState.tiles);
        if (parsedState.lastActionDate) {
            let lastSavedDate: Date = new Date(parsedState.lastActionDate);
            let now: Date = new Date();
            let minutesFromLastDate: number = Math.floor((now.getTime() - lastSavedDate.getTime()) / 1000 / 60);

            console.log("minutes from last session = " + minutesFromLastDate);
            parsedState.energy += minutesFromLastDate;
            if (parsedState.energy > parsedState.maxEnergy) {
                parsedState.energy = parsedState.maxEnergy
            }
        }

        return parsedState;
    } else {
        console.log("NO state saved!!")
    }

    return null;
}
