import { TestBed } from '@angular/core/testing';

import { CertificatesRegistrationService } from './certificates-registration.service';

describe('CertificatesRegistrationService', () => {
  let service: CertificatesRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificatesRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
