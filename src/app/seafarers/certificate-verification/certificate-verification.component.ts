import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { CertificateVerificationService } from 'src/app/services/seafarers/certificate-verification.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

export interface PeriodicElement {
  sidNo: string;
  certificateName: String;
  verificationStatus: String;
}

const ELEMENT_DATA: any[] = [ 
  {sidNo: 'S123', certificateName: 'SDSD', verificationStatus: 'cancelled'},
];

@Component({
  selector: 'app-certificate-verification',
  standalone: false,
  templateUrl: './certificate-verification.component.html',
  styleUrl: './certificate-verification.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateVerificationComponent {

  certificateVerificationForm : FormGroup;

  displayedColumns: string[] = ['sidNo', 'certificateName', 'verificationStatus', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  selected: string;
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  submitted: boolean;
  selectedFile: File | null = null;
  previewUrl!: SafeUrl | null;
  isFileSelected = false;
  selectedSeafarers: string = '';
  allSeafarersDropdown: any = [];  // sid link
  seafarersDropdown: any = []; 
  allSeafarersListDetails: any;   
  sidMap = new Map<number, string>();
  
constructor(
  private fb: FormBuilder, 
  private certificateVerificationService: CertificateVerificationService,
  private messageService: MessageServiceService, 
  private sanitizer: DomSanitizer,
  private seafarerService: SeafarersServiceService
) {
      this.certificateVerificationForm = this.fb.group({
        
        sidNo: new FormControl ('', [Validators.required]),
        certificateName: new FormControl('', [Validators.required]),
        profileImage: new FormControl('', [Validators.required]),
        profileImageName: new FormControl(''),
        profileImageType: new FormControl(''),
        verificationStatus: new FormControl('', [Validators.required]),
      });
    }

  ngOnInit(): void{
   this.populateData();
   this.getSeafarersList();
  }
  
  public getSeafarersList(): void {
    this.seafarerService.getData().subscribe((response: any) => {
      if (response && response.length > 0) {
        this.allSeafarersListDetails = response;
        response.forEach((seafarers: any) => {
          const seafarersData = {
            id: seafarers.id,
            sidNo: seafarers.sidNo
          };
          this.allSeafarersDropdown.push(seafarersData);
        });
      }
      this.seafarersDropdown = this.allSeafarersDropdown;
      this.createSidMap();
    });
  }

  public createSidMap(): void {
    this.allSeafarersListDetails.forEach((seaFarer: any) => {
      this.sidMap.set(seaFarer.id, seaFarer.sidNo);
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
        this.certificateVerificationService.getData(). subscribe({
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
      const certificateVerificationFormData = new FormData();
      certificateVerificationFormData.append(
        'certificateVerificationForm',
        new Blob([JSON.stringify(this.certificateVerificationForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        certificateVerificationFormData.append(
          'profileImage',
          this.certificateVerificationForm.get('profileImage')?.value,
          this.certificateVerificationForm.get('profileImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.certificateVerificationForm.get('profileImage')?.value,
          this.certificateVerificationForm.get('profileImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.certificateVerificationForm.get('profileImageImageName')?.value,
          { type: this.certificateVerificationForm.get('profileImageImageType')?.value }
        );
        certificateVerificationFormData.append('profileImage', file, file.name);
      }
      return certificateVerificationFormData;
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
        this.certificateVerificationForm.get('profileImage')?.setValue(file);
      }
    }
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.certificateVerificationForm.value);
  
          if(!this.certificateVerificationForm.valid) return;
          if (this.mode === 'add'){
            this.certificateVerificationService.serviceCall(
              this.prepareSeafarerData()   // Photo upload [start]
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
            this.certificateVerificationService.editData(
              this.selectedData?.id, this.prepareSeafarerData()
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
          this.certificateVerificationForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.certificateVerificationForm.reset();
        this.saveButtonLabel = 'Save';
        this.certificateVerificationForm.enable();
        this.isButtonDisabled = false;

        this.previewUrl = null;
        this.isFileSelected = false;
        this.certificateVerificationForm.setErrors = null!;
        this.certificateVerificationForm.updateValueAndValidity();
      }
  
      public editData(data: any): void {
        this.certificateVerificationForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;

        const file = data.profileImage;
        const imageType = data.profileImageType;
        this.previewUrl = `data:${imageType};base64,${file}`;

        this.certificateVerificationForm.patchValue({
        sidNo: +data.sidNo,
        });
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.certificateVerificationService.deleteData(id).subscribe ({
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

      onKey(eventTarget: any) {
    this.seafarersDropdown = this.search(eventTarget.value);
    }

    search(value: string) {
    let filter = value.toLowerCase();
    return this.allSeafarersDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
    }

    public onSeafarersSelect(event): void {
      let selectedSeafarersId = event;

    this.patchFormSeafarersValues(selectedSeafarersId);
    }

    public patchFormSeafarersValues(seafarersId: number): void {
      this.certificateVerificationForm.patchValue({
        sidNo: seafarersId
      });
    }
          
}

