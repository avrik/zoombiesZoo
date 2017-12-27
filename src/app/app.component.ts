import { Component } from '@angular/core';
import { createStore } from 'redux'
import { mainReducerFunc } from './redux/main-reducer';
import { MessagesService, IMessage } from './services/messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentMessage: IMessage;

  constructor(private messagesService: MessagesService) {
    this.messagesService.currentMessage$.subscribe(message => {
      this.currentMessage = message;
    })


    /* let store = createStore(mainReducerFunc);

    store.subscribe(() =>
      console.log(store.getState())
    )

    store.dispatch({ type: 'INCREMENT' }) */
  }
}
