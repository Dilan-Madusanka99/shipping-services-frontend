import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { EmployeeListComponent } from './Static Report/app/components/employee-list/employee-list.component';
import { ReportsRoutes } from './reports.routing.module';

@NgModule({
  declarations: [EmployeeListComponent],
  imports: [CommonModule, RouterModule.forChild(ReportsRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule]
})
export class ReportsModule {}
