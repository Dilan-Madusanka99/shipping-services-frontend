import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  sidno: String;
  position: string;
  surname: string;
  mobile: string;
  appliedDate: Date;
}

const ELEMENT_DATA: any[] = [{ sidno: '100', position: 'AB', surname: 'Fernando', mobile: '076', appliedDate: '07/04/2025' }];

@Component({
  selector: 'app-seafarers-registration',
  standalone: false,
  templateUrl: './seafarers-registration.component.html',
  styleUrl: './seafarers-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeafarersRegistrationComponent {
  seafarersForm: FormGroup;

  displayedColumns: string[] = ['sidNo', 'position', 'surname', 'mobile', 'appliedDate', 'actions'];
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
      // Photo upload [start]
      profileImage: new FormControl('', [Validators.required]),
      profileImageName: new FormControl(''),
      profileImageType: new FormControl(''),
      // Photo upload [end]
      sidNo: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.pattern(/^[A-Za-z0-9]+$/)
      ]), // letters and numbers only
      position: new FormControl('', [Validators.required]),
      appliedDate: new FormControl('', [Validators.required]),
      availableDate: new FormControl('', [Validators.required]), // Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/)
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z .'-]+$/)
      ]), // letters , - space (name)
      otherNames: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z .'-]+$/)
      ]),
      dob: new FormControl('', [Validators.required]),
      birthPlace: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.pattern(/^[A-Za-z .'-]+$/)
      ]),
      nic: new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{9}[vVxX]|[0-9]{12})$/)]),
      religion: new FormControl('', [Validators.required]),
      marriedStatus: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      noOfChildren: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10), Validators.pattern(/^\d+$/)]), //min & max & only digits (whole digit)
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s,.'\-\/#]*$/)
      ]),
      home: new FormControl('', [Validators.pattern(/^0\d{9}$/)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      kinName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z .'-]+$/)
      ]), // letters only
      kinRelationship: new FormControl('', [Validators.required]),
      kinAddress: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s,.'\-\/#]*$/)
      ]),
      kinMobile: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]),
      kinEmail: new FormControl('', [Validators.email]),
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
        this.seafarersService.geSeafarerData(window.localStorage.getItem('sid')).subscribe({
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
      new Blob([JSON.stringify(this.seafarersForm.value)], {
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
        this.seafarersForm.get('profileImageImageType')?.value
      );
      const file = new File([imageBlob], this.seafarersForm.get('profileImageImageName')?.value, {
        type: this.seafarersForm.get('profileImageImageType')?.value
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

      // if(!this.seafarersForm.valid) return;
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

  public resetData(): void {
    this.seafarersForm.reset();
    this.saveButtonLabel = 'Save';
    this.seafarersForm.enable();
    this.isButtonDisabled = false;

    this.previewUrl = null;
    this.isFileSelected = false;
    this.seafarersForm.setErrors = null!;
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
      appliedDate: new Date(data.appliedDate).toISOString().substring(0, 10),
      availableDate: new Date(data.availableDate).toISOString().substring(0, 10),
      dob: new Date(data.dob).toISOString().substring(0, 10)
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
