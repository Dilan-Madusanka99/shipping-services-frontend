import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OtherDetailsRegistrationService } from 'src/app/services/seafarers/other-details-registration.service';

export interface PeriodicElement {
  sidNo: String;
  ppNo: string;
  cdcNo: string;
  yellowFeverNo: string;
}

const ELEMENT_DATA: any[] = [{ sidno: '123', ppNo: 'N123', cdcNo: 'C123', yellowFeverNo: 'AB123' }];

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

  constructor(
    private fb: FormBuilder,
    private seafarersService: OtherDetailsRegistrationService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer
  ) {
    this.otherDetailsRegistrationForm = this.fb.group({
      sidImage: new FormControl(''),
      sidImageName: new FormControl(''),
      sidImageType: new FormControl(''),
      sidNo: new FormControl(''),
      sidIssuedPlace: new FormControl(''),
      sidIssuedDate: new FormControl(''),
      sidExpireDate: new FormControl(''),
      ppImage: new FormControl(''),
      ppImageName: new FormControl(''),
      ppImageType: new FormControl(''),
      ppNo: new FormControl(''),
      ppIssuedPlace: new FormControl(''),
      ppIssuedDate: new FormControl(''),
      ppExpireDate: new FormControl(''),
      cdcImage: new FormControl(''),
      cdcImageName: new FormControl(''),
      cdcImageType: new FormControl(''),
      cdcNo: new FormControl(''),
      cdcIssuedPlace: new FormControl(''),
      cdcIssuedDate: new FormControl(''),
      cdcExpireDate: new FormControl(''),
      yellowFeverImage: new FormControl(''),
      yellowFeverImageName: new FormControl(''),
      yellowFeverImageType: new FormControl(''),
      yellowFeverNo: new FormControl(''),
      yellowFeverIssuedPlace: new FormControl(''),
      yellowFeverIssuedDate: new FormControl(''),
      yellowFeverExpireDate: new FormControl('')
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
  }

  public editData(data: any): void {
    this.otherDetailsRegistrationForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    const id = data.id;

    try {
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
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public refreshData(): void {
    this.populateData();
  }
}
