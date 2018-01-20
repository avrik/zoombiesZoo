
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
  showThinkBubble: boolean;

  @Input() onTerrain: number;
  @Input() card: Card;
  @Input() placed: boolean;
  @Output() collected: EventEmitter<any> = new EventEmitter();


  constructor(private gameEngine: GameEngineService, private messagesService: MessagesService) 
  { 
    
  }

  ngOnInit() {

  }


}
