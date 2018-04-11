import { IState, IBuyItem } from 'app/redux/interfaces';
import { TerrainEnum } from '../../enums/terrain.enum';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { StoreItemType } from '../../enums/store-item-type.enum';
import { UrlConst } from '../../consts/url-const';

export const tileStoreItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "connect people to houses" },
    { store: StoreItemType.TILE_STORE, label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { store: StoreItemType.TILE_STORE, label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { store: StoreItemType.TILE_STORE, label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "people need houses" },
    { store: StoreItemType.TILE_STORE, label: 'church', cost: { block: 18, lumber: 9, coin: 1 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "holy place for holy people" },
    { store: StoreItemType.TILE_STORE, label: 'palace', cost: { block: 27, lumber: 18, coin: 3 }, icon: UrlConst.PALACE, type: CardFamilyTypeEnum.PALACE, description: "the place for a royal blood" },
]

export const tileBuildingItems: IBuyItem[] = [
    { store: StoreItemType.TILE_CARD_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
    { store: StoreItemType.TILE_CARD_STORE, label: 'move', cost: { block: 0, lumber: 0, coin: 3 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
]

export const mainStoreItems: IBuyItem[] = [
    { store: StoreItemType.MAIN_STORE, label: "tree", cost: { coin: 1 }, icon: UrlConst.LUMBER1, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "plant tree" },
    { store: StoreItemType.MAIN_STORE, label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, level: 1, amount: 3, description: "buy brick" },
    { store: StoreItemType.MAIN_STORE, label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, level: 1, amount: 3, description: "buy lumber" },
    { store: StoreItemType.MAIN_STORE, label: "wild", cost: { coin: 4 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { store: StoreItemType.MAIN_STORE, label: "bomb", cost: { coin: 4 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { store: StoreItemType.MAIN_STORE, label: "undo", cost: { coin: 1 }, icon: UrlConst.UNDO, type: 99, amount: 9, description: "undo last action" },
]

export const tileResourceBlockedItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'develop', cost: { block: 0, lumber: 0, coin: 9 }, icon: UrlConst.TERRAIN_RESOURCE, type: 101, description: "discover new territory" }
]

export const tileCityBlockedItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'develop', cost: { block: 0, lumber: 0, coin: 12 }, icon: UrlConst.TERRAIN_CITY, type: 101, description: "discover new territory" }
]

export function openBlockedItemStore(newState: IState): IState {
    let isResourceTile = newState.tileClicked.linked.find(a => a.terrain.type == TerrainEnum.RESOURCES) ? true : false;
    newState.showStoreItems = isResourceTile ? tileResourceBlockedItems : tileCityBlockedItems;

    return newState;
}

export function openStore(newState: IState): IState {

    if (newState.tileClicked) {
        if (newState.tileClicked.card) {
            newState.showStoreItems = tileBuildingItems;
        } else {
            if (newState.tileClicked.terrain.type == TerrainEnum.ROAD) {
                newState.showStoreItems = tileStoreItems.filter(a => a.type != CardFamilyTypeEnum.ROAD);
            } else {
                newState.showStoreItems = tileStoreItems;
            }
        }

    } else {
        newState.showStoreItems = mainStoreItems;
    }
    return newState;
}