import { Routes } from '@angular/router'
import { SeafarersRegistrationComponent } from './seafarers-registration/seafarers-registration.component'
import { OtherDetailsRegistrationComponent } from './other-details-registration/other-details-registration.component'
import { CertificateDetailsComponent } from './certificate-details/certificate-details.component'

export const RegistrationRoutes: Routes = [
    { path: 'seafarersRegistration', component: SeafarersRegistrationComponent },
    { path: 'otherDetailsRegistration', component: OtherDetailsRegistrationComponent },
    { path: 'CertificateDetails', component: CertificateDetailsComponent },
] 