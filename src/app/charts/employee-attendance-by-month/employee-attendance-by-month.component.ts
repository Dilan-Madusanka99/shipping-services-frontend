import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-employee-attendance-by-month',
  standalone: false,
  templateUrl: './employee-attendance-by-month.component.html',
  styleUrl: './employee-attendance-by-month.component.scss'
})
export class EmployeeAttendanceByMonthComponent {
  @ViewChild('chart') chart: ChartComponent;
  employeeAttendanceByMonthOptions: any = {};

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {
    this.employeeAttendanceByMonth();
  }

  public employeeAttendanceByMonth(): void {
    this.commonDataService.getEmployeeAttendanceByMonth().subscribe({
      next: (response: any) => {
        this.updateEmployeeAttendanceByMonth(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      }
    });
  }

  public updateEmployeeAttendanceByMonth(data: any): void {
    const employeeAttendanceByMonthData = data.map((data: any) => {
      return {
        x: data.month,
        y: data.cnt
      };
    });

    this.employeeAttendanceByMonthOptions = {
      series: [{ name: 'Employee Attendence Per Month', data: employeeAttendanceByMonthData }],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count',
          style: {
            color: '#6b7280'
          }
        },
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      colors: ['#f97316'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%'
        }
      },
      grid: {
        borderColor: '#e5e7eb'
      },
      title: {
        text: 'Employee Attendance Per Month',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px'
        }
      }
    };
  }
}
