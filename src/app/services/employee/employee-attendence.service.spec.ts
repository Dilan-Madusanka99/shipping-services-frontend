import { TestBed } from '@angular/core/testing';

import { EmployeeAttendenceService } from './employee-attendence.service';

describe('EmployeeAttendenceService', () => {
  let service: EmployeeAttendenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAttendenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
