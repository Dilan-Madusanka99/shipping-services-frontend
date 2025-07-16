import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeUrl } from '@angular/platform-browser';
import { ItemsRegistrationService } from 'src/app/services/inventory/items-registration.service';
import { PaymentsService } from 'src/app/services/inventory/payments.service';
import { StocksService } from 'src/app/services/inventory/stocks.service';
import { SupplierRegistrationService } from 'src/app/services/inventory/supplier-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

export interface PeriodicElement {
  itemNo: String;
  itemName: string;
  supplierName: string;
  quantity: Number;
  qtyMeasure: String;
}

const ELEMENT_DATA: any[] = [ 
  {itemNo: '001', itemName: 'fish', supplierName: 'fish city', quantity: 10, qtyMeasure: 'pcs'},
];

@Component({
  selector: 'app-stocks',
  standalone: false,
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent {

  stocksForm : FormGroup;

    displayedColumns: string[] = ['itemNo', 'itemName', 'supplierName', 'quantity', 'qtyMeasure', 'actions'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;
    selectedFile: File | null = null;
    previewUrl!: SafeUrl | null; 
    isFileSelected = false; 
    // item list
    selectedItem: string = '';
    allItemDropdown: any = [];
    itemDropdown: any = [];
    allItemListDetails: any;
    // supplier list
    selectedSupplier: string = '';
    allSupplierDropdown: any = [];
    supplierDropdown: any = [];
    allSupplierListDetails: any;

  constructor(
    private fb: FormBuilder, 
    private stocksService: StocksService, 
    private messageService: MessageServiceService,
    private itemsRegistrationService : ItemsRegistrationService,
    private supplierRegistrationService : SupplierRegistrationService
    ) {
      this.stocksForm = this.fb.group({
        itemNo : new FormControl('', [Validators.required]),
        itemName: new FormControl('', [Validators.required]),
        supplierName : new FormControl('', [Validators.required]),
        quantity : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
        qtyMeasure : new FormControl('', [Validators.required]),
      });
    }

  ngOnInit(): void{
    this.populateData();
    this.getItemList();
    this.getSupplierList();
  }

  // item list - dropdown list from payment
    public getItemList(): void {
    this.itemsRegistrationService.getData().subscribe((response: any) => {
      if (response && response.length > 0) {
        this.allItemListDetails = response;
        response.forEach((itm: any) => {
          const itemData = {
            id: itm.id,
            no: itm.itemNo
          };
          this.allItemDropdown.push(itemData);
        });
      }
      this.itemDropdown = this.allItemDropdown;
    });
  }

  // supplier list - dropdown list
  public getSupplierList(): void {
    this.supplierRegistrationService.getData().subscribe((response: any) => {
      if (response && response.length > 0) {
        this.allSupplierListDetails = response;
        response.forEach((supplier: any) => {
          const supplierData = {
            id: supplier.id,
            supplierName: supplier.supplierName
          };
          this.allSupplierDropdown.push(supplierData);
        });
      }
      this.supplierDropdown = this.allSupplierDropdown;
    });
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    public populateData(): void {
      try {
        this.stocksService.getData().subscribe({
          next: (dataList: any[]) => {
            if (dataList.length <=0) {
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
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.stocksForm.value);
  
          if (this.mode === 'add'){
            this.stocksService.serviceCall(this.stocksForm.value).subscribe({
              next: (response: any) => {
                if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
                  this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
                } else {
                    this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
                }        
        
                this.messageService.showSuccess('Data Saved Successfully!');  
              },
              error: (error) => {
                this.messageService.showError('Action Failed With Error' + error);
              }
            });
          }
          else if (this.mode === 'edit'){
            this.stocksService.editData(this.selectedData?.id, this.stocksForm.value).subscribe ({
              next: (response: any) => {
                let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
                this.dataSource.data[elementIndex] = response;
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.messageService.showSuccess('Data Edited Successfully!');
              },
              error: (error) => {
                this.messageService.showError('Action Failed With Error' + error);
              }
            });
          }
          this.mode = 'add';
          this.stocksForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.stocksForm.reset();
        this.saveButtonLabel = 'Save';
        this.stocksForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.stocksForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.stocksService.deleteData(id).subscribe ({
            next: (response: any) => {
              const index = this.dataSource.data.findIndex((element) => element.id === id);
    
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource (this.dataSource.data);
            this.messageService.showSuccess('Data Deleted Successfully!');
            },
            error: (error: any) => {
              this.messageService.showError('Action Failed With Error' + error);
            }
          });
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public refreshData(): void {
        this.populateData();
      }

    // Item Dropdown list
    onItemKey(eventTarget: any) {
    this.itemDropdown = this.itemSearch(eventTarget.value);
    }

    itemSearch(value: string) {
      let filter = value.toLowerCase();
       return this.allItemDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
    }

    public onItemSelect(event): void {
      let selectItmId = event;

      this.patchFormItmValues(selectItmId);
    }

  public patchFormItmValues(itemId: number): void {
    this.allItemListDetails.forEach((itm) => {
      if (itm.id === itemId) {
        this.stocksForm.patchValue({
          itemName: itm.itemName
        });
      }
    });
  }

    // Supplier Dropdown list
      onSupplierKey(eventTarget: any) {
      this.supplierDropdown = this.supplierSearch(eventTarget.value);
      }

      supplierSearch(value: string) {
      let filter = value.toLowerCase();
      return this.allSupplierDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
      }

      public onSupplierSelect(event): void {
      let selectedSupplierId = event;

      this.patchFormSupplierValues(selectedSupplierId);
      }

      public patchFormSupplierValues(supplierId: number): void {
        this.stocksForm.patchValue({
        supplierName: supplierId
        });
      }

}
