import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Appointment } from '../../models/appointment.model';
import { AppointmentPrintService } from '../../services/appointmentPrintService';
import { AppointmentService } from 'src/app/services/seafarers/appointment.service';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointment: Appointment[] = [];
  filteredAppointment: Appointment[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;

  displayedColumns: string[] = ['sidNo', 'firstName', 'lastName', 'position', 'appointmentDate', 'appointmentTime'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private printService: AppointmentPrintService,
    private messageService: MessageServiceService
  ) {}

  ngOnInit(): void {
    this.populateData();
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAppointment = this.appointment;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredAppointment = this.appointment.filter(
      (appointment) =>
        appointment.sidNo.toLowerCase().includes(term) ||
        appointment.firstName.toString().includes(term) ||
        appointment.lastName.toString().includes(term) ||
        appointment.position.toString().includes(term) ||
        appointment.appointmentDate.toString().includes(term) ||
        appointment.appointmentTime.toString().includes(term)
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAppointment = [...this.filteredAppointment].sort((a: any, b: any) => {
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
    this.printService.printAppointmentReport(this.dataSource.filteredData);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  public populateData(): void {
    try {
      this.appointmentService.getData().subscribe({
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
