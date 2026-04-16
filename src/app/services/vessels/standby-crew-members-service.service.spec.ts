import { TestBed } from '@angular/core/testing';

import { StandbyCrewMembersServiceService } from './standby-crew-members-service.service';

describe('StandbyCrewMembersServiceService', () => {
  let service: StandbyCrewMembersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandbyCrewMembersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
