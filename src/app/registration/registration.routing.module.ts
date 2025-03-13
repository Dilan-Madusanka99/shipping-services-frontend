import { Routes } from '@angular/router'
import { EmployeeComponent } from './employee/employee.component'
import { SeafarersComponent } from './seafarers/seafarers.component'

export const RegistrationRoutes: Routes = [
    { path: 'employee', component: EmployeeComponent },
    { path: 'seafarers', component: SeafarersComponent }
]      