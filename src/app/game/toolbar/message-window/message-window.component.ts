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
        transform: 'translateY(0%)'
      })),
      state('out', style({
        overflow: 'hidden',
        transform: 'translateY(-100%)'
      })),
      transition('in => out', animate('200ms ease-out')),
      transition('out => in', animate('200ms ease-out'))
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
        }, 2500);
      }
    }
    )
  }

  ngOnInit() {
   this.state = "out";
  }

}
