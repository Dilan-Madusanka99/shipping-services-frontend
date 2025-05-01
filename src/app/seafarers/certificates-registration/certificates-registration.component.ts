import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { CertificatesRegistrationService } from 'src/app/services/seafarers/certificates-registration.service';

export interface PeriodicElement {
  ecName: string;
  cIssuedDate: Date;
  cExpiredDate: Date;
  verificationStatus: String;
}

const ELEMENT_DATA: any[] = [ 
  {cName: 'AFF', cIssuedDate: '07/04/2025', cExpiredDate: '07/04/2030', verificationStatus: 'verified'},
];

@Component({
  selector: 'app-certificates-registration',
  standalone: false,
  templateUrl: './certificates-registration.component.html',
  styleUrl: './certificates-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificatesRegistrationComponent {

  certificatesRegistrationForm : FormGroup;
    
    displayedColumns: string[] = ['cName', 'cIssuedDate', 'cExpiredDate', 'verificationStatus', 'actions'];
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
  
    constructor(private fb: FormBuilder, private seafarersService: CertificatesRegistrationService, private messageService: MessageServiceService, private sanitizer: DomSanitizer) {
      this.certificatesRegistrationForm = this.fb.group({
        certificateImage: new FormControl(''),
        certificateImageName: new FormControl(''),
        certificateImageType: new FormControl(''),
        sidNo: new FormControl(''),
        cName: new FormControl(''),
        cNo: new FormControl(''),
        cIssuedPlace: new FormControl(''),
        cIssuedDate: new FormControl(''),
        cExpiredDate: new FormControl(''),
        verificationStatus: new FormControl('')    
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
        this.seafarersService.getData(). subscribe({
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

    public prepareSeafarerData(): FormData {
      const certificatesRegistrationFormData = new FormData();
      certificatesRegistrationFormData.append(
        'certificatesRegistrationForm',
        new Blob([JSON.stringify(this.certificatesRegistrationForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        certificatesRegistrationFormData.append(
          'certificateImage',
          this.certificatesRegistrationForm.get('certificateImage')?.value,
          this.certificatesRegistrationForm.get('certificateImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.certificatesRegistrationForm.get('certificateImage')?.value,
          this.certificatesRegistrationForm.get('certificateImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.certificatesRegistrationForm.get('certificateImageImageName')?.value,
          { type: this.certificatesRegistrationForm.get('certificateImageImageType')?.value }
        );
        certificatesRegistrationFormData.append('certificateImage', file, file.name);
      }
      return certificatesRegistrationFormData;
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
        this.certificatesRegistrationForm.get('certificateImage')?.setValue(file);
      }
    }
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.certificatesRegistrationForm.value);
  
          if (this.mode === 'add'){
            this.seafarersService.serviceCall(this.prepareSeafarerData()).subscribe({
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
            this.seafarersService.editData(this.selectedData?.id, this.prepareSeafarerData()).subscribe ({
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
          this.certificatesRegistrationForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.certificatesRegistrationForm.reset();
        this.saveButtonLabel = 'Save';
        this.certificatesRegistrationForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.certificatesRegistrationForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.seafarersService.deleteData(id).subscribe ({
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
