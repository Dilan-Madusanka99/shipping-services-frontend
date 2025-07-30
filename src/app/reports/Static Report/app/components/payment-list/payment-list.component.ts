import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Payment } from '../../models/payment.module';
import { PaymentPrintService } from '../../services/paymentPrintService';
import { PaymentsService } from 'src/app/services/inventory/payments.service';
import { SupplierRegistrationService } from 'src/app/services/inventory/supplier-registration.service';

@Component({
  selector: 'app-payment-list',
  standalone: false,
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payment: Payment[] = [];
  filteredPayment: Payment[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = true;
  error: string | null = null;
  supplierList: any;

  displayedColumns: string[] = ['paymentNo', 'itemName', 'supplierName', 'quantity', 'amount', 'paymentDate', 'paymentStatus'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private paymentService: PaymentsService,
    private printService: PaymentPrintService,
    private messageService: MessageServiceService,
    private supplierService: SupplierRegistrationService
  ) {}

  ngOnInit(): void {
    this.populateData();
    this.getSupplierList();
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

  public getSupplierName(id: any): string {
    return this.supplierList.find((item: any) => item.id == +id).supplierName;
  }

  //   public getAmount(id: any): string {
  //   return this.supplierList.find((item: any) => item.id == +id).supplierName;
  // }


  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPayment = this.payment;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPayment = this.payment.filter(
      (payment) =>
        payment.paymentNo.toLowerCase().includes(term) ||
        payment.itemName.toString().includes(term) ||
        payment.supplierName.toString().includes(term) ||
        payment.quantity.toString().includes(term) ||
        payment.qtyMeasure.toString().includes(term) ||
        payment.amount.toString().includes(term) ||
        payment.paymentDate.toString().includes(term) ||
        payment.paymentStatus.toString().includes(term)
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPayment = [...this.filteredPayment].sort((a: any, b: any) => {
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

    let dataArray = this.dataSource.filteredData;
    console.log(this.dataSource.filteredData);
    let printData: any[] = [];

    dataArray.forEach((data: any) => {
      let obj = {
        id: data.id,
        paymentNo: data.paymentNo,
        supplierName: this.getSupplierName(data.supplierName),
        amount: data.amount,
        paymentDate: data.paymentDate,
        paymentStatus: data.paymentStatus
      };
      printData.push(obj);
    })

    this.printService.printPaymentReport(printData);
  }

  getDate(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  public populateData(): void {
    try {
      this.paymentService.getData().subscribe({
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
