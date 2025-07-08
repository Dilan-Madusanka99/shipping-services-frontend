import { Routes } from "@angular/router";
import { ItemsRegistrationComponent } from "./items-registration/items-registration.component";
import { SupplierRegistrationComponent } from "./supplier-registration/supplier-registration.component";
import { PaymentsComponent } from "./payments/payments.component";

export const InventoryRoutes: Routes = [
    { path: 'itemsRegistration', component: ItemsRegistrationComponent },
    { path: 'supplierRegistration', component: SupplierRegistrationComponent },
    { path: 'payments', component: PaymentsComponent },

]