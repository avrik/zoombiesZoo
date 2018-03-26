import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { IState } from 'app/redux/interfaces';

@Component({
  selector: 'battery-view',
  templateUrl: './battery-view.component.html',
  styleUrls: ['./battery-view.component.css']
})
export class BatteryViewComponent implements OnInit {
  energy:number
  constructor(private gameEngine:GameEngineService) 
  { 
    this.gameEngine.store.subscribe(() =>{
      let newState:IState = this.gameEngine.store.getState();

      this.energy = newState.energy;
    })
  }

  ngOnInit() {
  }

}
