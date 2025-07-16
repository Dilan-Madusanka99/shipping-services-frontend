import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { VesselRegistrationService } from "src/app/services/vessels/vessel-registration.service";
import { VesselPrintService } from "../../services/vesselPrintService";
import { MessageServiceService } from "src/app/services/message-service/message-service.service";
import { Vessel } from "../../models/vessel.model";

@Component({
  selector: 'app-vessel-list',
  standalone: false,
  templateUrl: './vessel-list.component.html',
  styleUrls: ['./vessel-list.component.css']
})
export class vesselListComponent implements OnInit {

  vessel: Vessel[] = [];
  filteredVessel: Vessel[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;

  displayedColumns: string[] = ['vesselName', 'imoNo', 'vesselType', 'flag', 'grt', 'bhp', 'yob'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
      private vesselService: VesselRegistrationService,
      private VesselPrintService: VesselPrintService,
      private messageService: MessageServiceService
    ) {}
  
    ngOnInit(): void {
      this.populateData();
    }
  
    search(): void {
      if (!this.searchTerm.trim()) {
        this.filteredVessel = this.vessel;
        return;
      }
  
      const term = this.searchTerm.toLowerCase();
      this.filteredVessel = this.vessel.filter(
        (vessel) =>
          vessel.vesselName.toLowerCase().includes(term) ||
          vessel.imoNo.toString().includes(term) ||
          vessel.vesselType.toString().includes(term) ||
          vessel.flag.toString().includes(term) ||
          vessel.grt.toString().includes(term) ||
          vessel.bhp.toString().includes(term) ||
          vessel.yob.toString().includes(term) 
      );
    }
  
    sortBy(column: string): void {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
  
      this.filteredVessel = [...this.filteredVessel].sort((a: any, b: any) => {
        const valueA = a[column];
        const valueB = b[column];
  
        if (typeof valueA === 'string') {
          const comparison = valueA.localeCompare(valueB);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        } else {
          return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
      });
    }
  
    getSortIcon(column: string): string {
      if (this.sortColumn !== column) {
        return '↕';
      }
      return this.sortDirection === 'asc' ? '↑' : '↓';
    }
  
    printReport(): void {
      this.VesselPrintService.printVesselReport(this.dataSource.filteredData);
    }
  
    getDate(): string {
      const today = new Date();
      return today.toLocaleDateString();
    }
  
    public populateData(): void {
      try {
        this.vesselService.getData().subscribe({
          next: (dataList: any[]) => {
            if (dataList.length <= 0) {
              return;
            }
  
            this.dataSource = new MatTableDataSource(dataList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (error) => {
            this.messageService.showError('Action Failed With Error ' + error);
          }
        });
      } catch (error) {
        this.messageService.showError('Action Failed With Error ' + error);
      }
    }
  
    public refreshData(): void {
      this.populateData();
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
}