import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstrumentDetailComponent} from './instrument-detail.component';

describe('InstrumentDetailComponent', () => {
  let component: InstrumentDetailComponent;
  let fixture: ComponentFixture<InstrumentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InstrumentDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
