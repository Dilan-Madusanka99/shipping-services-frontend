import { TestBed } from '@angular/core/testing';

import { OnboardCrewRegistrationService } from './onboard-crew-registration.service';

describe('OnboardCrewRegistrationService', () => {
  let service: OnboardCrewRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardCrewRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
