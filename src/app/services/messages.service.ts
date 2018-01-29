import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export interface IMessageButton {
  label: string;
  action?: Function;
}

export interface IMessage {
  type: number;
  title: string;
  message?: string;
  butns?: IMessageButton[];
  isWow?: boolean;
  delay?:number;
}
@Injectable()
export class MessagesService {

  private _currentMessage$: BehaviorSubject<IMessage>;

  constructor() {
    this._currentMessage$ = <BehaviorSubject<IMessage>>new BehaviorSubject(null);
  }

  get currentMessage$(): Observable<IMessage> { return this._currentMessage$.asObservable(); }

  postMessage(message: IMessage) {
    this._currentMessage$.next(message);
  }
}
