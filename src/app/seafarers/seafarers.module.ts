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
import { JobPostingComponent } from './job-posting/job-posting.component';


@NgModule({
  declarations: [ SeafarersRegistrationComponent, OtherDetailsRegistrationComponent, CertificatesRegistrationComponent, SeaServicesComponent, JobPostingComponent],
  imports: [CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule ]
})
export class SeafarersModule { }
