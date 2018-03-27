import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { IState } from 'app/redux/interfaces';

@Component({
  selector: 'battery-view',
  templateUrl: './battery-view.component.html',
  styleUrls: ['./battery-view.component.css']
})
export class BatteryViewComponent implements OnInit {
  energy: number;
  percent;
  countdown: number = 0;
  countdownPercent
  constructor(private gameEngine: GameEngineService) {
    this.gameEngine.store.subscribe(() => {
      let newState: IState = this.gameEngine.store.getState();

      this.energy = newState.energy;
      this.percent = Math.round(newState.energy / newState.maxEnergy * 100) + "%";
      // console.log(" ---- per "+this.percent);
    })
  }

  ngOnInit() {

    setInterval(() => {
      this.countdown++;

      if (this.countdown >= 60) {
        this.countdown = 0;
        this.gameEngine.addEnergy(1);
      }

      this.countdownPercent = Math.round((this.countdown / 60) * 100) + "%";

    }, 1000)
  }

}
