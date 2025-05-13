import { TestBed } from '@angular/core/testing';

import { LogInServiceService } from './log-in-service.service';

describe('LogInServiceService', () => {
  let service: LogInServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogInServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
