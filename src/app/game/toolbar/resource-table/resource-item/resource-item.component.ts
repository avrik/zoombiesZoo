import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css']
})
export class ResourceItemComponent implements OnInit {

  @Input() amount:number;
  @Input() icon:string;
  @Input() bonus:number;
  constructor() { }

  ngOnInit() {
  }

}
