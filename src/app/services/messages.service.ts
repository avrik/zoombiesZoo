import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export interface IMessage {
  title:string;
  message?:string;
  actions?:any[];
}
@Injectable()
export class MessagesService {

  private _currentMessage$: BehaviorSubject<IMessage>;

  constructor() 
  { 
    this._currentMessage$ = <BehaviorSubject<IMessage>>new BehaviorSubject(null);
  }

  get currentMessage$(): Observable<IMessage> { return this._currentMessage$.asObservable(); }

  postMessage(message :IMessage) {
    this._currentMessage$.next(message);
  }
}
