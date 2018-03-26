import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileTopComponent } from './tile-top.component';

describe('TileTopComponent', () => {
  let component: TileTopComponent;
  let fixture: ComponentFixture<TileTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
