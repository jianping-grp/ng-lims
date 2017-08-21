import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationScheduleComponent } from './reservation-schedule.component';

describe('ReservationScheduleComponent', () => {
  let component: ReservationScheduleComponent;
  let fixture: ComponentFixture<ReservationScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
