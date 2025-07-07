import { Routes } from "@angular/router";
import { ItemsRegistrationComponent } from "./items-registration/items-registration.component";
import { SupplierRegistrationComponent } from "./supplier-registration/supplier-registration.component";

export const InventoryRoutes: Routes = [
    { path: 'itemsRegistration', component: ItemsRegistrationComponent },
    { path: 'supplierRegistration', component: SupplierRegistrationComponent },

]