import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStorePopupItemComponent } from './items-store-popup-item.component';

describe('ItemsStorePopupItemComponent', () => {
  let component: ItemsStorePopupItemComponent;
  let fixture: ComponentFixture<ItemsStorePopupItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsStorePopupItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStorePopupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
