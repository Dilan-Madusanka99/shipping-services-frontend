import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { VesselRegistrationService } from 'src/app/services/vessels/vessel-registration.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  profileImage: string;
  vesselName: string;
  imoNo: String;
  vesselType: string;
  flag: string;
}

const ELEMENT_DATA: any[] = [{ profileImage: 'Image', vesselName: 'Dacil', imoNo: 'souselas', vesselType: 'bulk', flag: 'portugal' }];

@Component({
  selector: 'app-vessel-registration',
  standalone: false,
  templateUrl: './vessel-registration.component.html',
  styleUrl: './vessel-registration.component.scss'
})
export class VesselRegistrationComponent implements OnInit {
  vesselRegistrationForm: FormGroup;

  displayedColumns: string[] = ['profileImage', 'vesselName', 'imoNo', 'vesselType', 'flag', 'actions'];
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
    private vesselRegistrationService: VesselRegistrationService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer
  ) {
    this.vesselRegistrationForm = this.fb.group({
      profileImage: new FormControl('', [Validators.required]),
      profileImageName: new FormControl(''),
      profileImageType: new FormControl(''),
      vesselName: new FormControl('', [Validators.required, ]),
      imoNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      vesselType: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z /]+$/)]),
      flag: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z ]+$/)]),
      yob: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
      grt: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      bhp: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
    });
  }

  ngOnInit(): void {
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
      this.vesselRegistrationService.getData().subscribe({
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

  public prepareVesselsData(): FormData {
    const vesselRegistrationFormData = new FormData();
    vesselRegistrationFormData.append(
      'vesselRegistrationForm',
      new Blob([JSON.stringify(this.vesselRegistrationForm.value)], {
        type: 'application/json'
      })
    );

    if (this.isFileSelected) {
      vesselRegistrationFormData.append(
        'profileImage',
        this.vesselRegistrationForm.get('profileImage')?.value,
        this.vesselRegistrationForm.get('profileImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.vesselRegistrationForm.get('profileImage')?.value,
        this.vesselRegistrationForm.get('profileImageImageType')?.value
      );
      const file = new File([imageBlob], this.vesselRegistrationForm.get('profileImageImageName')?.value, {
        type: this.vesselRegistrationForm.get('profileImageImageType')?.value
      });
      vesselRegistrationFormData.append('profileImage', file, file.name);
    }
    return vesselRegistrationFormData;
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
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.previewUrl = url;
      this.isFileSelected = true;
      this.vesselRegistrationForm.get('profileImage')?.setValue(file);
    }
  }

  onSubmit() {
    try {
      console.log('mode' + this.mode);
      console.log('Form Submitted');
      console.log(this.vesselRegistrationForm.value);

      if(!this.vesselRegistrationForm.valid) return;
      if (this.mode === 'add') {
        this.vesselRegistrationService.serviceCall(this.prepareFormData()).subscribe({
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
      } else if (this.mode === 'edit') {
        this.vesselRegistrationService.editData(this.selectedData?.id, this.prepareFormData()).subscribe({
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
      this.vesselRegistrationForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public resetData(): void {
    this.vesselRegistrationForm.reset();
    this.saveButtonLabel = 'Save';
    this.vesselRegistrationForm.enable();
    this.isButtonDisabled = false;

    this.previewUrl = null;
    this.isFileSelected = false;
    this.vesselRegistrationForm.setErrors = null!;
    this.vesselRegistrationForm.updateValueAndValidity();
  }

  public editData(data: any): void {
    this.vesselRegistrationForm.patchValue(data);
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
            
      this.vesselRegistrationService.deleteData(id).subscribe({
        next: (response: any) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);

          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
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

  public prepareFormData(): FormData {
    const vesselFormData = new FormData();
    vesselFormData.append(
      'vesselRegistrationForm',
      new Blob([JSON.stringify(this.vesselRegistrationForm.value)], {
        type: 'application/json'
      })
    );

    if (this.isFileSelected) {
      vesselFormData.append(
        'profileImage',
        this.vesselRegistrationForm.get('profileImage')?.value,
        this.vesselRegistrationForm.get('profileImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.vesselRegistrationForm.get('profileImage')?.value,
        this.vesselRegistrationForm.get('profileImageImageType')?.value
      );
      const file = new File([imageBlob], this.vesselRegistrationForm.get('profileImageImageName')?.value, {
        type: this.vesselRegistrationForm.get('profileImageImageType')?.value
      });
      vesselFormData.append('profileImage', file, file.name);
    }
    return vesselFormData;
  }
}
