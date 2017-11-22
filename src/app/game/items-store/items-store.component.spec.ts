import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStoreComponent } from './items-store.component';

describe('ItemsStoreComponent', () => {
  let component: ItemsStoreComponent;
  let fixture: ComponentFixture<ItemsStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
