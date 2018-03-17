import { Component, OnInit, transition, animate, state, trigger, style } from '@angular/core';
import { MessagesService, IMessage } from '../../../services/messages.service';
import { GameEngineService } from 'app/services/game-engine.service';
import { MessageType } from '../../../enums/message-type.enum';
import { IState } from 'app/redux/interfaces';

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
  state: string = '';
  currentMessage: IMessage;
  title 
  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) {

    this.messagesService.currentMessage$.subscribe(currentMessage => {
      if (currentMessage && currentMessage.type == MessageType.CURTAIN) {
        this.title = currentMessage.title;
        this.currentMessage = currentMessage;
        this.showCurtain();
      }
    }
    )
  }

  ngOnInit() {
    this.gameEngine.store.subscribe(() => {

      let newState: IState = this.gameEngine.store.getState();

      if (newState.currentMessage && newState.currentMessage.type == MessageType.CURTAIN) {

        this.currentMessage = newState.currentMessage;
        this.showCurtain();
        newState.currentMessage = null;
      }
    })

    this.state = "out";
  }

  showCurtain() {
    this.state = 'in';

    setTimeout(() => {
      this.state = 'out';
    }, this.currentMessage.delay ? this.currentMessage.delay : 2500);
  }

}
