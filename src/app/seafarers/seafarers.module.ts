import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RegistrationRoutes } from './seafarers.routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { SeafarersRegistrationComponent } from './seafarers-registration/seafarers-registration.component';
import { OtherDetailsRegistrationComponent } from './other-details-registration/other-details-registration.component';
import { CertificateDetailsComponent } from './certificate-details/certificate-details.component';



@NgModule({
  declarations: [ SeafarersRegistrationComponent, OtherDetailsRegistrationComponent, CertificateDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule ]
})
export class SeafarersModule { }
