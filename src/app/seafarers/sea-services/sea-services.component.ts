import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SeaServicesService } from 'src/app/services/seafarers/sea-services.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  sidNo: string;
  vesselName: string;
  vesselType: string;
  position: string;
}

const ELEMENT_DATA: any[] = [ 
  {sidNo: 'S123', vesselName: 'souselas', vesselType: 'bulk', position: 'AB', totalMonths:'09'},
];

// validator for Sign on | Sign off dates (shoud not be future one)
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

@Component({
  selector: 'app-sea-services',
  standalone: false,
  templateUrl: './sea-services.component.html',
  styleUrl: './sea-services.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
}) 
export class SeaServicesComponent implements OnInit{

  seaServicesForm : FormGroup;

    displayedColumns: string[] = ['sidNo', 'vesselName', 'vesselType', 'position', 'totalMonths','actions'];
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
    sidMap = new Map<number, string>();

    constructor(
      private fb: FormBuilder, 
      private seaServicesService: SeaServicesService, 
      private messageService: MessageServiceService,
      private seafarerService: SeafarersServiceService
    ) {
      this.seaServicesForm = this.fb.group({
        sidNo: new FormControl('', [Validators.required]),
        companyName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
        vesselName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s\/]+$/)]), // letters spaces /
        position: new FormControl('', [Validators.required,]),
        vesselType: new FormControl('', [Validators.required,]),
        flag: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]), // letters & spaces
        grt: new FormControl('', [Validators.required,  Validators.pattern(/^\d+$/)]), // numbers only
        bhp: new FormControl('', [Validators.pattern(/^\d+$/)]), 
        signOn: new FormControl('', [Validators.required, notFutureDateValidator]),
        signOff: new FormControl('', [Validators.required, notFutureDateValidator]),
        totalMonths: new FormControl({ value: '', disabled: true }),
        reason: new FormControl('', [])
      });
    }

    ngOnInit(): void{
      this.populateData();
      this.getSeafarersList();
      this.calculateTotalMonths();
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
      if (window.localStorage.getItem('role') === 'SEAFARER') {
        /* If the role is seafarer then get only details related to SID no*/
        this.seaServicesService.getSeafarerData(window.localStorage.getItem('sid')).subscribe({
          next: (data: any) => {
            if (!data) {
              return;
            }

            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
          this.seaServicesService.getData().subscribe({
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
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.seaServicesForm.value);
  
          if(!this.seaServicesForm.valid) return;
          if (this.mode === 'add'){
            this.seaServicesService.serviceCall(this.seaServicesForm.getRawValue()).subscribe({
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
            this.seaServicesService.editData(this.selectedData?.id, this.seaServicesForm.getRawValue()).subscribe ({
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
          this.seaServicesForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.seaServicesForm.reset();
        this.saveButtonLabel = 'Save';
        this.seaServicesForm.enable();
        this.seaServicesForm.get('totalMonths')?.disable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.seaServicesForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;

        this.seaServicesForm.patchValue({
        sidNo: +data.sidNo,
        signOn: new Date(data.signOn).toISOString().substring(0, 10),
        signOff: new Date(data.signOff).toISOString().substring(0, 10),
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
            
          this.seaServicesService.deleteData(id).subscribe ({
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
      this.seaServicesForm.patchValue({
        sidNo: seafarersId
      });
    }

    private calculateTotalMonths(): void {

      this.seaServicesForm.get('signOn')?.valueChanges.subscribe(() => {
        this.updateTotalMonths();
      });

      this.seaServicesForm.get('signOff')?.valueChanges.subscribe(() => {
        this.updateTotalMonths();
      });

    }

    private updateTotalMonths(): void {

      const signOn = this.seaServicesForm.get('signOn')?.value;
      const signOff = this.seaServicesForm.get('signOff')?.value;

      if (!signOn || !signOff) {
        this.seaServicesForm.patchValue(
          {
            totalMonths: ''
          },
          { emitEvent: false }
        );
        return;
      }

      const start = new Date(signOn);
      const end = new Date(signOff);

      if (end < start) {
        this.seaServicesForm.patchValue(
          {
            totalMonths: ''
          },
          { emitEvent: false }
        );
        return;
      }

      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      let days = end.getDate() - start.getDate();

      // Borrow days from previous month
      if (days < 0) {
        months--;

        const previousMonthDays = new Date(
          end.getFullYear(),
          end.getMonth(),
          0
        ).getDate();

        days += previousMonthDays;
      }

      if (months < 0) {
        months = 0;
      }

      this.seaServicesForm.patchValue(
        {
          totalMonths: `${months} M ${days} D`
        },
        { emitEvent: false }
      );

    }

}
