import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  @Input() title:string="test";
  @Input() icon:string = ""
  constructor() { }

  ngOnInit() {
  }

}
