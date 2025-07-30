import { TestBed } from '@angular/core/testing';

import { ItemsRegistrationService } from './items-registration.service';

describe('ItemsRegistrationService', () => {
  let service: ItemsRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
