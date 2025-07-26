import { Routes } from '@angular/router'
import { SeafarersRegistrationComponent } from './seafarers-registration/seafarers-registration.component'
import { OtherDetailsRegistrationComponent } from './other-details-registration/other-details-registration.component'
import { CertificatesRegistrationComponent } from './certificates-registration/certificates-registration.component'
import { SeaServicesComponent } from './sea-services/sea-services.component'
import { AppointmentComponent } from './appointment/appointment.component'
import { CertificateVerificationComponent } from './certificate-verification/certificate-verification.component'
import { SeafarersDocComponent } from './seafarers-doc/seafarers-doc.component'


export const RegistrationRoutes: Routes = [
    { path: 'seafarersRegistration', component: SeafarersRegistrationComponent },
    { path: 'otherDetailsRegistration', component: OtherDetailsRegistrationComponent },
    { path: 'certificatesRegistration', component: CertificatesRegistrationComponent },
    { path: 'seaServices', component: SeaServicesComponent },
    { path: 'appointment', component: AppointmentComponent },
    { path: 'certificateVerification', component: CertificateVerificationComponent },
    { path: 'seafarerDoc', component: SeafarersDocComponent}
    
]