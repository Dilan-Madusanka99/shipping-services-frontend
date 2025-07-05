import { TestBed } from '@angular/core/testing';

import { CertificateVerificationService } from './certificate-verification.service';

describe('CertificateVerificationService', () => {
  let service: CertificateVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
