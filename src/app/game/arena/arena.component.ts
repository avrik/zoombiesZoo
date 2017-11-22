import { Component, OnInit } from '@angular/core';
import { Enemy } from './enemy';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {
  enemies: Enemy[] = [];

  constructor() {

  }

  ngOnInit() {
  }

}
