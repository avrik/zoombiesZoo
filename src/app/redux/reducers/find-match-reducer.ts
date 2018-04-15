import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { Tile } from "../../game/board/tile/tile";
import { CardTypeEnum } from "../../enums/card-type-enum.enum";
import { clearTile, getRandomEmptyTile } from './tile-reducer';
import { Card } from "../../game/cards/card";
import { getCardByFamily } from "./../reducers/getCardByFamily-reducer";
import { TerrainEnum } from "../../enums/terrain.enum";
import { MergeTypeEnum } from "../../enums/merge-type-enum.enum";
import { getMoveDir, getLinkedGroup } from "./common-reducer";
import { IState } from 'app/redux/interfaces';

export function findMatch(newState: IState, tile: Tile) {
    if (!tile.card || !tile.card.family) return;

    /* if (tile.card.family.name == CardFamilyTypeEnum.WILD) {
        handleWild(tile);
    } */

    //let matchedTiles: Tile[] = getMatchesAround(tile);
    let matchedTiles: Tile[] = getMatchesAround(tile, tile.linked);
    //if (matchedTiles.length > (tile.card.minForNextLevel - 1)) {
    if (matchedTiles.length && tile.card.nextCard) {

        //if (tile.card.nextCard) {
        let totalCollected: number = tile.card.type == CardTypeEnum.RESOURCE ? Math.max(tile.card.collect, 1) : 0;

        matchedTiles.filter(a => a.card).forEach(linked => {
            if (!linked.card) return;
            if (tile.card.type == CardTypeEnum.BUILDING) {
                if (linked.card.collected) totalCollected += linked.card.collected;
            } else {
                if (linked.card && linked.card.nextCard && linked.card.nextCard.collect) {
                    totalCollected += Math.max(linked.card.collected, 1);
                }
            }

            //move(linked, tile)
            linked.movment = { dir: getMoveDir(linked, tile), img: linked.card.img };
            tile.showDelay = "merge";
            //linked.clear();
            clearTile(linked);
        });

        let imgIndex = -1;

        if (tile.card.level == 0) {
            imgIndex = matchedTiles.length >= 6 ? 1 : 0;
            if (matchedTiles.length >= 6) totalCollected = 2;
        } else {
            imgIndex = totalCollected - tile.card.minForNextLevel;

        }

        tile.card = new Card(tile.card.nextCard, imgIndex);

        if (tile.card.reward) {
            let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
            if (emptyTile) {
                emptyTile.card = getCardByFamily(CardFamilyTypeEnum.COIN);
                emptyTile.card.collected = tile.card.reward;
            }
        }

        tile.card.collected = totalCollected;

        console.info("- merge to = ", totalCollected);

        let extra: number = matchedTiles.length - (tile.card.minForNextLevel - 1);
        if (extra) {
            let random: number = Math.floor(Math.random() * 100);
            //console.log(random)
            if (extra >= random) {
                //const arr = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000];
                //this.addToStorage(CardFamilyTypeEnum.COIN, (extra / 100) * (arr[(tile.card.level - 1)]));
                //let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
                let aroundOptions: Tile[] = tile.linked.filter(a => !a.card)
                let emptyTile: Tile = getRandomEmptyTile(aroundOptions.length ? aroundOptions : newState.tiles);
                if (emptyTile) {
                    emptyTile.card = getCardByFamily(CardFamilyTypeEnum.COIN_SILVER);
                    emptyTile.card.collected = Math.max(10 * ((tile.card.level - 1)), 1);
                }
            }
        }

        findMatch(newState, tile);
        // }
    }
}

export function getMatchesAround(tile: Tile, checkWithTiles: Tile[], card: Card = null): Tile[] {

    let collector: Tile[] = [];
    if (card && card.family.name == CardFamilyTypeEnum.WILD) {
        card = getCardFromWild(tile);
    } else {
        card = tile.card || card;
    }

    let arounds: Tile[] = [...checkWithTiles];

    if (card && arounds) {

        let addItemsToCollection: Function = (arr: Tile[]) => {
            arr.filter(item =>
                tile != item &&
                tile.terrain.mergable &&
                card && item.card &&
                card.mergeBy == MergeTypeEnum.MATCH &&
                item.terrain.mergable &&
                item.card.mergeBy == MergeTypeEnum.MATCH &&
                !collector.includes(item) &&
                item.card.family.name == card.family.name &&
                item.card.level == card.level)
                .forEach(item2 => {
                    collector.push(item2);
                    addItemsToCollection(item2.linked);
                });
        }

        addItemsToCollection(arounds);

        if (collector.length >= (card.minForNextLevel - 1)) {
            if (card.nextCard) {
                let newLinked: Tile[] = [...checkWithTiles];
                collector.forEach(a => { newLinked.splice(newLinked.indexOf(a), 1) })

                let arr = getMatchesAround(tile, newLinked, new Card(card.nextCard));
                 if (arr && arr.length) collector = collector.concat(arr);
            }

            return collector;
        }
    }
    return [];
}

export function getCardFromWild(tile: Tile): Card {
    let card: Card;
    let optionsForWild: Tile[] = tile.linked.filter(a => a.card && a.card.mergeBy == MergeTypeEnum.MATCH);

    optionsForWild = optionsForWild.filter(a => {
        tile.card = a.card;
        return getLinkedGroup(a).length >= (a.card.minForNextLevel);
    })
    tile.card = null;
    if (optionsForWild.length) {
        optionsForWild.sort((a, b) => {
            if (a.card.family == b.card.family) {
                if (a.card.level > b.card.level) return 1;
                if (a.card.level < b.card.level) return -1;
            } else {
                if (a.card.value > b.card.value) return -1;
                if (a.card.value < b.card.value) return 1;
            }

            return 0;
        });

        // tile.card = optionsForWild[0].card
        card = optionsForWild[0].card
    } else {
        card = getCardByFamily(CardFamilyTypeEnum.GRAVE);
    }

   // console.log("WILD TO CARD ", card);

    return card;
}