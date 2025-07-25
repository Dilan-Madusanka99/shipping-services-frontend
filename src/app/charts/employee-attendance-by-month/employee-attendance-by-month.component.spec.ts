import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceByMonthComponent } from './employee-attendance-by-month.component';

describe('EmployeeAttendanceByMonthComponent', () => {
  let component: EmployeeAttendanceByMonthComponent;
  let fixture: ComponentFixture<EmployeeAttendanceByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAttendanceByMonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAttendanceByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
