import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MyAppointmentService } from 'src/app/services/seafarers/my-appointment.service';

export interface PeriodicElement {
  firstName: String;
  lastName: String;
  position: String;
  appointmentDate: Date;
  appointmentTime: string;
}

const ELEMENT_DATA: any[] = [ 
  {firstName: 'Chamil', lastName: 'Madushan', position: 'Fitter', appointmentDate: '2025-06-08', appointmentTime: '10.00'},
];


@Component({
  selector: 'app-my-appointment',
  standalone: false,
  templateUrl: './my-appointment.component.html',
  styleUrl: './my-appointment.component.scss'
})
export class MyAppointmentComponent {

  myAppointmentForm : FormGroup;

    displayedColumns: string[] = ['firstName', 'lastName', 'position', 'appointmentDate', 'appointmentTime'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;
    submitted: boolean;
    

  constructor(private fb: FormBuilder, private myAppointmentService: MyAppointmentService, private messageService: MessageServiceService) {
        this.myAppointmentForm = this.fb.group({
          sid: new FormControl(''),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          position: new FormControl(''),
          appointmentDate: new FormControl(''),
          appointmentTime: new FormControl(''),
          data: new FormControl(''),
        });
      }
  
      ngOnInit(): void{
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
          this.myAppointmentService.getData().subscribe({
            next: (dataList: any[]) => {
              if (dataList.length <=0) {
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
            console.log(this.myAppointmentForm.value);
    
            if (this.mode === 'add'){
              this.myAppointmentService.serviceCall(this.myAppointmentForm.value).subscribe({
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
              this.myAppointmentService.editData(this.selectedData?.id, this.myAppointmentForm.value).subscribe ({
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
            this.myAppointmentForm.disable();
            this.isButtonDisabled = true;
          } catch (error) {
            console.log(error);
            this.messageService.showError('Action Failed With Error' + error);
          }
        }
    
        public resetData(): void {
          this.myAppointmentForm.reset();
          this.saveButtonLabel = 'Save';
          this.myAppointmentForm.enable();
          this.isButtonDisabled = false;
        }
    
        public editData(data: any): void {
          this.myAppointmentForm.patchValue(data);
          this.saveButtonLabel = 'Edit';
          this.mode = 'edit';
          this.selectedData = data;
        }
    
        public deleteData(data: any): void {
          const id = data.id;
          
          try {
            this.myAppointmentService.deleteData(id).subscribe ({
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
          } catch (error) {
            console.log(error);
            this.messageService.showError('Action Failed With Error' + error);
          }
        }
    
        public refreshData(): void {
          this.populateData();
        }
}
