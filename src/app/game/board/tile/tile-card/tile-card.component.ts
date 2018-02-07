
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../cards/card';
import { GameEngineService } from 'app/services/game-engine.service';
import { CardFamilyTypeEnum } from '../../../../enums/card-family-type-enum.enum';
import { MessagesService } from '../../../../services/messages.service';

@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.css']
})
export class TileCardComponent implements OnInit {

  @Input() onTerrain: number;
  @Input() card: Card;

  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) 
  { 
    
  }

  ngOnInit() {

  }


}
