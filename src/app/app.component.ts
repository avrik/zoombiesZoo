import { Component } from '@angular/core';
import { MessagesService, IMessage } from './services/messages.service';

//BUGS :
//+ store buy items bug
//+ wild bugs - match near wood..
//+ person/animal movment glitch


//TODOS :

// + undo implementation
// + save game state implementation

// + handle score
// + pricing
// ++ move building implementation
// + restart game fixing
// ++ fix next card hinting
// + gold reward handling
// ++ progress bar animation
// ++ add match hint animation on rollover
// ++ add remove resource/bomb card
// ++ fix curtain animation
// + add game settings button + window
// + high score
// + add seasons (winter ,spring...)
// + tutorial
// + score count animation

// MAJOR ISSUES

// + mobile test
// + locale
// + redesign & animations
// + redux
// + sounds & music
// + effects
// + monetization

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


  }
}
