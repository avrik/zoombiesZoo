import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { ITutorialLevel, IState } from '../interfaces';
import { Tile } from '../../game/board/tile/tile';
import { getCardByFamily } from './getCardByFamily-reducer';


export const tutorialLevels: ITutorialLevel[] = [
    {
        index: 0,
        title: "Match 3",
        text: "Welcome sir,\b let us show you how to build your kingdom \b place your first stone",
        activeTiles: [62, 72, 82, 73],
        cards: [
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
        ]
    },
    {
        index: 1,
        title: "Collect",
        text: "Great job,\b we need some more brick",
        activeTiles: [62, 72, 82, 73, 63, 73, 82],
        cards: [
            { family: CardFamilyTypeEnum.LUMBER, level: 0 },
            { family: CardFamilyTypeEnum.LUMBER, level: 0 },
            { family: CardFamilyTypeEnum.LUMBER, level: 1 },
        ]
    },
    {
        index: 2,
        title: "Build",
        text: "Great job,\b we need some more brick",
        activeTiles: [62, 72, 82, 73],
        cards: [
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 1 },
        ]
    },
    {
        index: 3,
        title: "Populate",
        text: "Great job,\b we need some more brick",
        activeTiles: [62, 72, 82, 73],
        cards: [
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 1 },
        ]
    },
    {
        index: 4,
        title: "Recharge",
        text: "Great job,\b we need some more brick",
        activeTiles: [62, 72, 82, 73],
        cards: [
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 0 },
            { family: CardFamilyTypeEnum.BRICK, level: 1 },
        ]
    }
]


export function setNextTutorialLevel(newState: IState) {

    if (newState.tutorialComplete) return;

    if (newState.tutorialLevel) {
        if (newState.tutorialLevel.index >= tutorialLevels.length) {
            newState.tutorialComplete = true;
            newState.tutorialLevel = null;
            // return null;
        }

        //newState.tutorialLevel = tutorialLevels[newState.tutorialLevel.index + 1];
    }

    newState.tutorialLevel = tutorialLevels[0];





    if (!newState.tutorialActive && !newState.tutorialComplete) {
        newState.tutorialActive = true;

        if (newState.tiles) {
            newState.tiles.filter(a => a).forEach(a => { a.card = null; a.disabled = true });
        }
    }

    if (newState.tutorialActive) {
        if (newState.tiles) {
            newState.tiles.filter(a => a).forEach(a => { a.disabled = true });
            // newState.tiles.forEach(a=>a)
            newState.tutorialLevel.activeTiles.forEach(a => {
                let tile: Tile = newState.tiles.find(b => b.id == a.toString());
                if (tile) {
                    tile.disabled = false;
                }
            })

            if (newState.tutorialLevel.cards.length) {
                let card = newState.tutorialLevel.cards.pop();
                newState.nextCard = getCardByFamily(card.family, card.level);
            }

            if (!newState.tutorialLevel.cards.length) {
                newState.tutorialLevel = tutorialLevels[newState.tutorialLevel.index + 1];
            }
            //debugger;
        }

    }
}