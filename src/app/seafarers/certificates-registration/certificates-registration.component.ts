import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
    previewUrl: string | ArrayBuffer | null = null;
  
    constructor(private fb: FormBuilder, private seafarersService: CertificatesRegistrationService, private messageService: MessageServiceService) {
      this.certificatesRegistrationForm = this.fb.group({
        certificateImage: new FormControl(''),
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

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
  
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
  
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.certificatesRegistrationForm.value);
  
          if (this.mode === 'add'){
            this.seafarersService.serviceCall(this.certificatesRegistrationForm.value).subscribe({
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
            this.seafarersService.editData(this.selectedData?.id, this.certificatesRegistrationForm.value).subscribe ({
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
