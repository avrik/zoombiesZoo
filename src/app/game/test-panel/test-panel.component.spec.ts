import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPanelComponent } from './test-panel.component';

describe('TestPanelComponent', () => {
  let component: TestPanelComponent;
  let fixture: ComponentFixture<TestPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
