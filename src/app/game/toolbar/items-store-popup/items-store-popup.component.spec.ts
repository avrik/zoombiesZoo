import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStorePopupComponent } from './items-store-popup.component';

describe('ItemsStorePopupComponent', () => {
  let component: ItemsStorePopupComponent;
  let fixture: ComponentFixture<ItemsStorePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsStorePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStorePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
