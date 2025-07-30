import { TestBed } from '@angular/core/testing';

import { SeaServicesService } from './sea-services.service';

describe('SeaServicesService', () => {
  let service: SeaServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeaServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
