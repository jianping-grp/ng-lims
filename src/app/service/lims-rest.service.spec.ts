import { TestBed, inject } from '@angular/core/testing';

import { LimsRestService } from './lims-rest.service';

describe('LimsRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LimsRestService]
    });
  });

  it('should be created', inject([LimsRestService], (service: LimsRestService) => {
    expect(service).toBeTruthy();
  }));
});
