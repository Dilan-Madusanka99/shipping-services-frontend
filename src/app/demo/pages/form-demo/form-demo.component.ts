import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';

const ELEMENT_DATA: any[] = [
  {firstName: 1, lastName: 'Hydrogen', age: 1.0079, email: 'H'},
];

@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})
export class FormDemoComponent implements OnInit {
demoForm: FormGroup;

  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'email',];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  saveButtonLabel = 'Save';
  mode = 'edit';
  selectedData: any;
  isButtonDisabled = false;
  messageService: any;
  submitted: boolean;
 
  constructor(private fb: FormBuilder, private demoService: FormDemoServiceService) {
    this.demoForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      age: new FormControl(''),
      email: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.populateData();
  } 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  public populateData(): void{
    try {
      this.demoService.getData().subscribe((response :any) => {
        console.log('get data response', response);
  
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; 
      });
    } catch (error) {
      this.messageService.showError ('Action failed with error' + error);
    }
  }
  onSubmit() {
    try {
      console.log('Mode' + this.mode);
    console.log('Form Submitted');
    console.log(this.demoForm.value);

    this.submitted = true;

    if(this.mode == 'add') {
      this.demoService.serviceCall(this.demoForm.value).subscribe((response) => {

        if(this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
          this.dataSource = new MatTableDataSource([response ,this.dataSource.data]);
        } else {
          this.dataSource = new MatTableDataSource([response]);
        }

        this.messageService.showSuccess('Data Saved Successfully');
    });
    } else if (this.mode == 'edit') {
      this.demoService.editData(this.selectedData?.id, this.demoForm.value).subscribe((response) => {
      let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
      this.dataSource.data[elementIndex] = response;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.messageService.showSuccess('Data Saved Successfully');
      });
    }
    this.mode = 'add';
    this.demoForm.disable();
    this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError ('Action failed with error' + error);
    }
  }
  public resetData(): void{
    this.demoForm.reset();
    this.demoForm.setErrors = null;
    this.demoForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.demoForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }
  public editData(data: any): void {
    this.demoForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = 'data'; // meka use karala witharai declare karanna ona
  }
  public deleteData(data: any): void {
    const id = data.id;

    try {
      this.demoService.deleteData(id). subscribe((response)  => {
        const index = this.dataSource.data.findIndex((element) => element.id === id);
  
        if(index !== -1) {
          this.dataSource.data.splice(index, 1);
        }
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.messageService.showSuccess('Data Saved Successfully'); 
      });
    } catch (error) {
      this.messageService.showError ('Action failed with error' + error);
    }
  }

  public refreshData(): void{
    this.populateData();
  }
}
