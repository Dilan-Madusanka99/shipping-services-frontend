import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QrCodeComponent } from 'src/app/qr-container/qr-code/qr-code.component';
import { EmployeeAttendenceService } from 'src/app/services/employee/employee-attendence.service';
import { EmployeeServiceService } from 'src/app/services/employee/employee-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  attandenceDate: Date;
  userName: string;
  roles: String;
  attendenceStatus: String;
}

const ELEMENT_DATA: any[] = [
  { attandenceDate: '8/7/2025', userName: 'dilan', roles: 'Assistant Crew Manager', attendenceStatus: 'present' }
];

@Component({
  selector: 'app-employee-attendence',
  standalone: false,
  templateUrl: './employee-attendence.component.html',
  styleUrl: './employee-attendence.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeAttendenceComponent {
  employeeAttendenceForm: FormGroup;

  displayedColumns: string[] = ['attandenceDate', 'userName', 'roles', 'attendenceStatus', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: String;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  isButtonDisabled = false;
  selectedEmployee: string = '';
  allEmployeeDropdown: any = [];
  employeeDropdown: any = [];
  allEmployeeListDetails: any;
  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private employeeAttendenceService: EmployeeAttendenceService,
    private messageService: MessageServiceService,
    private employeeService: EmployeeServiceService
  ) {
    this.employeeAttendenceForm = this.fb.group({
      users: new FormControl('', [Validators.required]),
      attendenceStatus: new FormControl('', [Validators.required]),
      userName: new FormControl(''),
      roles: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.populateData();
    this.getEmployeeList();
  }

  public getEmployeeList(): void {
    this.employeeService.getData().subscribe((response: any) => {
      if (response && response.length > 0) {
        this.allEmployeeListDetails = response;
        response.forEach((emp: any) => {
          const employeeData = {
            id: emp.id,
            name: emp.firstName + '_' + emp.lastName,
            role: emp.roles
          };
          this.allEmployeeDropdown.push(employeeData);
        });
      }
      this.employeeDropdown = this.allEmployeeDropdown;
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
      this.employeeAttendenceService.getData().subscribe({
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
      console.log(this.employeeAttendenceForm.value);

      if(!this.employeeAttendenceForm.valid) return;
      if (this.mode === 'add') {
        this.employeeAttendenceService.serviceCall(this.employeeAttendenceForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
            } else {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
            }

            this.messageService.showSuccess('Data Saved Successfully!');
            this.populateData(); //
          },
          error: (error) => {
            this.messageService.showError('Action Failed With Error' + error);
          }
        });
      } else if (this.mode === 'edit') {
        this.employeeAttendenceService.editData(this.selectedData?.id, this.employeeAttendenceForm.value).subscribe({
          next: (response: any) => {
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Edited Successfully!');
            this.populateData(); //
          },
          error: (error) => {
            this.messageService.showError('Action Failed With Error' + error);
          }
        });
      }
      this.mode = 'add';
      this.employeeAttendenceForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed With Error' + error);
    }
  }

  public resetData(): void {
    this.employeeAttendenceForm.reset();
    this.saveButtonLabel = 'Save';
    this.employeeAttendenceForm.enable();
    this.isButtonDisabled = false;
  }

  public editData(data: any): void {
    this.employeeAttendenceForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;

    this.employeeAttendenceForm.patchValue({
      users: +data.users,
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
              
      this.employeeAttendenceService.deleteData(id).subscribe({
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
    this.employeeDropdown = this.search(eventTarget.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.allEmployeeDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
  }

  public onEmployeeSelect(event): void {
    let selectedEmpId = event;

    this.patchFormEmpValues(selectedEmpId);
  }

  public patchFormEmpValues(empId: number): void {
    this.allEmployeeListDetails.forEach((emp) => {
      if (emp.id === empId) {
        this.employeeAttendenceForm.patchValue({
          userName: emp.callingName,
          roles: emp.roles
        });
      }
    });
  }

  generateQRCode(data) {
    console.log(data);

    this.dialog.open(QrCodeComponent, {
      data: { value: data }
    });
  }
}
