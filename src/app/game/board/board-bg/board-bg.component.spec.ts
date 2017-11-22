import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBgComponent } from './board-bg.component';

describe('BoardBgComponent', () => {
  let component: BoardBgComponent;
  let fixture: ComponentFixture<BoardBgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardBgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
