import { IBuyItem, IState } from './interfaces';
import { CardFamilyTypeEnum } from 'app/enums/card-family-type-enum.enum';
import { UrlConst } from 'app/consts/url-const';
import { ICardData, cardCollection, Card } from 'app/game/cards/card';
import { StoreItemType } from '../enums/store-item-type.enum';


export const tileStoreItems: IBuyItem[] = [
    { store: StoreItemType.TILE_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "roads will direct the people in the right path" },
    { store: StoreItemType.TILE_STORE, label: 'storage', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.STORAGE1, type: CardFamilyTypeEnum.STORAGE, description: "our resources need storage" },
    { store: StoreItemType.TILE_STORE, label: 'swamill', cost: { block: 9, lumber: 0, coin: 0 }, icon: UrlConst.SAWMILL1, type: CardFamilyTypeEnum.SAWMILL, description: "use sawmills to store lumber" },
    { store: StoreItemType.TILE_STORE, label: 'house', cost: { block: 9, lumber: 6, coin: 0 }, icon: UrlConst.HOUSE1, type: CardFamilyTypeEnum.HOUSE, description: "our people need houses" },
    { store: StoreItemType.TILE_STORE, label: 'laboratory', cost: { block: 12, lumber: 6, coin: 3 }, icon: UrlConst.LABORATORY, type: CardFamilyTypeEnum.LABORATORY, description: "produce TNT!" },
    { store: StoreItemType.TILE_STORE, label: 'church', cost: { block: 15, lumber: 9, coin: 3 }, icon: UrlConst.CHURCH1, type: CardFamilyTypeEnum.CHURCH, description: "cathedrals are used to trap the undead" },
]

export const tileBuildingItems: IBuyItem[] = [
    { store: StoreItemType.TILE_CARD_STORE, label: 'move', cost: { block: 0, lumber: 0, coin: 3 }, icon: UrlConst.MOVE, type: 10, description: "move me" },
    { store: StoreItemType.TILE_CARD_STORE, label: 'road', cost: { block: 3, lumber: 0, coin: 0 }, icon: UrlConst.ROAD, type: CardFamilyTypeEnum.ROAD, description: "add road" },
]

export const mainStoreItems: IBuyItem[] = [
    { store: StoreItemType.MAIN_STORE, label: "tree", cost: { coin: 1 }, icon: UrlConst.LUMBER1, type: CardFamilyTypeEnum.LUMBER, amount: 6, description: "plant tree" },
    { store: StoreItemType.MAIN_STORE, label: "brick", cost: { coin: 3 }, icon: UrlConst.BRICK2, type: CardFamilyTypeEnum.BRICK, level: 1, amount: 3, description: "buy brick" },
    { store: StoreItemType.MAIN_STORE, label: "lumber", cost: { coin: 3 }, icon: UrlConst.LUMBER2, type: CardFamilyTypeEnum.LUMBER, level: 1, amount: 3, description: "buy lumber" },
    { store: StoreItemType.MAIN_STORE, label: "wild", cost: { coin: 4 }, icon: UrlConst.WILD, type: CardFamilyTypeEnum.WILD, amount: 3, description: "buy wild-card" },
    { store: StoreItemType.MAIN_STORE, label: "bomb", cost: { coin: 4 }, icon: UrlConst.BOMB, type: CardFamilyTypeEnum.BOMB, amount: 3, description: "buy TNT" },
    { store: StoreItemType.MAIN_STORE, label: "undo", cost: { coin: 0 }, icon: UrlConst.UNDO, type: 99, amount: 9, description: "undo last action" },
]


export function getNewCard(familyName: number, level: number = 0): Card {
    let curCardData: ICardData = cardCollection.find(a => a.family.name == familyName);
    if (level) {
        for (let i = 0; i < level; i++) {
            if (curCardData.nextCard) curCardData = curCardData.nextCard;
        }
    }

    let card: Card = new Card(curCardData)

    return card;
}