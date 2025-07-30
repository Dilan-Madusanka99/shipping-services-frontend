import { Routes } from '@angular/router'
import { VesselRegistrationComponent } from './vessel-registration/vessel-registration.component'
import { JobPostingComponent } from './job-posting/job-posting.component'


export const RegistrationRoutes: Routes = [
    { path: 'vesselRegistration', component: VesselRegistrationComponent },
    { path: 'jobPosting', component: JobPostingComponent },

]