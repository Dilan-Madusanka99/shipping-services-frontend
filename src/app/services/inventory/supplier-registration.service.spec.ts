import { TestBed } from '@angular/core/testing';

import { SupplierRegistrationService } from './supplier-registration.service';

describe('SupplierRegistrationService', () => {
  let service: SupplierRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
