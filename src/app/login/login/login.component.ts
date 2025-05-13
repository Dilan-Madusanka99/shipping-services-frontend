import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LogInServiceService } from 'src/app/services/LogIn/log-in-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

export interface PeriodicElement {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  role: string;
}

const ELEMENT_DATA: any[] = [ 
  {firstName: 'Dilan', lastName: 'Fernando', userName: 'Dilan', password: 'Abc123', role: 'Managing Director'},
];

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{

  LoginForm : FormGroup;

    displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'password', 'role', 'actions'];
    users = [{password: 'secret123' },];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;
    hide = true;
    showPassword: boolean[] = this.users.map(() => false);


    constructor(private fb: FormBuilder, private loginService: LogInServiceService, private messageService: MessageServiceService) {
      this.LoginForm = this.fb.group({
        users: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl('', [Validators.required]),
        role: new FormControl('')
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
        this.loginService.getData().subscribe({
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
          console.log(this.LoginForm.value);
  
          if (this.mode === 'add'){
            this.loginService.serviceCall(this.LoginForm.value).subscribe({
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
            this.loginService.editData(this.selectedData?.id, this.LoginForm.value).subscribe ({
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
          this.LoginForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.LoginForm.reset();
        this.saveButtonLabel = 'Save';
        this.LoginForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.LoginForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.loginService.deleteData(id).subscribe ({
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

      togglePassword(index: number): void {
      this.showPassword[index] = !this.showPassword[index];
      }
  
      public refreshData(): void {
        this.populateData();
      }

}
