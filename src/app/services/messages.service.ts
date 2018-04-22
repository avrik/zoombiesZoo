import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { GameEngineService } from 'app/services/game-engine.service';
import { IState } from 'app/redux/interfaces';


export interface IMessageButton {
  label: string;
  type?: number;
  action?: Function;
  actionType?: string;
}

export interface IMessage {
  type: number;
  title?: string;
  message?: string;
  butns?: IMessageButton[];
  isWow?: boolean;
  delay?: number;
}
@Injectable()
export class MessagesService {

  private _currentMessage$: BehaviorSubject<IMessage>;

  message: IMessage;

  constructor(private gameEngine: GameEngineService) {
    this._currentMessage$ = <BehaviorSubject<IMessage>>new BehaviorSubject(null);


    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      if (newState.messages && newState.messages.length) {
        this.message = newState.messages[newState.messages.length - 1];
      }

    })
  }

  get currentMessage$(): Observable<IMessage> { return this._currentMessage$.asObservable(); }

  removeMessage() {
    
  }

  postMessage(message: IMessage) {
    this._currentMessage$.next(message);
  }
}
