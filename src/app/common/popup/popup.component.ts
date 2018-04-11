import { IMessageButton } from './../../services/messages.service';
import { Component, OnInit } from '@angular/core';
import { MessagesService, IMessage } from '../../services/messages.service';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  message: IMessage;

  constructor(private messagesService: MessagesService) {
    this.messagesService.currentMessage$.subscribe(message => {
      if (message && message.type == 0) this.message = message;
    })
  }

  ngOnInit() {
  }

  onClose() {
    this.messagesService.postMessage(null);
  }

  butnClicked(butnItem: IMessageButton) {
    if (butnItem.action) butnItem.action();
    this.messagesService.postMessage(null);
  }

}
