import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsRegistrationComponent } from './items-registration/items-registration.component';
import { RouterModule } from '@angular/router';
import { RegistrationRoutes } from '../registration/registration.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';



@NgModule({
  declarations: [ItemsRegistrationComponent],
  imports: [
    CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule
  ]
})
export class InventoryModule { }
