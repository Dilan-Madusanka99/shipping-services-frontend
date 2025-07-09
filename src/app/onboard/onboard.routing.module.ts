import { Routes } from "@angular/router";
import { CrewComplaintsComponent } from "./crew-complaints/crew-complaints.component";
import { OnboardCrewRegistrationComponent } from "./onboard-crew-registration/onboard-crew-registration.component";

export const OnboardRoutes: Routes = [
    { path: 'crewComplaints', component: CrewComplaintsComponent }, 
    { path: 'onboardCrewRegistration', component: OnboardCrewRegistrationComponent },  

]