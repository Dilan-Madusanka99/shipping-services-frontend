import { TestBed } from '@angular/core/testing';

import { OtherDetailsRegistrationService } from './other-details-registration.service';

describe('OtherDetailsRegistrationService', () => {
  let service: OtherDetailsRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherDetailsRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
