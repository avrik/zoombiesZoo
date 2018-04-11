import { Component } from '@angular/core';
import { MessagesService, IMessage } from './services/messages.service';

//BUGS :

//+ on level 3 match house population reduce
//+ coins reward not good
//+ merge animation for 2nd level tile not good
// + collect 6 stones/trees to 2 items not good

//++ message stay 
//++ oil to energy
//++ wild bugs - match near wood.. (maybe fixed)

// Design fixes :
// resources images too small (on toolbar)
// replace tomb image
// redo tile road 


//TODOS :

// ++ undo implementation
// ++ save game state implementation

// ++ handle score
// ++ pricing
// ++ move building implementation
// ++ restart game fixing
// ++ fix next card hinting
// ++ gold reward handling
// ++ progress bar animation
// ++ add match hint animation on rollover
// ++ add remove resource/bomb card
// ++ fix curtain animation
// + add game settings button + window

// + high score
// + add seasons (winter ,spring...)
// + tutorial
// + score count animation


//ASSETS

// + terrains :
// road 
// chest open + closed

// + resources :
// stones
// trees
// brick
// lumber 
// gold/silver coin
// tomb

// + buildings
// houses (9 levels)
// temple/church/chtedral (9 levels)
// storage (3 levels)
// sawmill (3 levels)
// palace?

// + people 
// people
// animals

// UI
// settings window


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
