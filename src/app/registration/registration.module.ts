import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistrationRoutes } from './registration.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import { MaterialModule } from '../material.module';
import { EmployeeAttendenceComponent } from './employee-attendence/employee-attendence.component';


@NgModule({
  declarations: [ EmployeeComponent, EmployeeAttendenceComponent ],
  imports: [ CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule ]
})
export class RegistrationModule { }
