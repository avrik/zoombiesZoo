import { IState, IAction } from "app/redux/interfaces";

export function mainReducerFunc(state: IState, action: IAction): IState {
    let newState: IState = Object.assign({}, state);
    return newState;
}