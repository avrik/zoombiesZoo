import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class DigitCounterService {

  time: Observable<number>
  counter: number = 0;
  interval

  constructor() { }

  setCounter(startAmount: number, endAmount: number) {

    let totalToCount = Math.abs(endAmount - startAmount);
    if (totalToCount == 0) return;
    let countUp: boolean = endAmount - startAmount > 0 ? true : false;
    clearInterval(this.interval);
    //console.log("count : ", startAmount, endAmount);

    this.counter = startAmount;
    let step: number = 1;

    if (totalToCount > 10) {
      step = Math.floor(totalToCount / 10);
    }

    console.log("count step = ", step);

    this.time = new Observable<number>((observer: Subscriber<number>) => {

      if (!countUp) {
        observer.next(endAmount);
        observer.complete();
      }

      this.interval = setInterval(() => {
        this.counter += step;
        if (this.counter >= endAmount) {
          this.counter = endAmount;
          observer.next(this.counter);
          observer.complete();
          clearInterval(this.interval);
        } else {
          observer.next(this.counter);
        }
      }, 10);
    });
  }

}
