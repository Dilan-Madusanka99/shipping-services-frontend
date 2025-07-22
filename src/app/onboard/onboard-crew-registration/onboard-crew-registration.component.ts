import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OnboardCrewRegistrationService } from 'src/app/services/onboard/onboard-crew-registration.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

export interface PeriodicElement {
  sidNo: string;
  position: String;
  vesselName: string;
  signOnDate: Date;
  signOffDate: Date;
}

const ELEMENT_DATA: any[] = [{ sidNo: 'S123', position: 'AB', vesselName: 'souselas', signOnDate: '8/7/2025', signOffDate: '8/5/2026' }];

@Component({
  selector: 'app-onboard-crew-registration',
  standalone: false,
  templateUrl: './onboard-crew-registration.component.html',
  styleUrl: './onboard-crew-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardCrewRegistrationComponent {
  
  onboardCrewRegistrationForm: FormGroup;

  displayedColumns: string[] = ['sidNo', 'position', 'vesselName', 'signOnDate', 'signOffDate', 'actions'];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: String;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  isButtonDisabled = false;
  selectedSeafarers: string = '';
  allSeafarersDropdown: any = [];  // sid link
  seafarersDropdown: any = []; 
  allSeafarersListDetails: any;

  constructor(
    private fb: FormBuilder,
    private onboardCrewRegistrationService: OnboardCrewRegistrationService,
    private messageService: MessageServiceService,
    private seafarerService: SeafarersServiceService
  ) {
    this.onboardCrewRegistrationForm = this.fb.group({
      sidNo: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      imoNo: new FormControl('', [Validators.required]),
      vesselName: new FormControl('', [Validators.required]),
      signOnDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/)]),
      signOffDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/)])
    });
  }

  ngOnInit(): void {
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
    });
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
      this.onboardCrewRegistrationService.getData().subscribe({
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

  onSubmit() {
    try {
      console.log('mode' + this.mode);
      console.log('Form Submitted');
      console.log(this.onboardCrewRegistrationForm.value);

      if(!this.onboardCrewRegistrationForm.valid) return;
      if (this.mode === 'add') {
        this.onboardCrewRegistrationService.serviceCall(this.onboardCrewRegistrationForm.value).subscribe({
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
        this.onboardCrewRegistrationService.editData(this.selectedData?.id, this.onboardCrewRegistrationForm.value).subscribe({
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
      this.onboardCrewRegistrationForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public resetData(): void {
    this.onboardCrewRegistrationForm.reset();
    this.saveButtonLabel = 'Save';
    this.onboardCrewRegistrationForm.enable();
    this.isButtonDisabled = false;
  }

  public editData(data: any): void {
    this.onboardCrewRegistrationForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    const id = data.id;

    try {
      this.onboardCrewRegistrationService.deleteData(id).subscribe({
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
      this.onboardCrewRegistrationForm.patchValue({
        sidNo: seafarersId
      });
    }
}
