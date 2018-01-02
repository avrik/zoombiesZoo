import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileBuyPopupComponent } from './tile-buy-popup.component';

describe('TileBuyPopupComponent', () => {
  let component: TileBuyPopupComponent;
  let fixture: ComponentFixture<TileBuyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileBuyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileBuyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
