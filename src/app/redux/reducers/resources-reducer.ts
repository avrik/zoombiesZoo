import { IState } from "../interfaces";
import { Tile } from "../../game/board/tile/tile";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { MessageType } from "../../enums/message-type.enum";


export function addResources(state: IState, tile: Tile): number {
    let leftover: number = tile.card.collected;
    
    switch (tile.card.family.name) {
        case CardFamilyTypeEnum.OIL:
            state.energy += tile.card.collected;
            return 0;

        case CardFamilyTypeEnum.COIN_SILVER:
            state.resources.silver += leftover;
            state.resources.coins += leftover / 100;
            return 0;
        case CardFamilyTypeEnum.COIN:
            state.resources.coins += leftover;
            return 0;

        case CardFamilyTypeEnum.LUMBER:
            let sawmills: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL);

            for (let i = 0; i < sawmills.length; i++) {
                const sawmill = sawmills[i];

                let add: number = Math.min(leftover, sawmill.card.collect - sawmill.card.collected);
                sawmill.card.collected += add;
                leftover -= add;
                state.resources.lumber += add;
                if (leftover == 0) return 0;
            }

            if (leftover) {
                let txt: string = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL).length ? "no place in sawmill" : "build a sawmill to store your lumber"
                state.currentMessage = { type: MessageType.TOOLBAR, title: txt };
            }
            return leftover;

        case CardFamilyTypeEnum.BRICK:
            let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.STORAGE);
            for (let i = 0; i < storages.length; i++) {
                const storage = storages[i];

                let add: number = Math.min(leftover, storage.card.collect - storage.card.collected);
                storage.card.collected += add;
                leftover -= add;
                state.resources.bricks += add;
                if (leftover == 0) return 0;
            }

            if (leftover) {
                state.currentMessage = { type: MessageType.TOOLBAR, title: "no place in storage" };
            }
            return leftover;
    }

    return 0;
}

export function removeFromResourcesSawmill(state: IState, amount: number) {
    state.resources.lumber -= amount;
    let sawmills: Tile[] = state.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.SAWMILL)

    for (let i = 0; i < sawmills.length; i++) {
        const sawmill = sawmills[i];

        let remove: number = Math.min(amount, sawmill.card.collected);
        sawmill.card.collected -= remove;
        amount -= remove;
    }
}

export function removeFromResourcesStorage(state: IState, amount: number) {
    state.resources.bricks -= amount;
    let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family && a.card.family.name == CardFamilyTypeEnum.STORAGE);

    for (let i = 0; i < storages.length; i++) {
        const storage = storages[i];

        let remove: number = Math.min(amount, storage.card.collected);
        storage.card.collected -= remove;
        amount -= remove;
    }
}