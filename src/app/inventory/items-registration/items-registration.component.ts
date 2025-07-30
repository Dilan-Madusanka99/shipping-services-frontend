import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ItemsRegistrationService } from 'src/app/services/inventory/items-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  itemNo: String;
  itemName: string;
  itemCategory: string;
} 

const ELEMENT_DATA: any[] = [ 
  {itemNo: 1, itemName: 'bearing', itemCategory: 'engine stores'},
];

@Component({
  selector: 'app-items-registration',
  standalone: false,
  templateUrl: './items-registration.component.html',
  styleUrl: './items-registration.component.scss'
})
export class ItemsRegistrationComponent {

  itemsRegistrationForm : FormGroup;

  displayedColumns: string[] = ['itemNo', 'itemName', 'itemCategory', 'actions'];
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

  constructor(private fb: FormBuilder, private itemsRegistrationService: ItemsRegistrationService, private messageService: MessageServiceService, private sanitizer: DomSanitizer
  ) {
      this.itemsRegistrationForm = this.fb.group({
        
        itemNo: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        emNo: new FormControl('', [Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        itemName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9.,\- ]+$/)]),
        itemCategory: new FormControl('', [Validators.required]),
        profileImage: new FormControl('', [Validators.required]),
        profileImageName: new FormControl(''),
        profileImageType: new FormControl('')
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
      this.itemsRegistrationService.getData(). subscribe({
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

    public prepareItemRegistrationData(): FormData {
      const itemsRegistrationFormData = new FormData();
      itemsRegistrationFormData.append(
        'itemsRegistrationForm',
        new Blob([JSON.stringify(this.itemsRegistrationForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        itemsRegistrationFormData.append(
          'profileImage',
          this.itemsRegistrationForm.get('profileImage')?.value,
          this.itemsRegistrationForm.get('profileImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.itemsRegistrationForm.get('profileImage')?.value,
          this.itemsRegistrationForm.get('profileImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.itemsRegistrationForm.get('profileImageImageName')?.value,
          { type: this.itemsRegistrationForm.get('profileImageImageType')?.value }
        );
        itemsRegistrationFormData.append('profileImage', file, file.name);
      }
      return itemsRegistrationFormData;
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
        this.itemsRegistrationForm.get('profileImage')?.setValue(file);
      }
    }

  onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.itemsRegistrationForm.value);

        if(!this.itemsRegistrationForm.valid) return;
        if (this.mode === 'add'){
          this.itemsRegistrationService.serviceCall(
            this.prepareItemRegistrationData() 
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
          this.itemsRegistrationService.editData(
            this.selectedData?.id, this.prepareItemRegistrationData() 
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
        this.itemsRegistrationForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public resetData(): void {
      this.itemsRegistrationForm.reset();
      this.saveButtonLabel = 'Save';
      this.itemsRegistrationForm.enable();
      this.isButtonDisabled = false;

      this.previewUrl = null;
      this.isFileSelected = false;
      this.itemsRegistrationForm.setErrors = null!;
      this.itemsRegistrationForm.updateValueAndValidity();
    }

    public editData(data: any): void {
      this.itemsRegistrationForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;

      const file = data.profileImage;
      const imageType = data.profileImageType;
      this.previewUrl = `data:${imageType};base64,${file}`;
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
        this.itemsRegistrationService.deleteData(id).subscribe ({
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
