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
import Swal from 'sweetalert2';

export interface PeriodicElement {
  itemNo: String;
  itemName: string;
  supplierName: String;
  quantity: String;
  qtyMeasure: String;
}

const ELEMENT_DATA: any[] = [ 
  {itemNo: '001', itemName: 'fish', supplierName: 'fish city', quantity: '10',},
];

@Component({
  selector: 'app-stocks',
  standalone: false,
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent {

  stocksForm : FormGroup;

    displayedColumns: string[] = ['itemNo', 'itemName', 'supplierName', 'quantity', 'actions'];
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
    itemMap = new Map<number, string>();
    supplierMap = new Map<number, string>();

  constructor(
    private fb: FormBuilder, 
    private stocksService: StocksService, 
    private messageService: MessageServiceService,
    private itemsRegistrationService : ItemsRegistrationService,
    private supplierRegistrationService : SupplierRegistrationService
    ) {
      this.stocksForm = this.fb.group({
        itemNo : new FormControl('', [Validators.required, ]),
        itemName: new FormControl({value: '', disabled: true}),
        supplierName : new FormControl('', [Validators.required]),
        quantity : new FormControl('', [Validators.required, Validators.min(0)]),
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
      this.createItemMap();
    });
  }

  public createItemMap(): void {
    this.allItemListDetails.forEach((item: any) => {
      this.itemMap.set(item.id, item.itemNo);
    });
    this.populateData();
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
      this.createSupplierMap();
    });
  }

  public createSupplierMap(): void {
    this.allSupplierListDetails.forEach((supplier: any) => {
      this.supplierMap.set(supplier.id, supplier.supplierName);
    });
    this.populateData();
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
  
          if(!this.stocksForm.valid) return;
          if (this.mode === 'add'){
            this.stocksService.serviceCall(this.stocksForm.getRawValue()).subscribe({
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
            this.stocksService.editData( this.selectedData?.id, this.stocksForm.getRawValue()).subscribe ({
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
        this.stocksForm.get('itemName')?.disable();
      }
  
      public editData(data: any): void {
        this.stocksForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;

        this.stocksForm.patchValue({
        itemNo: +data.itemNo,
        supplierName: +data.supplierName
        });
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
            Swal.fire({
              title: 'Are you sure?',
              text: 'You want to delete this?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result && !result.isConfirmed) {
                return;
              }
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
       return this.allItemDropdown.filter((option: any) => option.itemNo.toLowerCase().startsWith(filter));
    }

    public onItemSelect(event): void {
      let selectItemId = event;
      this.patchFormItemValues(selectItemId);
    }

  public patchFormItemValues(itemId: number): void {
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
      return this.allSupplierDropdown.filter((option: any) => option.supplierName.toLowerCase().startsWith(filter));
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
