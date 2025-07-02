import { TestBed } from '@angular/core/testing';

import { VesselRegistrationService } from './vessel-registration.service';

describe('VesselRegistrationService', () => {
  let service: VesselRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VesselRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
