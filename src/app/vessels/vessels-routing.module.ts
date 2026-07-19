import { Routes } from '@angular/router'
import { VesselRegistrationComponent } from './vessel-registration/vessel-registration.component'
import { JobPostingComponent } from './job-posting/job-posting.component'
import { StandbyCrewMembersComponent } from './standby-crew-members/standby-crew-members.component'
import { JobSuggestionsComponent } from './job-suggestions/job-suggestions.component'
import { JobVacanciesBoxesComponent } from './job-vacancies-boxes/job-vacancies-boxes.component'


export const RegistrationRoutes: Routes = [
    { path: 'vesselRegistration', component: VesselRegistrationComponent },
    { path: 'jobPosting', component: JobPostingComponent },
    { path: 'standbyCrewMembers', component: StandbyCrewMembersComponent },
    { path: 'jobSuggestions', component: JobSuggestionsComponent },
    { path: 'jobVacancies', component: JobVacanciesBoxesComponent },
]