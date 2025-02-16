import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemPrivilegesComponent } from './system-privileges/system-privileges.component';
import { RouterModule } from '@angular/router';
import { PrivilegesRoutes } from './privileges.routing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PrivilegeGroupsComponent } from './privilege-groups/privilege-groups.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PrivilegeGroupsAddEditComponent } from './privilege-groups-add-edit/privilege-groups-add-edit.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { CdkContextMenuTrigger, CdkMenuItem, CdkMenu } from '@angular/cdk/menu';
import { MatMenuModule } from '@angular/material/menu';
import { AddRemoveTableComponent } from '../add-remove-table/add-remove-table.component';

@NgModule({
  declarations: [
    SystemPrivilegesComponent,
    PrivilegeGroupsComponent,
    PrivilegeGroupsAddEditComponent,
    AddRemoveTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PrivilegesRoutes),
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSortModule,
    CdkContextMenuTrigger,
    CdkMenuItem,
    CdkMenu,
    MatMenuModule
  ]
})
export class PrivilegesModule {}
