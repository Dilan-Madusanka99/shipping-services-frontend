import { Routes } from '@angular/router'
import { SeafarersRegistrationComponent } from './seafarers-registration/seafarers-registration.component'
import { OtherDetailsRegistrationComponent } from './other-details-registration/other-details-registration.component'
import { CertificatesRegistrationComponent } from './certificates-registration/certificates-registration.component'
import { SeaServicesComponent } from './sea-services/sea-services.component'
import { JobPostingComponent } from './job-posting/job-posting.component'

export const RegistrationRoutes: Routes = [
    { path: 'seafarersRegistration', component: SeafarersRegistrationComponent },
    { path: 'otherDetailsRegistration', component: OtherDetailsRegistrationComponent },
    { path: 'certificatesRegistration', component: CertificatesRegistrationComponent },
    { path: 'seaServices', component: SeaServicesComponent },
    { path: 'jobPosting', component: JobPostingComponent },
]