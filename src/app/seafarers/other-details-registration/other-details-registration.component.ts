import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OtherDetailsRegistrationService } from 'src/app/services/seafarers/other-details-registration.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  sidNo: String;
  ppNo: string;
  cdcNo: string;
  yellowFeverNo: string;
}

const ELEMENT_DATA: any[] = [{ sidno: '123', ppNo: 'N123', cdcNo: 'C123', yellowFeverNo: 'AB123' }];

// validator for issued date (shoud not be future one)
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

// validator for expired date (only future dates)
export function futureDateValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate > today ? null : { pastDate: true };
}

@Component({
  selector: 'app-other-details-registration',
  standalone: false,
  templateUrl: './other-details-registration.component.html',
  styleUrl: './other-details-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherDetailsRegistrationComponent {
  otherDetailsRegistrationForm: FormGroup;

  displayedColumns: string[] = ['sidNo', 'ppNo', 'cdcNo', 'yellowFeverNo', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: string;
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  selectedFile: File | null = null;
  previewUrlSid: SafeUrl | null;
  previewUrlPp: SafeUrl | null;
  previewUrlCdc: SafeUrl | null;
  previewUrlYf: SafeUrl | null;
  isSidFileSelected = false;
  isSPpFileSelected = false;
  isCdcFileSelected = false;
  isYfFileSelected = false;
  selectedSeafarers: string = '';
  allSeafarersDropdown: any = []; // sid link
  seafarersDropdown: any = [];
  allSeafarersListDetails: any;
  sidMap = new Map<number, string>();
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private seafarersService: OtherDetailsRegistrationService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer,
    private otherDetailsService: SeafarersServiceService // sid link
  ) {
    this.otherDetailsRegistrationForm = this.fb.group({
      sidImage: new FormControl('', [Validators.required]),
      sidImageName: new FormControl(''),
      sidImageType: new FormControl(''),
      sidNo: new FormControl('', [Validators.required]),
      sidIssuedPlace: new FormControl({ value: 'Colombo', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      sidIssuedDate: new FormControl('', [Validators.required, notFutureDateValidator]),
      sidExpireDate: new FormControl('', [Validators.required, futureDateValidator]),
      ppImage: new FormControl('', [Validators.required]),
      ppImageName: new FormControl(''),
      ppImageType: new FormControl(''),
      ppNo: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[NnPp]\d+$/)]),
      ppIssuedPlace: new FormControl({ value: 'Colombo', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      ppIssuedDate: new FormControl('', [Validators.required, notFutureDateValidator]),
      ppExpireDate: new FormControl('', [Validators.required, futureDateValidator]),
      cdcImage: new FormControl('', [Validators.required]),
      cdcImageName: new FormControl(''),
      cdcImageType: new FormControl(''),
      cdcNo: new FormControl('C', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[Cc]\d+$/)]),
      cdcIssuedPlace: new FormControl({ value: 'Colombo', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      cdcIssuedDate: new FormControl('', [Validators.required, notFutureDateValidator]),
      cdcExpireDate: new FormControl('', [Validators.required, futureDateValidator]),
      yellowFeverImage: new FormControl('', [Validators.required]),
      yellowFeverImageName: new FormControl(''),
      yellowFeverImageType: new FormControl(''),
      yellowFeverNo: new FormControl('AB', [Validators.required, Validators.maxLength(10), Validators.pattern(/^AB\d+$/i)]),
      yellowFeverIssuedPlace: new FormControl({ value: 'Colombo', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      yellowFeverIssuedDate: new FormControl('', [Validators.required, notFutureDateValidator]),
      yellowFeverExpireDate: new FormControl('', [Validators.required, futureDateValidator])
    });
  }

  ngOnInit(): void {
    this.getSeafarersList();
  }

  public getSeafarersList(): void {
    this.otherDetailsService.getData().subscribe((response: any) => {
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
      if (window.localStorage.getItem('role') === 'SEAFARER') {
        /* If the role is seafarer then get only details related to SID no*/ 
        this.seafarersService.getSeafarerData(window.localStorage.getItem('sid')).subscribe({
          next: (data) => {
            if (!data) {
              return;
            }

            this.dataSource = new MatTableDataSource([data]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.mode = 'edit';
            this.saveButtonLabel = 'Edit';

            this.editData(data);
            this.otherDetailsRegistrationForm.get('sidNo')?.disable();
          },
          error: (error) => {
            const errorMessage = error;
            if (errorMessage.replace(/\s+/g, ' ').includes('Seafarers Registration Does Not Exists')) {
              this.messageService.showWarn('Please add your data!');
            } else {
              this.messageService.showError('Action Failed With Error ' + error);
            }
          }
        });
      } else {
        this.seafarersService.getData().subscribe({
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
      }
    } catch (error) {
      this.messageService.showError('Action Failed With Error ' + error);
    }
  }

  public prepareSeafarerData(): FormData {
    const otherDetailsRegistrationFormData = new FormData();
    otherDetailsRegistrationFormData.append(
      'otherDetailsRegistrationForm',
      new Blob([JSON.stringify(this.otherDetailsRegistrationForm.value)], {
        type: 'application/json'
      })
    );
    // SID upload
    if (this.isSidFileSelected) {
      otherDetailsRegistrationFormData.append(
        'sidImage',
        this.otherDetailsRegistrationForm.get('sidImage')?.value,
        this.otherDetailsRegistrationForm.get('sidImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.otherDetailsRegistrationForm.get('sidImage')?.value,
        this.otherDetailsRegistrationForm.get('sidImageImageType')?.value
      );
      const file = new File([imageBlob], this.otherDetailsRegistrationForm.get('sidImageImageName')?.value, {
        type: this.otherDetailsRegistrationForm.get('sidImageImageType')?.value
      });
      otherDetailsRegistrationFormData.append('sidImage', file, file.name);
    }

    // Passport upload
    if (this.isSPpFileSelected) {
      otherDetailsRegistrationFormData.append(
        'ppImage',
        this.otherDetailsRegistrationForm.get('ppImage')?.value,
        this.otherDetailsRegistrationForm.get('ppImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.otherDetailsRegistrationForm.get('ppImage')?.value,
        this.otherDetailsRegistrationForm.get('ppImageImageType')?.value
      );
      const file = new File([imageBlob], this.otherDetailsRegistrationForm.get('ppImageImageName')?.value, {
        type: this.otherDetailsRegistrationForm.get('ppImageImageType')?.value
      });
      otherDetailsRegistrationFormData.append('ppImage', file, file.name);
    }

    // CDC upload
    if (this.isCdcFileSelected) {
      otherDetailsRegistrationFormData.append(
        'cdcImage',
        this.otherDetailsRegistrationForm.get('cdcImage')?.value,
        this.otherDetailsRegistrationForm.get('cdcImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.otherDetailsRegistrationForm.get('cdcImage')?.value,
        this.otherDetailsRegistrationForm.get('cdcImageImageType')?.value
      );
      const file = new File([imageBlob], this.otherDetailsRegistrationForm.get('cdcImageImageName')?.value, {
        type: this.otherDetailsRegistrationForm.get('cdcImageImageType')?.value
      });
      otherDetailsRegistrationFormData.append('cdcImage', file, file.name);
    }

    // Yellow Fever upload
    if (this.isYfFileSelected) {
      otherDetailsRegistrationFormData.append(
        'yellowFeverImage',
        this.otherDetailsRegistrationForm.get('yellowFeverImage')?.value,
        this.otherDetailsRegistrationForm.get('yellowFeverImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.otherDetailsRegistrationForm.get('yellowFeverImage')?.value,
        this.otherDetailsRegistrationForm.get('yellowFeverImageImageType')?.value
      );
      const file = new File([imageBlob], this.otherDetailsRegistrationForm.get('yellowFeverImageImageName')?.value, {
        type: this.otherDetailsRegistrationForm.get('yellowFeverImageImageType')?.value
      });
      otherDetailsRegistrationFormData.append('yellowFeverImage', file, file.name);
    }
    return otherDetailsRegistrationFormData;
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

  onSidFileSelected(event: any, imageType: string): void {
    if ((imageType = 'sidImage')) {
      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.previewUrlSid = url;
        this.isSidFileSelected = true;
        this.otherDetailsRegistrationForm.get('sidImage')?.setValue(file);
      }
    }
  }

  onPpFileSelected(event: any, imageType: string): void {
    if ((imageType = 'ppImage')) {
      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.previewUrlPp = url;
        this.isSPpFileSelected = true;
        this.otherDetailsRegistrationForm.get('ppImage')?.setValue(file);
      }
    }
  }

  onCdcFileSelected(event: any, imageType: string): void {
    if ((imageType = 'cdcImage')) {
      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.previewUrlCdc = url;
        this.isCdcFileSelected = true;
        this.otherDetailsRegistrationForm.get('cdcImage')?.setValue(file);
      }
    }
  }

  onYfFileSelected(event: any, imageType: string): void {
    if ((imageType = 'yellowFeverImage')) {
      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.previewUrlYf = url;
        this.isYfFileSelected = true;
        this.otherDetailsRegistrationForm.get('yellowFeverImage')?.setValue(file);
      }
    }
  }

  onSubmit() {
    try {
      console.log('mode' + this.mode);
      console.log('Form Submitted');
      console.log(this.otherDetailsRegistrationForm.value);

      if (!this.otherDetailsRegistrationForm.valid) return;
      if (this.mode === 'add') {
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
      } else if (this.mode === 'edit') {
        this.seafarersService.editData(this.selectedData?.id, this.prepareSeafarerData()).subscribe({
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
      this.otherDetailsRegistrationForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public resetData(): void {
    this.otherDetailsRegistrationForm.reset();
    this.saveButtonLabel = 'Save';
    this.otherDetailsRegistrationForm.enable();
    this.isButtonDisabled = false;

    this.previewUrlSid = null;
    this.isSidFileSelected = false;
    this.otherDetailsRegistrationForm.setErrors = null!;
    this.otherDetailsRegistrationForm.updateValueAndValidity();
    this.otherDetailsRegistrationForm.get('sidIssuedPlace')?.disable();

    this.previewUrlPp = null;
    this.isSPpFileSelected = false;
    this.otherDetailsRegistrationForm.setErrors = null!;
    this.otherDetailsRegistrationForm.updateValueAndValidity();
    this.otherDetailsRegistrationForm.get('ppIssuedPlace')?.disable();

    this.previewUrlCdc = null;
    this.isCdcFileSelected = false;
    this.otherDetailsRegistrationForm.setErrors = null!;
    this.otherDetailsRegistrationForm.updateValueAndValidity();
    this.otherDetailsRegistrationForm.get('cdcIssuedPlace')?.disable();

    this.previewUrlYf = null;
    this.isYfFileSelected = false;
    this.otherDetailsRegistrationForm.setErrors = null!;
    this.otherDetailsRegistrationForm.updateValueAndValidity();
    this.otherDetailsRegistrationForm.get('yellowFeverIssuedPlace')?.disable();

    if (window.localStorage.getItem('role') === 'SEAFARER' && this.dataSource?.data?.length > 0) {
      this.mode = 'edit';
      this.saveButtonLabel = 'Edit';
      this.otherDetailsRegistrationForm.get('sidNo')?.disable();
    } else if (window.localStorage.getItem('role') === 'SEAFARER' && this.dataSource?.data?.length == 0) {
      this.mode = 'add';
      this.saveButtonLabel = 'Save';
    } else {
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.otherDetailsRegistrationForm.get('sidNo')?.disable();
    }
  }

  public editData(data: any): void {
    console.log(data);
    this.otherDetailsRegistrationForm.patchValue(data);
    this.otherDetailsRegistrationForm.patchValue({
      users: +data.users
    });
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;

    const sidImageFile = data.sidImage;
    const sidImageType = data.sidImageImageType;
    this.previewUrlSid = `data:${sidImageType};base64,${sidImageFile}`;

    const ppImageFile = data.ppImage;
    const ppImageType = data.ppImageImageType;
    this.previewUrlPp = `data:${ppImageType};base64,${ppImageFile}`;

    const cdcImageFile = data.cdcImage;
    const cdcImageType = data.cdcImageImageType;
    this.previewUrlCdc = `data:${cdcImageType};base64,${cdcImageFile}`;

    const yellowFeverImageFile = data.yellowFeverImage;
    const yellowFeverImageType = data.yellowFeverImageImageType;
    this.previewUrlYf = `data:${yellowFeverImageType};base64,${yellowFeverImageFile}`;

    this.otherDetailsRegistrationForm.patchValue({
    sidNo: +data.sidNo,
    sidIssuedDate: new Date(data.sidIssuedDate).toISOString().substring(0, 10),
    sidExpireDate: new Date(data.sidExpireDate).toISOString().substring(0, 10),
    ppIssuedDate: new Date(data.ppIssuedDate).toISOString().substring(0, 10),
    ppExpireDate: new Date(data.ppExpireDate).toISOString().substring(0, 10),
    cdcIssuedDate: new Date(data.cdcIssuedDate).toISOString().substring(0, 10),
    cdcExpireDate: new Date(data.cdcExpireDate).toISOString().substring(0, 10),
    yellowFeverIssuedDate: new Date(data.yellowFeverIssuedDate).toISOString().substring(0, 10),
    yellowFeverExpireDate: new Date(data.yellowFeverExpireDate).toISOString().substring(0, 10),
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
            
      this.seafarersService.deleteData(id).subscribe({
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

  onKey(eventTarget: any) {
    this.seafarersDropdown = this.search(eventTarget.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.allSeafarersDropdown.filter((option: any) => option.sidNo.toLowerCase().startsWith(filter));
  }

  public onSeafarersSelect(event): void {
    let selectedSeafarersId = event;

    this.patchFormSeafarersValues(selectedSeafarersId);
  }

  public patchFormSeafarersValues(seafarersId: number): void {
    this.otherDetailsRegistrationForm.patchValue({
      sidNo: seafarersId
    });
  }
}
