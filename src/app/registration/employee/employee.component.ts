import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { EmployeeServiceService } from 'src/app/services/employee/employee-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QrCodeComponent } from 'src/app/qr-container/qr-code/qr-code.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  profileImage: string;
  empNo: number;
  firstName: string;
  nic: number;
  roles: string;
}

const ELEMENT_DATA: any[] = [{ profileImage: 'Image', empNo: 1, firstName: 'Hydrogen', nic: 1, roles: 'manager' }];

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  displayedColumns: string[] = ['profileImage', 'empNo', 'firstName', 'nic', 'roles', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: String;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  submitted: boolean;
  isButtonDisabled = false;
  // Photo upload [start]
  selectedFile: File | null = null;
  previewUrl!: SafeUrl | null; // : string | ArrayBuffer | null = null;
  isFileSelected = false;
  // Photo upload [end]
  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeServiceService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer // Photo upload [start]
  ) {
    this.employeeForm = this.fb.group({
      // Photo upload [start]
      profileImage: new FormControl('', [Validators.required]),
      profileImageName: new FormControl(''),
      profileImageType: new FormControl(''),
      // Photo upload [end]
      empNo: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(10),Validators.pattern(/^[a-zA-Z0-9]*$/)]), // letter & numbers only
      firstName: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern(/^[A-Za-z .'-]+$/)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100),Validators.pattern(/^[A-Za-z .'-]+$/)]),
      callingName: new FormControl('', [Validators.pattern(/^[A-Za-z.]+$/)]),
      nic: new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{9}[vVxX]|[0-9]{12})$/)]),
      dob: new FormControl(''),
      roles: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required,Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'\-\/#]*$/)]),
      emergencyContactName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z .'-]+$/)]),
      emergencyContactNo: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)])
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
      this.employeeService.getData().subscribe({
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

  // Photo upload [start]
  public prepareEmployeeData(): FormData {
    const employeeFormData = new FormData();
    employeeFormData.append(
      'employeeForm',
      new Blob([JSON.stringify(this.employeeForm.value)], {
        type: 'application/json'
      })
    );

    if (this.isFileSelected) {
      employeeFormData.append(
        'profileImage',
        this.employeeForm.get('profileImage')?.value,
        this.employeeForm.get('profileImage')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.employeeForm.get('profileImage')?.value,
        this.employeeForm.get('profileImageImageType')?.value
      );
      const file = new File([imageBlob], this.employeeForm.get('profileImageImageName')?.value, {
        type: this.employeeForm.get('profileImageImageType')?.value
      });
      employeeFormData.append('profileImage', file, file.name);
    }
    return employeeFormData;
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
      this.employeeForm.get('profileImage')?.setValue(file);
    }
  }
  // Photo upload [end]

  onSubmit() {
    try {
      console.log('mode' + this.mode);
      console.log('Form Submitted');
      console.log(this.employeeForm.value);

      if (!this.employeeForm.valid) return;
      if (this.mode === 'add') {
        this.employeeService
          .serviceCall(
            this.prepareEmployeeData() // Photo upload [start]
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
        this.employeeService
          .editData(
            this.selectedData?.id,
            this.prepareEmployeeData() // Photo upload [start]
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
      this.employeeForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public resetData(): void {
    this.employeeForm.reset();
    this.saveButtonLabel = 'Save';
    this.employeeForm.enable();
    this.isButtonDisabled = false;

    /* Remove image on reset */
    this.previewUrl = null;
    this.isFileSelected = false;
    this.employeeForm.setErrors = null!;
    this.employeeForm.updateValueAndValidity();
  }

  public editData(data: any): void {
    this.employeeForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;

    /* Preview image on edit */
    const file = data.profileImage;
    const imageType = data.profileImageType;
    this.previewUrl = `data:${imageType};base64,${file}`;

    this.employeeForm.patchValue({
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
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result && !result.isConfirmed) {
          return;
        }

        this.employeeService.deleteData(id).subscribe({
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

  generateQRCode(data) {
    console.log(data);

    this.dialog.open(QrCodeComponent, {
      data: { value: data }
    });
  }
}
