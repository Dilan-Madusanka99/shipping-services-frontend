import { TestBed } from '@angular/core/testing';

import { JobPostingServiceService } from './job-posting-service.service';

describe('JobPostingServiceService', () => {
  let service: JobPostingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPostingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
