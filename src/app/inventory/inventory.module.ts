import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsRegistrationComponent } from './items-registration/items-registration.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';
import { SupplierRegistrationComponent } from './supplier-registration/supplier-registration.component';
import { InventoryRoutes } from './inventoty.routing.module';
import { PaymentsComponent } from './payments/payments.component';


@NgModule({
  declarations: [ItemsRegistrationComponent, SupplierRegistrationComponent, PaymentsComponent],
  imports: [
    CommonModule, RouterModule.forChild(InventoryRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule
  ]
})
export class InventoryModule { }
