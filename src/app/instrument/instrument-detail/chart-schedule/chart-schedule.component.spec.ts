import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaScheduleComponent } from './chart-schedule.component';

describe('DaScheduleComponent', () => {
  let component: DaScheduleComponent;
  let fixture: ComponentFixture<DaScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
