import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class DigitCounterService {

  time: Observable<number>
  counter: number = 0;

  constructor() { }

  setCounter(startAmount: number, endAmount: number) {
    this.counter = startAmount;
    let totalToCount = endAmount - startAmount;
    let step: number = 1;

    /* if (totalToCount > 1000) {
      step = Math.round(totalToCount / (totalToCount/10));
    } else
    if (totalToCount > 100) {
      step = Math.round(totalToCount / 100);
    } else
      if (totalToCount > 10) {
        step = Math.round(totalToCount / 10);
      } else
        step = 1; */
    if (totalToCount > 10) {
      step = Math.floor(totalToCount / 10);
    }


    console.log("count step = ",step);
    this.time = new Observable<number>((observer: Subscriber<number>) => {
      setInterval(() => {
        if (this.counter < endAmount) {
          this.counter += step;

          if (this.counter > endAmount) this.counter = endAmount
          observer.next(this.counter);
        }
      }, 10);
    });

    // this.time.subscribe(a => console.log("aaa = " + a));
  }

}
