import { Tile } from './../game/board/tile/tile';
import { IState } from './main-reducer';
import { IResourceStorage } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { MessageType } from '../enums/message-type.enum';

export function addResources(state: IState, tile: Tile, amount: number): IResourceStorage {
    switch (tile.card.family.name) {
        case CardFamilyTypeEnum.COIN:
            state.resources.coins += amount;
            tile.clear();
            break;

        case CardFamilyTypeEnum.LUMBER:
            let sawmills: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL && (a.card.collected + amount) <= a.card.collect);
            if (sawmills.length) {
                sawmills[0].card.collected += amount;
                state.resources.lumber += amount;
                tile.clear();
            } else {
                let txt: string = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL).length ? "no place in sawmill" : "build a sawmill to store your lumber"
                //console.log(txt);
                state.currentMessage = { type: MessageType.TOOLBAR, title: txt };
            }
            break;

        case CardFamilyTypeEnum.BRICK:
            let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.STORAGE && (a.card.collected + amount) <= a.card.collect);
            if (storages.length) {
                storages[0].card.collected += amount;
                state.resources.bricks += amount;
                tile.clear();
            } else {
                //console.log("no place in storage");
                state.currentMessage = { type: MessageType.TOOLBAR, title: "no place in storage" };
            }
            /* state.resources.coins += amount;
            tile.clear(); */
            break;
        default:
            break;
    }

    return Object.assign({}, state.resources);
}

export function removeFromResourcesSawmill(state: IState, amount: number) {
    state.resources.lumber -= amount;
    let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.SAWMILL && a.card.collected)
    for (let i = 0; i < amount; i++) {
        if (storages && storages.length) {
            storages[0].card.collected--;
        }
    }
}

export function removeFromResourcesStorage(state: IState, amount: number) {
    state.resources.bricks -= amount;
    let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE && a.card.collected)
    for (let i = 0; i < amount; i++) {

        if (storages && storages.length) {
            storages[0].card.collected--;
        }
    }
}