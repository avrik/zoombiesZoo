import { IMessage } from "../../services/messages.service";
import { Action } from "../actions/action.enum";
import { MessageType } from "../../enums/message-type.enum";

export const message_no_energy: IMessage = { title: "No more energy - wait for recharge", message: "wait for your energy to go back", type: MessageType.TOOLBAR };
export const message_game_over: IMessage = {
    title: "Game Over",
    message: `no more empty tiles
    we are so sorry sir...`, butns: [{ label: "start a new kingdom" }], type: MessageType.POPUP
};
export const message_welcome: IMessage = {
    isWow: true, title: `Welcome to your new kingdom sir`,
    message: `may your rule be long and prosperous!`, butns: [ { label: "guide me", actionType: Action.OPEN_TUTORAIL },{ label: "i rule!", type: 1 }], type: MessageType.POPUP
};



export const message_guide: IMessage = {
    title: "Let's guide you through",
    message: `explain 1.`, butns: [{ label: "done" }, { label: "next", actionType: Action.SHOW_GUIDE_MESSAGE2 }], type: MessageType.POPUP
};

export const message_guide2: IMessage = {
    title: "Page 2",
    message: `Explain 2.`, butns: [{ label: "back", actionType: Action.SHOW_GUIDE_MESSAGE }, { label: "done" }, { label: "next", actionType: Action.SHOW_GUIDE_MESSAGE3 }], type: MessageType.POPUP
};