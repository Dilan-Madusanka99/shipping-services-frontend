import { ChangeDetectionStrategy, Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AppointmentService } from 'src/app/services/seafarers/appointment.service';
import Swal from 'sweetalert2';
import { Appointment } from './calendar/calendar.component';
import { Router } from '@angular/router';

export interface PeriodicElement {
  firstName: String;
  lastName: String;
  position: String;
  appointmentDate: Date;
  appointmentTime: string;
}

const ELEMENT_DATA: any[] = [ 
  {firstName: 'Chamil', lastName: 'Madushan', position: 'Fitter', appointmentDate: '2025-06-08', appointmentTime: '10.00', appointmentStatus: 'cancelled'},
];

@Component({
  selector: 'app-appointment',
  standalone: false,
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentComponent implements OnInit{

  appointmentForm : FormGroup;

    displayedColumns: string[] = ['firstName', 'lastName', 'position', 'appointmentDate', 'appointmentTime', 'appointmentStatus', 'actions'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;
    submitted: boolean;
    selectedIndex = 0;
    seafarerData: any;
    fromJobSug = false;

    readonly showModal = signal(false);
    readonly editingAppointment = signal<Appointment | null>(null);
    readonly prefillDate = signal<string>('');

    constructor(
      private fb: FormBuilder, 
      private appointmentService: AppointmentService, 
      private messageService: MessageServiceService,
      private router: Router
    ) {
      this.appointmentForm = this.fb.group({
        sidNo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        firstName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[A-Za-z .'-]+$/)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[A-Za-z .'-]+$/)]),
        position: new FormControl('', [Validators.required]),
        mobile: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        appointmentDate: new FormControl('', [Validators.required]),
        appointmentTime: new FormControl('', [ Validators.required]),
        appointmentStatus: new FormControl('', [Validators.required]),
      });
      const nav = this.router.getCurrentNavigation();
      this.seafarerData = nav?.extras?.state;
    }

    ngOnInit(): void{
      this.populateData();

      if(this.seafarerData) {
        this.openAddModalFromJobSuggestions();
      }
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
        this.appointmentService.getSeafarerData(window.localStorage.getItem('sid')).subscribe({
          next: (data: any) => {
            if (!data) {
              return;
            }

            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (error) => {
            this.messageService.showError('Action Failed With Error ' + error);
          }
        });

      } else {
          this.appointmentService.getData().subscribe({
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
          console.log(this.appointmentForm.value);
          console.log(this.appointmentForm.valid);
  
          if(!this.appointmentForm.valid) return;
          if (this.mode === 'add'){
            this.appointmentService.serviceCall(this.appointmentForm.value).subscribe({
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
            this.appointmentService.editData(this.selectedData?.id, this.appointmentForm.value).subscribe ({
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
          this.appointmentForm.disable();
          this.isButtonDisabled = true;
          this.resetData();
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.appointmentForm.reset();
        this.saveButtonLabel = 'Save';
        this.appointmentForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.appointmentForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
        this.selectTab(0);

        let editAppointmentData: Appointment = {
          id: data.id,
          title: null,
          date: this.appointmentForm.get('appointmentDate').value,
          time: this.appointmentForm.get('appointmentTime').value,
          duration: null,
          category: null,
          color: null,
          notes: null,
          createdAt: null,
          sid: this.appointmentForm.get('sidNo').value,
          firstName: this.appointmentForm.get('firstName').value,
          lastName: this.appointmentForm.get('lastName').value,
          position: this.appointmentForm.get('position').value,
          mobile: this.appointmentForm.get('mobile').value,
          email: this.appointmentForm.get('email').value,
          status: this.appointmentForm.get('appointmentStatus').value,
          formData: this.appointmentForm
        };

        this.openEditModal(editAppointmentData);
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

          this.appointmentService.deleteData(id).subscribe ({
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

        // Open modal to add new appointment
  openAddModal(dateStr?: string): void {
    this.editingAppointment.set(null);
    this.prefillDate.set(dateStr ?? '');
    this.showModal.set(true);
  }

  openAddModalFromJobSuggestions(dateStr?: string): void {
    this.patchApointmentForm();
    let editAppointmentData: Appointment = this.setAppointmentData();
    this.editingAppointment.set(editAppointmentData);
    this.prefillDate.set(dateStr ?? '');
    this.showModal.set(true);
    this.fromJobSug = true;
  }

  patchApointmentForm() {
    const seafarerDetails = this.seafarerData?.seafarer
    this.appointmentForm.patchValue({
      sidNo: seafarerDetails.seaFarerIdNo,
      firstName: seafarerDetails.surname,
      lastName: seafarerDetails.otherNames,
      position: seafarerDetails.position,
      mobile: seafarerDetails.mobile,
      email: seafarerDetails.email
    });
  }

  setAppointmentData(): Appointment {
    const seafarerDetails = this.seafarerData?.seafarer
    console.log(seafarerDetails);
    let editAppointmentData: Appointment = {
          id: null,
          title: null,
          date: null,
          time: null,
          duration: null,
          category: null,
          color: null,
          notes: null,
          createdAt: null,
          sid: seafarerDetails.seaFarerIdNo,
          firstName: seafarerDetails.surname,
          lastName: seafarerDetails.otherNames,
          position: seafarerDetails.position,
          mobile: seafarerDetails.mobile,
          email: seafarerDetails.email,
          status: '',
          formData: this.appointmentForm
        };
      return editAppointmentData
  }

  // Open modal to edit existing appointment
  openEditModal(appt: Appointment): void {
    this.editingAppointment.set(appt);
    this.prefillDate.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingAppointment.set(null);
    this.prefillDate.set('');
  }

    saveAppointment(data: any): void {
    const editing = this.editingAppointment();
    this.appointmentForm.patchValue(data?.value);
    if (editing && !this.fromJobSug) {
      this.mode = 'edit';
    } else {
      this.mode = 'add';
      this.fromJobSug = false;
    }
    this.appointmentForm.updateValueAndValidity();
    this.onSubmit();
    this.closeModal();
  }

  deleteAppointment(id: string): void {
    // this.apptService.delete(id);
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
  }

}
