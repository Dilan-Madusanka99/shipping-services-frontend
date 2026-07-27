import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  profileImage: string;
  sidno: string;
  position: string;
  surname: string;
  mobile: string;
  appliedDate: Date;
}

const ELEMENT_DATA: any[] = [{ profileImage: 'Image', sidno: '100', position: 'AB', surname: 'Fernando', mobile: '076', appliedDate: '07/04/2025' }];

// available date validator (only future dates)
export function futureDateValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();

  // Remove time part
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today ? null : { pastDate: true };
}

// DOB validation (above 18 years)
  export function ageValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const dob = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underAge: true };
  }

@Component({
  selector: 'app-seafarers-registration',
  standalone: false,
  templateUrl: './seafarers-registration.component.html',
  styleUrl: './seafarers-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeafarersRegistrationComponent {
  seafarersForm: FormGroup;

  displayedColumns: string[] = ['profileImage', 'sidNo', 'position', 'surname', 'mobile', 'appliedDate', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: string;
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  submitted: boolean;
  // Photo upload [start]
  selectedFile: File | null = null;
  previewUrl!: SafeUrl | null;
  isFileSelected = false;
  // Photo upload [end]

  constructor(
    private fb: FormBuilder,
    private seafarersService: SeafarersServiceService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer // Photo upload [start]
  ) {
    this.seafarersForm = this.fb.group({

      profileImage: new FormControl('', [Validators.required]),
      profileImageName: new FormControl(''),
      profileImageType: new FormControl(''),
      sidNo: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Za-z0-9]+$/) ]), // letters and numbers only
      position: new FormControl('', [Validators.required]),
      // appliedDate: new FormControl('', [Validators.required]),
      appliedDate: new FormControl({value: new Date(), disabled: true}, [Validators.required]),
      availableDate: new FormControl('', [Validators.required, futureDateValidator]),
      surname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/) ]), // letters , spaces
      otherNames: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/) ]),
      dob: new FormControl('', [ageValidator]),
      birthPlace: new FormControl('', [ Validators.pattern(/^[A-Za-z\s]+$/) ]), // only letters, spaces
      nic: new FormControl('', [Validators.pattern(/^([0-9]{9}[vVxX]|[0-9]{12})$/)]),
      religion: new FormControl('', []),
      marriedStatus: new FormControl('', []),
      gender: new FormControl('', [Validators.required]),
      noOfChildren: new FormControl('', [Validators.min(0), Validators.max(10), Validators.pattern(/^\d+$/)]), //& only digits (whole digit)
      address: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9\s,.'\-\/#]*$/)]), // letters, numbers, /-,.#'
      home: new FormControl('', [Validators.pattern(/^0\d{9}$/)]), // first digit must be 0, others 0-9
      mobile: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]), // 10 digit start with 07
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/)]),
      kinName: new FormControl('', [Validators.pattern(/^[A-Za-z\s]+$/)]),
      kinRelationship: new FormControl('', [Validators.required]),
      kinAddress: new FormControl('', [ Validators.pattern(/^[a-zA-Z0-9\s,.'\-\/#]*$/) ]),
      kinMobile: new FormControl('', [Validators.pattern(/^07[0-9]{8}$/)]),
      kinEmail: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/)]),
      englishLanguage: new FormControl('')
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
          },
          error: (error) => {
            this.messageService.showError('Action Failed With Error ' + error);
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

  // Photo upload [start]
  public prepareSeafarerData(): FormData {
    const seafarersFormData = new FormData();
    seafarersFormData.append(
      'seafarersForm',
      // new Blob([JSON.stringify(this.seafarersForm.value)], {
      new Blob([JSON.stringify(this.seafarersForm.getRawValue())],
      {
        type: 'application/json'
      })
    );

    if (this.isFileSelected) {
      seafarersFormData.append(
        'profileImage',
        this.seafarersForm.get('profileImage')?.value,
        this.seafarersForm.get('profileImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.seafarersForm.get('profileImage')?.value,
        this.seafarersForm.get('profileImageType')?.value
      );
      const file = new File([imageBlob], this.seafarersForm.get('profileImageName')?.value, {
        type: this.seafarersForm.get('profileImageType')?.value
      });
      seafarersFormData.append('profileImage', file, file.name);
    }
    return seafarersFormData;
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
      this.seafarersForm.get('profileImage')?.setValue(file);
    }
  }
  // Photo upload [end]

  onSubmit() {
    try {
      console.log('mode' + this.mode);
      console.log('Form Submitted');
      console.log(this.seafarersForm.value);

      if(!this.seafarersForm.valid) return;
      if (this.mode === 'add') {
        this.seafarersService
          .serviceCall(
            this.prepareSeafarerData() // Photo upload [start]
          ) 
          .subscribe({
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
        this.seafarersService
          .editData(
            this.selectedData?.id,
            this.prepareSeafarerData() // Photo upload [start]
          )
          .subscribe({
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
      this.seafarersForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  // public resetData(): void {
  //   this.seafarersForm.reset();
  //   this.saveButtonLabel = 'Save';
  //   this.seafarersForm.enable();
  //   this.isButtonDisabled = false;

  //   this.previewUrl = null;
  //   this.isFileSelected = false;
  //   this.seafarersForm.setErrors = null!;
  //   this.seafarersForm.updateValueAndValidity();
  // }

  public resetData(): void {
  const appliedDate = this.seafarersForm.get('appliedDate')?.value; // saved current applied date

  this.seafarersForm.reset();

  this.saveButtonLabel = 'Save';
  this.mode = 'add';
  this.selectedData = null;

  this.seafarersForm.enable();

  this.seafarersForm.patchValue({appliedDate: appliedDate}); // Restore the previous Applied Date
  this.seafarersForm.get('appliedDate')?.disable();

  this.isButtonDisabled = false;

  // Reset image preview
  this.previewUrl = null;
  this.isFileSelected = false;

  this.seafarersForm.setErrors(null);
  this.seafarersForm.updateValueAndValidity();
  }

  public editData(data: any): void {
    this.seafarersForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;

    const file = data.profileImage;
    const imageType = data.profileImageType;
    this.previewUrl = `data:${imageType};base64,${file}`;

    this.seafarersForm.patchValue({
      noOfChildren: Number(data.noOfChildren),
      // appliedDate: new Date(data.appliedDate).toISOString().substring(0, 10),
      availableDate: new Date(data.availableDate).toISOString().substring(0, 10),
      dob: new Date(data.dob).toISOString().substring(0, 10),
    });
    this.seafarersForm.patchValue({appliedDate: new Date()});
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
        cancelButtonText: 'Cancel'
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
}
