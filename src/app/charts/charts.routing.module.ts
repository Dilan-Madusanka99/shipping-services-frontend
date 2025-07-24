import { Routes } from "@angular/router";
import { SeafarersRegisteredByMonthlyComponent } from "./seafarers-registered-by-monthly/seafarers-registered-by-monthly.component";
import { VesselRegisteredByTypeComponent } from "./vessel-registered-by-type/vessel-registered-by-type.component";

export const ChartsRoutes: Routes = [
    { path: 'seafarersRegisteredByMonthly', component: SeafarersRegisteredByMonthlyComponent },
    { path: 'vesselRegisteredByType', component: VesselRegisteredByTypeComponent },

]