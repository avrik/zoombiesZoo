import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { GameEngineService, IResourceStorage } from 'app/services/game-engine.service';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css'],
  animations: [
    trigger('animate', [
      state('in', style({
        transform: 'scale(1.2)'
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

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit() {
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
