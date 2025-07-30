import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeServiceService } from 'src/app/services/employee/employee-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ItemsRegistrationService } from 'src/app/services/inventory/items-registration.service';
import { Item } from '../../models/item.module';
import { ItemPrintService } from '../../services/itemPrintService';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  item: Item[] = [];
  filteredItem: Item[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;

  displayedColumns: string[] = ['itemNo', 'itemName', 'itemCategory'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private itemService: ItemsRegistrationService,
    private printService: ItemPrintService,
    private messageService: MessageServiceService
  ) {}

  ngOnInit(): void {
    this.populateData();
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItem = this.item;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredItem = this.item.filter(
      (Item) =>
        Item.itemNo.toLowerCase().includes(term) ||
        Item.itemName.toString().includes(term) ||
        Item.itemCategory.toString().includes(term) 
    );    
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredItem = [...this.filteredItem].sort((a: any, b: any) => {
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
    this.printService.printItemReport(this.dataSource.filteredData);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  public populateData(): void {
    try {
      this.itemService.getData().subscribe({
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
