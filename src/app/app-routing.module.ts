import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component')
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },
      {
        path: 'privileges',
        loadChildren: () => import('./demo/pages/privileges/privileges.module').then((m) => m.PrivilegesModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./demo/pages/pages.module').then((m) => m.PagesModule) 
      },
      {
        path: 'register', // register/employee
        loadChildren: () => import('./registration/registration.module'). then((m) => m.RegistrationModule)
      },
      {
        path: 'seafarers', // seafarers
        loadChildren: () => import('./seafarers/seafarers.module'). then((m) => m.SeafarersModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module'). then((m) => m.UserModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module'). then((m) => m.LoginModule)
      }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
