import { Tile } from './../game/board/tile/tile';
import { IState } from './main-reducer';
import { IResourceStorage } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';

export function addResources(state: IState, type: number, amount: number): IResourceStorage {
    if (type == CardFamilyTypeEnum.COIN) {
        state.resources.coins += amount;
    } else {
        let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE && (a.card.collected + amount) <= a.card.collect);

        if (storages.length) {
            storages[0].card.collected += amount

            switch (type) {
                case CardFamilyTypeEnum.LUMBER:
                    state.resources.lumber += amount;
                    break;
                case CardFamilyTypeEnum.BRICK:
                    state.resources.bricks += amount;
                    break;
                case CardFamilyTypeEnum.COIN:
                    state.resources.coins += amount;
                    break;
            }
        } else {
            console.log("no place in storage");
        }
    }

    return state.resources;
}