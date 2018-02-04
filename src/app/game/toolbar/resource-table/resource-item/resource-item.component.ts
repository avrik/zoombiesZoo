import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { IResourceStorage, IState } from 'app/redux/interfaces';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css'],
  animations: [
    trigger('animate', [
      state('in', style({
        transform: 'scale(1.4)'
      })),
      state('out', style({
        transform: 'scale(1)'
      })),
      transition('in => out', animate('150ms ease-in')),
      transition('out => in', animate('200ms ease-out'))
    ])
  ]
})
export class ResourceItemComponent implements OnInit {

  @Input() type: number;
  @Input() amount: number;
  @Input() icon: string;

  state: string = "out";
  resourceStorage: IResourceStorage;
  currentState:IState;

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {

    this.gameEngine.store.subscribe(() => {
     // debugger;
      let newState: IState = this.gameEngine.store.getState();
      
      //if (this.resourceStorage != newState.resources) {
      
        /* if (this.currentState)
        {
          switch (this.type) {
            case 0:
              if (newState.resources.bricks > this.currentState.resources.bricks) this.animate();
              break;
            case 1:
              if (newState.resources.lumber > this.currentState.resources.lumber) this.animate();
              break;
            case 2:
              if (newState.resources.coins > this.currentState.resources.coins) this.animate();
              break;
          }
        }

        this.currentState = newState; */
      //}
        
      
    })
    /* this.gameEngine.resourceStorage$.subscribe(resourceStorage => {

      if (resourceStorage && this.resourceStorage) {
        switch (this.type) {
          case 0:
            if (resourceStorage.bricks > this.resourceStorage.bricks) this.animate();
            break;
          case 1:
            if (resourceStorage.lumber > this.resourceStorage.lumber) this.animate();
            break;
          case 2:
            if (resourceStorage.coins > this.resourceStorage.coins) this.animate();
            break;
        }

      }

      this.resourceStorage = Object.assign({}, resourceStorage);

    }) */
  }

  animate() {
    this.state = "in";
    setTimeout(() => {
      this.state = "out";
    }, 300);
  }

  onClick() {
    this.amount++;
    //this.gameEngine.addToStorage(this.type, 1);
  }

}
