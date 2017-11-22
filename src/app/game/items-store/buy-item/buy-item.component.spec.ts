import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemComponent } from './buy-item.component';

describe('BuyItemComponent', () => {
  let component: BuyItemComponent;
  let fixture: ComponentFixture<BuyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
