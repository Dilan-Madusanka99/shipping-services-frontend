import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { RegistrationRoutes } from './login.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [ LoginComponent ],
  imports: [CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, ReactiveFormsModule]
})
export class LoginModule { }
