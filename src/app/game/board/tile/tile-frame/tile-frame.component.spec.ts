import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileFrameComponent } from './tile-frame.component';

describe('TileFrameComponent', () => {
  let component: TileFrameComponent;
  let fixture: ComponentFixture<TileFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
