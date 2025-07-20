import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RegistrationRoutes } from './seafarers.routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { SeafarersRegistrationComponent } from './seafarers-registration/seafarers-registration.component';
import { OtherDetailsRegistrationComponent } from './other-details-registration/other-details-registration.component';
import { CertificatesRegistrationComponent } from './certificates-registration/certificates-registration.component';
import { SeaServicesComponent } from './sea-services/sea-services.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { FormsModule } from '@angular/forms';
import { CertificateVerificationComponent } from './certificate-verification/certificate-verification.component';

@NgModule({
  declarations: [ SeafarersRegistrationComponent, OtherDetailsRegistrationComponent, CertificatesRegistrationComponent, SeaServicesComponent, AppointmentComponent, CertificateVerificationComponent],
  imports: [CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule  ]
})
export class SeafarersModule { }
