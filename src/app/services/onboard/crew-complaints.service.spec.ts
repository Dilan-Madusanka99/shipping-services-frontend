import { TestBed } from '@angular/core/testing';

import { CrewComplaintsService } from './crew-complaints.service';

describe('CrewComplaintsService', () => {
  let service: CrewComplaintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrewComplaintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
