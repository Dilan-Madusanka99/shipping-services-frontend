import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VesselRegistrationComponent } from './vessel-registration/vessel-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from '../material.module';
import { RegistrationRoutes } from './vessels-routing.module';
import { RouterModule } from '@angular/router';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { StandbyCrewMembersComponent } from './standby-crew-members/standby-crew-members.component';



@NgModule({
  declarations: [ VesselRegistrationComponent, JobPostingComponent, StandbyCrewMembersComponent ],
  imports: [
    CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule
  ]
})
export class VesselsModule { }
