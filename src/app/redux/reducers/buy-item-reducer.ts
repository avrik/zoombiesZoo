import { IState, IBuyItem } from 'app/redux/interfaces';
import { StoreItemType } from '../../enums/store-item-type.enum';
import { getCardByFamily } from './getCardByFamily-reducer';
import { CardFamilyTypeEnum } from '../../enums/card-family-type-enum.enum';
import { TerrainEnum } from '../../enums/terrain.enum';
import { MessageType } from '../../enums/message-type.enum';
import { Terrain } from '../../game/board/tile/terrain';
import { findMatch } from './find-match-reducer';
import { removeFromResourcesStorage, removeFromResourcesSawmill } from './resources-reducer';
import { Tile } from '../../game/board/tile/tile';
import { TileState } from '../../enums/tile-state.enum';
import { clearTile } from './tile-reducer';
import { nextTurn } from './next-turn-reducer';

export function buyItem(newState: IState, buyItem: IBuyItem): IState {
    //let buyItem: IBuyItem = action.payload;
    let purchased: boolean

    switch (buyItem.store) {
        case StoreItemType.MAIN_STORE:
            newState.nextCard = getCardByFamily(buyItem.type, buyItem.level)
            purchased = true;
            break;
        case StoreItemType.TILE_STORE:
            if (buyBuilding(newState, buyItem)) {
                purchased = true;
                nextTurn(newState);
            }
            break;
        case StoreItemType.TILE_CARD_STORE:
            if (buyItem.type == 10) {
                moveTileBuilding(newState, newState.tileClicked);
                purchased = true;
            } else {
                if (buyBuilding(newState, buyItem)) {
                    purchased = true;
                    nextTurn(newState);
                }
            }
            break;
        default:
            break;
    }

    if (purchased) {
        newState.resources.coins -= buyItem.cost.coin;
        if (buyItem.cost.block) {
            removeFromResourcesStorage(newState, buyItem.cost.block);
        }

        if (buyItem.cost.lumber) {
            removeFromResourcesSawmill(newState, buyItem.cost.lumber);
        }
    }

    return newState;
}


function buyBuilding(newState: IState, buyItem: IBuyItem): boolean {

    if (buyItem.type == CardFamilyTypeEnum.ROAD) {
        let roadNear = newState.tileClicked.linked.find(a => a.terrain.type == TerrainEnum.ROAD || a.terrain.type == TerrainEnum.BRIDGE)
        if (!roadNear) {
            newState.currentMessage = { title: "connect road to bridge", type: MessageType.TOOLBAR }
            return false;
        }

        newState.tileClicked.terrain = new Terrain(TerrainEnum.ROAD);
    }
    else {
        newState.tileClicked.card = getCardByFamily(buyItem.type);
        newState.energy -= newState.tileClicked.card.energyCost;
        findMatch(newState,newState.tileClicked);
    }

    return true;
}

function moveTileBuilding(newState: IState, tile: Tile) {
    newState.tiles.forEach(a => a.state = TileState.DISABLED);

    let moveOptions: Tile[] = newState.tiles.filter(a => a.terrain.type == TerrainEnum.CITY && !a.card);
    moveOptions.forEach(a => { a.state = TileState.WAIT_FOR_MOVE });
    newState.pendingMoveCard = Object.assign({}, tile.card);
    clearTile(tile);
}