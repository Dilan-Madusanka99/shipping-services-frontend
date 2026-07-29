import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-payments-by-monthly',
  standalone: false,
  templateUrl: './payments-by-monthly.component.html',
  styleUrl: './payments-by-monthly.component.scss'
})
export class PaymentsByMonthlyComponent {
    @ViewChild('chart') chart: ChartComponent;
    paymentByMonthlyOptions: any = {};
  
    constructor(
      private commonDataService: CommonDataServiceService,
      private messageService: MessageServiceService
    ) {
      this.paymentsByMonth();
    }
  
    public paymentsByMonth(): void {
      this.commonDataService.getPaymentsByMonth().subscribe({
        next: (response: any) => {
          this.updatePaymentsByMonth(response);
        },
        error: (error: any) => {
          this.messageService.showError(error);
        }
      });
    }
  
    public updatePaymentsByMonth(data: any): void {
      const paymentsByMonthData = data.map((data: any) => {
        return {
          x: data.month,
          y: data.cnt
        };
      });
  
      this.paymentByMonthlyOptions = {
        series: [{ name: 'Supplier Payments Per Month', data: paymentsByMonthData }],
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
            text: 'Rs :',
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
          text: 'Supplier Payments Per Month',
          align: 'center',
          style: {
            color: '#1f2937',
            fontSize: '16px'
          }
        }
      };
    }

}
