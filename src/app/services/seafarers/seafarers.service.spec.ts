import { TestBed } from '@angular/core/testing';

import { SeafarersService } from './seafarers.service';

describe('SeafarersService', () => {
  let service: SeafarersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeafarersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
