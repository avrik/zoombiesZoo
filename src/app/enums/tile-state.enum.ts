export enum TileState {
    REGULAR = 0,
    WAIT_FOR_MOVE = 1,
    DISABLED = -1,
    MOVING = 2,
    MOVED = 3,
    DONE = 4,

    MOVE_UP = 10,
    MOVE_DOWN = 11,
    MOVE_LEFT = 12,
    MOVE_RIGHT = 13,
    MOVE_UP_LEFT = 14,
    MOVE_UP_RIGHT = 15,
    MOVE_DOWN_LEFT = 16,
    MOVE_DOWN_RIGHT = 17,
}
