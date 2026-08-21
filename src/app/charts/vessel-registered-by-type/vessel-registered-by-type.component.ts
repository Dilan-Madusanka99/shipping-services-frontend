import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CommonDataServiceService } from 'src/app/services/common-data-service/common-data-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-vessel-registered-by-type',
  standalone: false,
  templateUrl: './vessel-registered-by-type.component.html',
  styleUrl: './vessel-registered-by-type.component.scss'
})
export class VesselRegisteredByTypeComponent {
  @ViewChild('chart') chart: ChartComponent;
  vesselRegisteredByTypeOptions: any = {};
  
    constructor(
      private commonDataService: CommonDataServiceService,
      private messageService: MessageServiceService
    ) {
      this.vesselRegisteredByType();
    }
  
    public vesselRegisteredByType(): void {
      this.commonDataService.getVesselRegisteredByType().subscribe({
        next: (response: any) => {
          this.updateVesselRegisteredByType(response);
        },
        error: (error: any) => {
          this.messageService.showError(error);
        }
      });
    }
  
    public updateVesselRegisteredByType(data: any): void {
      const vesselRegisteredByTypeData = data.map((data: any) => {
        return {
          x: data.type,
          y: data.cnt
        };
      });
  
      this.vesselRegisteredByTypeOptions = {
        series: [{ name: 'Vessels Registered Per Month', data: vesselRegisteredByTypeData }],
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
        colors: ['#3F4D67'],
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
          text: 'Vessel Registered Per Type',
          align: 'center',
          style: {
            color: '#1f2937',
            fontSize: '16px'
          }
        }
      };
    }

}
