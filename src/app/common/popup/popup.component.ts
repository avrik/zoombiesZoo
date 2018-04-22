import { IMessageButton } from './../../services/messages.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagesService, IMessage } from '../../services/messages.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MessageType } from '../../enums/message-type.enum';


@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  animations: [
    trigger('animState', [
      transition('* => show', [
        animate('200ms ease-out', keyframes([
          style({ transform: 'scaleX(0.2) scaleY(0.05)', offset: 0 }),
          style({ transform: 'scaleX(1) scaleY(0.05)', offset: 0.6 }),
          style({ transform: 'scale(1) scaleX(1)', offset: 1.0 }),
        ]))
      ]),
      transition('show => hide', [
        animate('300ms ease-in', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(0)', offset: 1.0 }),
        ]))
      ]),
      //transition('* <=> matchHint', animate('300ms ease-out')),
    ])
  ]
})
export class PopupComponent implements OnInit {
  @Output() actionType:EventEmitter<string> = new EventEmitter();
  message: IMessage;
  animState: string;

  constructor(private messagesService: MessagesService) {
    this.messagesService.currentMessage$.subscribe(message => {
      if (message && message.type == MessageType.POPUP) {
        this.message = Object.assign({},message) ;
        this.animState = "show";
      }
    })
  }

  ngOnInit() {
    //this.animState="";
  }

  onClose() {
    // this.animState = "hide";
    this.messagesService.postMessage(null);
  }

  butnClicked(butnItem: IMessageButton) {
    this.onClose()
    if (butnItem.action) butnItem.action();
    if (butnItem.actionType) this.actionType.emit(butnItem.actionType);
    //this.messagesService.postMessage(null);
    //this.animState = "hide";
    
  }

  onAnimDone() {
    this.animState = "";
  }
}
