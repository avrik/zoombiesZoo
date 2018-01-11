import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImgComponent } from './item-img.component';

describe('ItemImgComponent', () => {
  let component: ItemImgComponent;
  let fixture: ComponentFixture<ItemImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
