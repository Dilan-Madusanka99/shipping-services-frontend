import { Routes } from '@angular/router'
import { EmployeeComponent } from './employee/employee.component'
import { EmployeeAttendenceComponent } from './employee-attendence/employee-attendence.component'

export const RegistrationRoutes: Routes = [
    { path: 'employee', component: EmployeeComponent },
    { path: 'employeeAttendence', component: EmployeeAttendenceComponent }
]      