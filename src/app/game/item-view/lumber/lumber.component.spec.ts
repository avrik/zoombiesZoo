import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LumberComponent } from './lumber.component';

describe('LumberComponent', () => {
  let component: LumberComponent;
  let fixture: ComponentFixture<LumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
