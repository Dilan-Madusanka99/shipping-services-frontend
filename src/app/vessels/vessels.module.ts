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
import { JobSuggestionsComponent } from './job-suggestions/job-suggestions.component';
import { SeafarerProfileComponent } from '../seafarers/seafarer-profile/seafarer-profile.component';
import { JobVacanciesBoxesComponent } from './job-vacancies-boxes/job-vacancies-boxes.component';
import { JobDetailsDialogComponent } from './job-vacancies-boxes/job-details-dialog/job-details-dialog.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';



@NgModule({
  declarations: [ VesselRegistrationComponent, JobPostingComponent, StandbyCrewMembersComponent, JobSuggestionsComponent, JobVacanciesBoxesComponent, JobDetailsDialogComponent, AppliedJobsComponent ],
  imports: [
    CommonModule, RouterModule.forChild(RegistrationRoutes), ReactiveFormsModule, MaterialModule, MatRadioModule, FormsModule, SeafarerProfileComponent
  ]
})
export class VesselsModule { }
