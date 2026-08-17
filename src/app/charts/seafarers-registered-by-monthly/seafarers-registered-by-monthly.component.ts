import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-seafarers-registered-by-monthly',
  standalone: false,
  templateUrl: './seafarers-registered-by-monthly.component.html',
  styleUrl: './seafarers-registered-by-monthly.component.scss'
})
export class SeafarersRegisteredByMonthlyComponent {
  @ViewChild('chart') chart: ChartComponent;
  seafarersRegisteredByMonthOptions: any = {};

  constructor(
    private commonDataService: CommonDataServiceService,
    private messageService: MessageServiceService
  ) {
    this.seafarersRegisteredByMonth();
  }

  public seafarersRegisteredByMonth(): void {
    this.commonDataService.getSearfarersRegisterdByMonth().subscribe({
      next: (response: any) => {
        this.updateSeafarersRegisterdByMonth(response);
      },
      error: (error: any) => {
        this.messageService.showError(error);
      }
    });
  }

  public updateSeafarersRegisterdByMonth(data: any): void {
    const seafarersRegisteredByMonthData = data.map((data: any) => {
      return {
        x: data.position,
        y: data.cnt
      };
    });

    this.seafarersRegisteredByMonthOptions = {
      series: [{ name: 'Seafarers Registered by Position', data: seafarersRegisteredByMonthData }],
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
        text: 'Seafarers Registered by Position',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px'
        }
      }
    };
  }
}
