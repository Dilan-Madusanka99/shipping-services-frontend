import { Routes } from '@angular/router';
import { EmployeeListComponent } from './Static Report/app/components/employee-list/employee-list.component';
import { SupplierListComponent } from './Static Report/app/components/supplier-list/supplier-list.component';
import { VesselListComponent } from './Static Report/app/components/vessel-list/vessel-list.component';
import { AppointmentListComponent } from './Static Report/app/components/appointment-list/appointment-list.component';
import { StockListComponent } from './Static Report/app/components/stock-list/stock-list.component';
import { PaymentListComponent } from './Static Report/app/components/payment-list/payment-list.component';
import { ItemListComponent } from './Static Report/app/components/item-list/item-list.component';

export const ReportsRoutes: Routes = [
    { path: 'employee-list', component: EmployeeListComponent },
    { path: 'supplier-list', component: SupplierListComponent },
    { path: 'vessel-list', component: VesselListComponent },
    { path: 'appointment-list', component: AppointmentListComponent },
    { path: 'item-list', component: ItemListComponent },
    { path: 'stock-list', component: StockListComponent },
    { path: 'payment-list', component: PaymentListComponent },
];
