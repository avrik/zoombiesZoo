import { Card, ICardData, cardCollection } from './../cards/card';
import { Component, OnInit } from '@angular/core';
import { GameEngineService } from 'app/services/game-engine.service';
import { SET_NEXT_CARD } from 'app/redux/actions/actions';

@Component({
  selector: 'test-panel',
  templateUrl: './test-panel.component.html',
  styleUrls: ['./test-panel.component.css']
})
export class TestPanelComponent implements OnInit {

  collection: ICardData[];
  constructor(private gameEngine: GameEngineService) {
    this.collection = cardCollection.map(a => a);
  }

  ngOnInit() {
  }

  onItemClick(item: ICardData) {
    this.gameEngine.store.dispatch({ type: SET_NEXT_CARD, payload: item.family.name });
  }
}
