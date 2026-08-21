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
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  
months = [
  {name:'January',value:1},
  {name:'February',value:2},
  {name:'March',value:3},
  {name:'April',value:4},
  {name:'May',value:5},
  {name:'June',value:6},
  {name:'July',value:7},
  {name:'August',value:8},
  {name:'September',value:9},
  {name:'October',value:10},
  {name:'November',value:11},
  {name:'December',value:12}
];

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {}

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      this.years.push(year);
    }

    this.employeeAttendanceByEmployee();
  }

  public employeeAttendanceByEmployee(): void {
    this.commonDataService.getEmployeeAttendanceByEmployee(this.selectedMonth, this.selectedYear).subscribe({
      next: (response: any) => {
        this.updateEmployeeAttendanceByEmployee(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      }
    });
  }

  filterChanged(){
      this.employeeAttendanceByEmployee();
  }


  public updateEmployeeAttendanceByEmployee(data: any): void {
    const employeeAttendanceByEmployeeData = data.map((data: any) => {
      return {
        x: data.employeeName,
        y: data.cnt
      };
    });

    this.employeeAttendanceByMonthOptions = {
      series: [{name: 'Employee Attendance Count', data: employeeAttendanceByEmployeeData}],
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
          text: 'Days',
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
      colors: ['#3B82A0'],
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
        text: 'Employee Attendance Count',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px'
        }
      }
    };
  }
}
