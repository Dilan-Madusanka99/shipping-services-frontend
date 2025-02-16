import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmployeeServicesService } from 'src/app/services/employee/employee-services.service';

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  employeeForm : FormGroup;

  constructor (private fb: FormBuilder, private employeeService: EmployeeServicesService) {
    this.employeeForm = this.fb.group({
      firstName: new FormControl (""),
      lastName: new FormControl(""),
      position: new FormControl(""),
      age: new FormControl(""),
      email: new FormControl(""),
      contactNo: new FormControl("")
    })
  }

  onSubmit() {
    console.log("Form Submitted");
    console.log(this.employeeForm.value);

    this.employeeService.serviceCall(this.employeeForm.value).subscribe((response) => {
      console.log('server response: ', response);
    });  }

}
