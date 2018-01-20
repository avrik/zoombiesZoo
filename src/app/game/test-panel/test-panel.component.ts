import { Card, ICardData, cardCollection } from './../cards/card';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';

@Component({
  selector: 'test-panel',
  templateUrl: './test-panel.component.html',
  styleUrls: ['./test-panel.component.css']
})
export class TestPanelComponent implements OnInit {

  collection:ICardData[];
  constructor(private gameEngine:GameEngineService) 
  { 
      this.collection = cardCollection.map(a=>a);
  }

  ngOnInit() {
  }

  onItemClick(item:ICardData) {
    //this.gameEngine.updateCurrentCard = this.gameEngine.getNewCard(item.family.name)
  }
}
