import { Component, OnInit, transition, animate, state, trigger, style } from '@angular/core';
import { MessagesService, IMessage } from '../../../services/messages.service';

@Component({
  selector: 'message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.css'],
  animations: [
    trigger('show', [
      state('in', style({
        overflow: 'hidden',
        height: '120px'
      })),
      state('out', style({
        overflow: 'hidden',
        height: '0px',
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ])
  ]
})
export class MessageWindowComponent implements OnInit {
  state: string='';
  currentMessage: IMessage;

  constructor(private messagesService: MessagesService) {
    this.messagesService.currentMessage$.subscribe(currentMessage => {
      if (currentMessage && currentMessage.type == 1) {
        this.currentMessage = currentMessage;
        this.state = 'in';

        setTimeout(() => {
          this.state = 'out';
        }, 2000);
      }
    }
    )
  }

  ngOnInit() {
   this.state = "out";
  }

}
