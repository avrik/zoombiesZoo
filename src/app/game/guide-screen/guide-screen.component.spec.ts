import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideScreenComponent } from './guide-screen.component';

describe('GuideScreenComponent', () => {
  let component: GuideScreenComponent;
  let fixture: ComponentFixture<GuideScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
