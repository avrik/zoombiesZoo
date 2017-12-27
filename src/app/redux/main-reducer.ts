export class MainReducer {
    
}

export function mainReducerFunc(state = 0, action) {
    switch (action.type) {
        case 'NEW_CARD':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}
