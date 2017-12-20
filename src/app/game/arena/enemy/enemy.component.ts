import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-enemy',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.css']
})
export class EnemyComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
