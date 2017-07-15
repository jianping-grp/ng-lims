import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentCardComponent } from './instrument-card.component';

describe('InstrumentCardComponent', () => {
  let component: InstrumentCardComponent;
  let fixture: ComponentFixture<InstrumentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
