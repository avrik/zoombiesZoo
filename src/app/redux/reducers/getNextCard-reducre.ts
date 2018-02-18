import { Tile } from "../../game/board/tile/tile";
import { IState } from "../interfaces";
import { Card, cardCollection, ICardData } from "../../game/cards/card";
import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";

export function getNextCard(newState: IState): Card {
    let gotLab: Tile = newState.tiles.find(a => a.card && a.card.family.name == CardFamilyTypeEnum.LABORATORY);
    if (gotLab) {
        let bombData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.BOMB);
        bombData.chance = 5;
    }

    if (newState.level.index > 1) {
        let personCardData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.PERSON);
        personCardData.chance = Math.min(20 + (newState.cityLevel.index * 2), 50);
    }

    if (newState.level.index > 2) {
        let animalCardData: ICardData = cardCollection.find(a => a.family.name == CardFamilyTypeEnum.ANIMAL);
        animalCardData.chance = Math.min(10 + (newState.cityLevel.index * 2), 20);
    }

    let rand: number = Math.round(Math.random() * 100);
    let pickFrom: ICardData[] = [];
    cardCollection.filter(item => item.chance).forEach(a => {
        pickFrom.push(a);
        if (a.nextCard && a.nextCard.chance) {
            pickFrom.push(a.nextCard);
        }
    })

    pickFrom = pickFrom.filter(item => item.chance >= rand)
    let randCard: ICardData = pickFrom[Math.floor(Math.random() * pickFrom.length)];

    return new Card(randCard);
}