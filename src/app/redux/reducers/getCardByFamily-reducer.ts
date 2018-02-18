import { Card, ICardData, cardCollection } from "../../game/cards/card";

export function getCardByFamily(familyName: number, level: number = 0): Card {
    let curCardData: ICardData = cardCollection.find(a => a.family.name == familyName);
    if (level) {
        for (let i = 0; i < level; i++) {
            if (curCardData.nextCard) curCardData = curCardData.nextCard;
        }
    }

    let card: Card = new Card(curCardData)

    return card;
}