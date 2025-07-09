import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PaymentsService } from 'src/app/services/inventory/payments.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

export interface PeriodicElement {
  paymentNo: String;
  supplierName: string;
  amount: string;
  paymentDate: Date;
  paymentStatus: String;
}

const ELEMENT_DATA: any[] = [ 
  {itemNo: '001', supplierName: 'fish city', amount: '10000', paymentDate: '8/7/2025', paymentStatus: 'paid'},
];

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

    displayedColumns: string[] = ['paymentNo', 'supplierName', 'amount', 'paymentDate', 'paymentStatus', 'actions'];
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

    constructor(private fb: FormBuilder, private paymentsService: PaymentsService, private messageService: MessageServiceService, private sanitizer: DomSanitizer
      ) {
        this.paymentsForm = this.fb.group({
          paymentNo: new FormControl(''),
          itemNo : new FormControl(''),
          itemName: new FormControl(''),
          supplierName : new FormControl(''),
          quantity : new FormControl(''),
          amount : new FormControl(''),
          paymentDate: new FormControl(''),
          paymentStatus : new FormControl(''),
          paymentImage: new FormControl(''),
          paymentImageName: new FormControl(''),
          paymentImageType: new FormControl('')
        });
      }

    ngOnInit(): void{
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

      this.previewUrl = null;
      this.isFileSelected = false;
      this.paymentsForm.setErrors = null!;
      this.paymentsForm.updateValueAndValidity();
    }

    public editData(data: any): void {
      this.paymentsForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;

      const file = data.profileImage;
      const imageType = data.paymentImageImageType;
      this.previewUrl = `data:${imageType};base64,${file}`;
    }

    public deleteData(data: any): void {
      const id = data.id;
      
      try {
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
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public refreshData(): void {
      this.populateData();
    }

}
