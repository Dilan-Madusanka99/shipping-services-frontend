import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ItemsRegistrationService } from 'src/app/services/inventory/items-registration.service';
import { PaymentsService } from 'src/app/services/inventory/payments.service';
import { SupplierRegistrationService } from 'src/app/services/inventory/supplier-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  paymentImage: string;
  paymentNo: string;
  supplierName: string;
  amount: string;
  paymentDate: Date;
  paymentStatus: string;
}

const ELEMENT_DATA: any[] = [ 
  {paymentImage: 'image', paymentNo: '001', supplierName: 'fish city', amount: '10000', paymentDate: '8/7/2025', paymentStatus: 'paid'},
]; 

// validator for Payment Date (shoud not be future one)
export function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();

  // Remove time
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate <= today ? null : { futureDate: true };
}

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {

  paymentsForm : FormGroup;

    displayedColumns: string[] = ['paymentImage', 'paymentNo', 'supplierName', 'amount', 'paymentDate', 'paymentStatus', 'actions'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    submitted: boolean;
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
    supplierMap = new Map<number, string>();

    constructor(
      private fb: FormBuilder, 
      private paymentsService: PaymentsService, 
      private messageService: MessageServiceService, 
      private sanitizer: DomSanitizer,
      private itemRegistrationService: ItemsRegistrationService,
      private supplierRegistrationService: SupplierRegistrationService
      ) {
        this.paymentsForm = this.fb.group({
          paymentNo: new FormControl('', [Validators.required, Validators.pattern(/^[Pp][0-9]{3}$/)]),
          itemNo : new FormControl('', [Validators.required]),
          itemName: new FormControl({value: '', disabled: true}),
          supplierName : new FormControl('', [Validators.required]),
          quantity : new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
          qtyMeasure : new FormControl('', [Validators.required]),
          amount : new FormControl('', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]), // numbers & . min 1
          paymentDate: new FormControl('', [Validators.required, notFutureDateValidator]),
          paymentStatus : new FormControl('', [Validators.required]),
          paymentImage: new FormControl('', [Validators.required]),
          paymentImageName: new FormControl(''),
          paymentImageType: new FormControl('')
        });
      }

    ngOnInit(): void{
    this.populateData();
    this.getItemList();
    this.getSupplierList();
    }

    // item list - dropdown list
    public getItemList(): void {
    this.itemRegistrationService.getData().subscribe((response: any) => {
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
      this.paymentsService.getData(). subscribe({
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

    public preparePaymentsData(): FormData {
      const paymentsFormData = new FormData();
      paymentsFormData.append(
        'paymentsForm',
        new Blob([JSON.stringify(this.paymentsForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        paymentsFormData.append(
          'paymentImage',
          this.paymentsForm.get('paymentImage')?.value,
          this.paymentsForm.get('paymentImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.paymentsForm.get('paymentImage')?.value,
          this.paymentsForm.get('paymentImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.paymentsForm.get('paymentImageImageName')?.value,
          { type: this.paymentsForm.get('paymentImageImageType')?.value }
        );
        paymentsFormData.append('paymentImage', file, file.name);
      }
      return paymentsFormData;
    }

    base64ToBlob(base64: string, mimeType: string): Blob {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    }

    onFileSelected(event: any): void {

      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        this.previewUrl = url;
        this.isFileSelected = true;
        this.paymentsForm.get('paymentImage')?.setValue(file);
      }
    } 

  onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.paymentsForm.value);

        if(!this.paymentsForm.valid) return;
        if (this.mode === 'add'){
          this.paymentsService.serviceCall(
            this.preparePaymentsData() 
          ).subscribe({
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
          this.paymentsService.editData(
            this.selectedData?.id, this.preparePaymentsData() 
          ).subscribe ({
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
        this.paymentsForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public resetData(): void {
      this.paymentsForm.reset();
      this.saveButtonLabel = 'Save';
      this.paymentsForm.enable();
      this.isButtonDisabled = false;
      this.paymentsForm.get('itemName')?.disable();

      this.previewUrl = null;
      this.isFileSelected = false;
      this.paymentsForm.setErrors = null!;
      this.paymentsForm.updateValueAndValidity();
    }

    public editData(data: any): void {
      this.paymentsForm.patchValue(data);

      /* Disable Form */
      this.paymentsForm.get('quantity').disable();
      this.paymentsForm.get('quantity').updateValueAndValidity();

      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;

      const file = data.paymentImage;
      const imageType = data.paymentImageImageType;
      this.previewUrl = `data:${imageType};base64,${file}`;

      this.paymentsForm.patchValue({
      supplierName: +data.supplierName,
      paymentDate: new Date(data.paymentDate).toISOString().substring(0, 10),
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
                      
        this.paymentsService.deleteData(id).subscribe ({
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
       return this.allItemDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
    }

    public onItemSelect(event): void {
      let selectItmId = event;

      this.patchFormItmValues(selectItmId);
    }

  public patchFormItmValues(itemId: number): void {
    this.allItemListDetails.forEach((itm) => {
      if (itm.id === itemId) {
        this.paymentsForm.patchValue({
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
        this.paymentsForm.patchValue({
        supplierName: supplierId
        });
      }


}
