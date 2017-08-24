import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordComponent } from './user-record.component';

describe('UserRecordComponent', () => {
  let component: UserRecordComponent;
  let fixture: ComponentFixture<UserRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
