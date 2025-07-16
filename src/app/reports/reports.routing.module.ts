import { Routes } from '@angular/router';
import { EmployeeListComponent } from './Static Report/app/components/employee-list/employee-list.component';
import { vesselListComponent } from './Static Report/app/components/vessel-list/vessel-list.component';

export const ReportsRoutes: Routes = [
    { path: 'employee-list', component: EmployeeListComponent },
    { path: 'vessel-list', component: vesselListComponent }
];
