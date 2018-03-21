import { Tile } from "../../game/board/tile/tile";

export function getMoveDir(from: Tile, to: Tile): string {
    /* if (to.ypos < from.ypos && to.xpos < from.xpos) { return "upLeft" }
    if (to.ypos < from.ypos && to.xpos == from.xpos) { return "up" }
    if (to.ypos < from.ypos && to.xpos > from.xpos) { return "upRight" }

    if (to.xpos > from.xpos && to.ypos == from.ypos) { return "right" }

    if (to.ypos > from.ypos && to.xpos > from.xpos) { return "downRight" }
    if (to.ypos > from.ypos && to.xpos == from.xpos) { return "down" }
    if (to.ypos > from.ypos && to.xpos < from.xpos) { return "downLeft" }

    if (to.xpos < from.xpos && to.ypos == from.ypos) { return "left" } */


    if (to.ypos < from.ypos && to.xpos < from.xpos) { return "upLeft" }
    if (to.ypos < from.ypos && to.xpos == from.xpos) { return "up" }
    if (to.ypos < from.ypos && to.xpos > from.xpos) { return "upRight" }

    if (to.xpos > from.xpos && to.ypos == from.ypos) { return "downRight" }

   // if (to.ypos > from.ypos && to.xpos > from.xpos) { return "downRight" }
    if (to.ypos > from.ypos && to.xpos == from.xpos) { return "down" }
   // if (to.ypos > from.ypos && to.xpos < from.xpos) { return "downLeft" }

    if (to.xpos < from.xpos && to.ypos == from.ypos) { return "downLeft" }
}

export function getLinkedGroup(firstOne: Tile): Tile[] {
    let group: Tile[] = [];
    group.push(firstOne);

    let addToQue: Function = (tile: Tile) => {
        tile.linked.forEach(linked => {
            if (linked.card && linked.card.value == firstOne.card.value && group.indexOf(linked) == -1) {
                group.push(linked);
                addToQue(linked)
            }
        })
    }

    addToQue(firstOne);

    return group;
}