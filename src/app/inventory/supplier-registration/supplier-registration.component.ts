import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SupplierRegistrationService } from 'src/app/services/inventory/supplier-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  supplierNo: String;
  supplierName: string;
  supplierCategory: String;
  supplierContactNo: String;
}

const ELEMENT_DATA: any[] = [ 
  {supplierNo: 'S01', supplierName: 'Fish City', supplierCategory: 'Foods', supplierContactNo: '0112674644'},
];

@Component({
  selector: 'app-supplier-registration',
  standalone: false,
  templateUrl: './supplier-registration.component.html',
  styleUrl: './supplier-registration.component.scss'
})
export class SupplierRegistrationComponent {

  supplierRegistrationForm : FormGroup;

  displayedColumns: string[] = ['supplierNo', 'supplierName', 'supplierCategory', 'supplierContactNo', 'actions'];
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

  constructor(
    private fb: FormBuilder, 
    private supplierRegistrationService: SupplierRegistrationService, 
    private messageService: MessageServiceService, 
    private sanitizer: DomSanitizer
      ) {
      this.supplierRegistrationForm = this.fb.group({
        profileImage: new FormControl('', [Validators.required]),
        profileImageName: new FormControl(''),
        profileImageType: new FormControl(''),
        supplierNo: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        supplierName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern(/^[A-Za-z0-9.,\- ]+$/)]),
        supplierCategory: new FormControl('', [Validators.required]),
        supplierSubCategory: new FormControl('', [Validators.minLength(1), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9.,\- ]+$/)]),
        supplierContactNo: new FormControl('', [Validators.required, Validators.pattern(/^0\d{9}$/)]),
        supplierEmail: new FormControl('', [Validators.required, Validators.email]), 
        supplierAccName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern(/^[A-Za-z0-9.,\- ]+$/)]),
        supplierAccNo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^\d+$/)]),
        supplierBank: new FormControl('', [Validators.required]),
        supplierBranch: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z. ]+$/)]),
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
      this.supplierRegistrationService.getData(). subscribe({
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

    public prepareSupplierData(): FormData {
      const supplierRegistrationFormData = new FormData();
      supplierRegistrationFormData.append(
        'supplierRegistrationForm',
        new Blob([JSON.stringify(this.supplierRegistrationForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        supplierRegistrationFormData.append(
          'profileImage',
          this.supplierRegistrationForm.get('profileImage')?.value,
          this.supplierRegistrationForm.get('profileImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.supplierRegistrationForm.get('profileImage')?.value,
          this.supplierRegistrationForm.get('profileImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.supplierRegistrationForm.get('profileImageImageName')?.value,
          { type: this.supplierRegistrationForm.get('profileImageImageType')?.value }
        );
        supplierRegistrationFormData.append('profileImage', file, file.name);
      }
      return supplierRegistrationFormData;
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
        this.supplierRegistrationForm.get('profileImage')?.setValue(file);
      }
    }

  onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.supplierRegistrationForm.value);

        if(!this.supplierRegistrationForm.valid) return;
        if (this.mode === 'add'){
          this.supplierRegistrationService.serviceCall(
            this.prepareSupplierData()
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
          this.supplierRegistrationService.editData(
            this.selectedData?.id, this.prepareSupplierData() 
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
        this.supplierRegistrationForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public resetData(): void {
      this.supplierRegistrationForm.reset();
      this.saveButtonLabel = 'Save';
      this.supplierRegistrationForm.enable();
      this.isButtonDisabled = false;

      this.previewUrl = null;
      this.isFileSelected = false;
      this.supplierRegistrationForm.setErrors = null!;
      this.supplierRegistrationForm.updateValueAndValidity();
    }

    public editData(data: any): void {
      this.supplierRegistrationForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;

      const file = data.profileImage;
      const imageType = data.profileImageType;
      this.previewUrl = `data:${imageType};base64,${file}`;

      this.supplierRegistrationForm.controls['supplierBank'].setValue(data.supplierBank) // supplier bank patch edit
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
        this.supplierRegistrationService.deleteData(id).subscribe ({
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
  
}
