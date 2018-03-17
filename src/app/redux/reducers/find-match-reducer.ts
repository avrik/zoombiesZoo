import { CardFamilyTypeEnum } from "../../enums/card-family-type-enum.enum";
import { Tile } from "../../game/board/tile/tile";
import { CardTypeEnum } from "../../enums/card-type-enum.enum";
import { clearTile } from "./tile-reducer";
import { Card } from "../../game/cards/card";
import { getCardByFamily } from "./../reducers/getCardByFamily-reducer";
import { TerrainEnum } from "../../enums/terrain.enum";
import { MergeTypeEnum } from "../../enums/merge-type-enum.enum";
import { getMoveDir, getLinkedGroup } from "./common-reducer";

export function findMatch(tile: Tile) {
    if (!tile.card || !tile.card.family) return;

    if (tile.card.family.name == CardFamilyTypeEnum.WILD) {
        handleWild(tile);
    }

    //let matchedTiles: Tile[] = tile.getMatchesAround();
    let matchedTiles: Tile[] = getMatchesAround(tile);
    if (matchedTiles.length > 1) {

        if (tile.card.nextCard) {
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

            tile.card = new Card(tile.card.nextCard);

            if (tile.card.reward) {
                let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
                if (emptyTile) {
                    emptyTile.card = getCardByFamily(CardFamilyTypeEnum.COIN);
                    emptyTile.card.collected = tile.card.reward;
                }
            }

            tile.card.collected = totalCollected;

            let extra: number = matchedTiles.length - (tile.card.minForNextLevel - 1);
            if (extra) {
                let random: number = Math.floor(Math.random() * 100);
                console.log(random)
                if (extra >= random) {
                    //const arr = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000];
                    //this.addToStorage(CardFamilyTypeEnum.COIN, (extra / 100) * (arr[(tile.card.level - 1)]));
                    let emptyTile: Tile = tile.linked.find(a => !a.card && a.terrain.type == TerrainEnum.RESOURCES);
                    if (emptyTile) {
                        emptyTile.card = getCardByFamily(CardFamilyTypeEnum.COIN_SILVER);
                        // emptyTile.card.collected = extra;
                        emptyTile.card.collected = 1;
                    }
                }
            }

            findMatch(tile);
        }
    }
}



function getMatchesAround(tile: Tile): Tile[] {
    let collector: Tile[] = [];

    if (tile.linked) {
        let func: Function = (arr: Tile[]) => {
            arr.filter(item =>
                tile != item &&
                tile.card && item.card &&
                ((tile.card.mergeBy == MergeTypeEnum.MATCH && item.card.mergeBy == MergeTypeEnum.MATCH) ||
                    (tile.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED && item.card.mergeBy == MergeTypeEnum.MATCH_COLLECTED
                        && tile.card.collect == tile.card.collected && item.card.collect == item.card.collected)) &&
                collector.indexOf(item) == -1 &&
                (item.card.value === tile.card.value))
                .forEach(item => {
                    collector.push(item);
                    func(item.linked);
                });
        }

        func(tile.linked);
    }
    return collector;
}

function handleWild(tile: Tile) {

    let optionsForWild: Tile[] = tile.linked.filter(a => a.card && a.card.mergeBy == MergeTypeEnum.MATCH);
    optionsForWild = optionsForWild.filter(a => {
        tile.card = a.card;
        return getLinkedGroup(a).length >= a.card.minForNextLevel;
    })
    optionsForWild.sort((a, b) => {
        if (a.card.family != b.card.family) {
            if (a.card.value > b.card.value) return -1;
            if (b.card.value > a.card.value) return 1;
        }
        else if (a.card.family == b.card.family) {
            if (a.card.level == (b.card.level - 1)) return -1;
            if (b.card.level == (a.card.level - 1)) return 1;

            if (a.card.level > b.card.level) return -1;
            if (b.card.level > a.card.level) return 1;
        }

        return 0;
    });

    // tile.card = optionsForWild.length ? optionsForWild[0].card : this.getNewCard(CardFamilyTypeEnum.GRAVE);
    tile.card = optionsForWild.length ? optionsForWild[0].card : getCardByFamily(CardFamilyTypeEnum.GRAVE);
}