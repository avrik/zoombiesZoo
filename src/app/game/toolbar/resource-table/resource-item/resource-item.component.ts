import { Component, OnInit, Input } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css']
})
export class ResourceItemComponent implements OnInit {

  @Input() type: number;
  @Input() amount: number;
  @Input() icon: string;
  //@Input() bonus: number;

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit() {
  }

  onClick() {
    this.amount++;
    this.gameEngine.addToStorage(this.type, 1);
  }

}
