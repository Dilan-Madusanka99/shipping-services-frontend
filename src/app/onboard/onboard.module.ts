import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardRoutes } from './onboard.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { CrewComplaintsComponent } from './crew-complaints/crew-complaints.component';
import { OnboardCrewRegistrationComponent } from './onboard-crew-registration/onboard-crew-registration.component';



@NgModule({
  declarations: [CrewComplaintsComponent, OnboardCrewRegistrationComponent],
  imports: [
    CommonModule, RouterModule.forChild(OnboardRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule
  ]
})
export class OnboardModule { }
