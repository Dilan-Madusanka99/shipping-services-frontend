import { Routes } from "@angular/router";
import { SeafarersRegisteredByMonthlyComponent } from "./seafarers-registered-by-monthly/seafarers-registered-by-monthly.component";
import { VesselRegisteredByTypeComponent } from "./vessel-registered-by-type/vessel-registered-by-type.component";
import { EmployeeAttendanceByMonthComponent } from "./employee-attendance-by-month/employee-attendance-by-month.component";

export const ChartsRoutes: Routes = [
    { path: 'seafarersRegisteredByMonthly', component: SeafarersRegisteredByMonthlyComponent },
    { path: 'vesselRegisteredByType', component: VesselRegisteredByTypeComponent },
    { path: 'employeeAttendanceByMonth', component: EmployeeAttendanceByMonthComponent },
]