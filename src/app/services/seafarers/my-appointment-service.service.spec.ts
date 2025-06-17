import { TestBed } from '@angular/core/testing';

import { MyAppointmentServiceService } from './my-appointment-service.service';

describe('MyAppointmentServiceService', () => {
  let service: MyAppointmentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAppointmentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
