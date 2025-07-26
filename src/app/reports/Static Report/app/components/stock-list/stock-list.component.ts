import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Stock } from '../../models/stock.model';
import { StocksService } from 'src/app/services/inventory/stocks.service';
import { StockPrintService } from '../../services/stockPrintService';
import { SupplierRegistrationService } from 'src/app/services/inventory/supplier-registration.service';
import { ItemsRegistrationService } from 'src/app/services/inventory/items-registration.service';

@Component({
  selector: 'app-stock-list',
  standalone: false,
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  stock: Stock[] = [];
  filteredStock: Stock[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;
  supplierList: any;
  itemList: any;

  displayedColumns: string[] = ['itemNo', 'itemName', 'supplierName', 'quantity'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private stockService: StocksService,
    private printService: StockPrintService,
    private messageService: MessageServiceService,
    private supplierService: SupplierRegistrationService,
    private itemService: ItemsRegistrationService
  ) {}

  ngOnInit(): void {
    this.getSupplierList();
    this.getItemList();
    this.populateData();
  }

  public getSupplierList(): void {
    try{
      this.supplierService.getData().subscribe({
        next: (response: any) => {
          this.supplierList = response;
        },
        error: (error: any) => {
          this.messageService.showError("Error While Getting Suppliers List");
        }
      })
    } catch(error) {
      this.messageService.showError("Error While Getting Suppliers List");
    }
  }

  public getItemList(): void {
    try{
      this.itemService.getData().subscribe({
        next: (response: any) => {
          this.itemList = response;
        },
        error: (error: any) => {
          this.messageService.showError("Error While Getting Item List");
        }
      })
    } catch(error) {
      this.messageService.showError("Error While Getting Item List");
    }
  }

  public getSupplierName(id: any): string {
    return this.supplierList.find((item: any) => item.id == +id).supplierName;
  }
  public getItemNo(id: any): string {
    return this.itemList.find((item: any) => item.id == +id).itemNo;
  }


  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStock = this.stock;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredStock = this.stock.filter(
      (stock) =>
        stock.itemNo.toLowerCase().includes(term) ||
        stock.itemName.toString().includes(term) ||
        stock.supplierName.toString().includes(term) ||
        stock.quantity.toString().includes(term) ||
        stock.qtyMeasure.toString().includes(term)
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredStock = [...this.filteredStock].sort((a: any, b: any) => {
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
    this.printService.printStockReport(this.dataSource.filteredData);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  public populateData(): void {
    try {
      this.stockService.getData().subscribe({
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
