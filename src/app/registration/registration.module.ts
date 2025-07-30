import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistrationRoutes } from './registration.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import { MaterialModule } from '../material.module';
import { EmployeeAttendenceComponent } from './employee-attendence/employee-attendence.component';
import { QrCodeComponent } from '../qr-container/qr-code/qr-code.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [EmployeeComponent, EmployeeAttendenceComponent, QrCodeComponent],
  imports: [CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, SweetAlert2Module]
})
export class RegistrationModule {}
