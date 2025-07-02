import { TestBed } from '@angular/core/testing';

import { MyAppointmentService } from './my-appointment.service';

describe('MyAppointmentService', () => {
  let service: MyAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
