import { IState } from "../interfaces";
import { Tile } from "../../game/board/tile/tile";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { MessageType } from "../../enums/message-type.enum";


export function addResources(state: IState, tile: Tile): number {
    let amount: number = tile.card.collected;
    switch (tile.card.family.name) {
        case CardFamilyTypeEnum.COIN_SILVER:
            state.resources.silver += amount;

            return 0;
        case CardFamilyTypeEnum.COIN:
            state.resources.coins += amount;
            return 0;

        case CardFamilyTypeEnum.LUMBER:
            let sawmills: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL);

            for (let i = 0; i < sawmills.length; i++) {
                const sawmill = sawmills[i];

                let add: number = Math.min(amount, sawmill.card.collect - sawmill.card.collected);
                sawmill.card.collected += add;
                amount -= add;
                state.resources.lumber += add;
                if (amount == 0) return 0;
            }

            if (amount) {
                let txt: string = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.SAWMILL).length ? "no place in sawmill" : "build a sawmill to store your lumber"
                state.currentMessage = { type: MessageType.TOOLBAR, title: txt };
            }
            return amount;

        case CardFamilyTypeEnum.BRICK:
            let storages: Tile[] = state.tiles.filter(a => a.card && a.card.family.name == CardFamilyTypeEnum.STORAGE);
            for (let i = 0; i < storages.length; i++) {
                const storage = storages[i];

                let add: number = Math.min(amount, storage.card.collect - storage.card.collected);
                storage.card.collected += add;
                amount -= add;
                state.resources.bricks += add;
                if (amount == 0) return 0;
            }

            if (amount) {
                state.currentMessage = { type: MessageType.TOOLBAR, title: "no place in storage" };
            }
            return amount;
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