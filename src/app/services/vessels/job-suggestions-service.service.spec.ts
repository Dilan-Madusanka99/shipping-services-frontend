import { TestBed } from '@angular/core/testing';

import { JobSuggestionsServiceService } from './job-suggestions-service.service';

describe('JobSuggestionsServiceService', () => {
  let service: JobSuggestionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSuggestionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
