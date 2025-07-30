import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { EmployeeListComponent } from './Static Report/app/components/employee-list/employee-list.component';
import { ReportsRoutes } from './reports.routing.module';
import { SupplierListComponent } from './Static Report/app/components/supplier-list/supplier-list.component';
import { VesselListComponent } from './Static Report/app/components/vessel-list/vessel-list.component';
import { AppointmentListComponent } from './Static Report/app/components/appointment-list/appointment-list.component';
import { StockListComponent } from './Static Report/app/components/stock-list/stock-list.component';
import { PaymentListComponent } from './Static Report/app/components/payment-list/payment-list.component';
import { ItemListComponent } from './Static Report/app/components/item-list/item-list.component';

@NgModule({
  declarations: [
    EmployeeListComponent, SupplierListComponent, VesselListComponent, AppointmentListComponent, ItemListComponent, StockListComponent, PaymentListComponent
  ],
  imports: [CommonModule, RouterModule.forChild(ReportsRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule]
})
export class ReportsModule {}
