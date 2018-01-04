import { Component } from '@angular/core';
import { mainReducerFunc } from './redux/main-reducer';
import { MessagesService, IMessage } from './services/messages.service';

//TODOS :

// + handle score
// + princing
// + move building implementation
// + undo implementation
// + save game state implementation
// + restart game fixing
// + fix next card hinting
// + gold reward handling
// + progress bar animation
// + add match hint on rollover
// + add remove resource/bomb card
// + fix curtain animation
// + add game settings
// + high score



// MAJOR ISSUES

// + mobile test
// + locale
// + redesign & animations
// + redux

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
