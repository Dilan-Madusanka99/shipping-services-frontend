import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsRoutes } from './charts.routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatRadioModule } from '@angular/material/radio';
import { SeafarersRegisteredByMonthlyComponent } from './seafarers-registered-by-monthly/seafarers-registered-by-monthly.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [SeafarersRegisteredByMonthlyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ChartsRoutes),
    ReactiveFormsModule,
    MaterialModule,
    MatRadioModule,
    FormsModule,
    NgApexchartsModule
  ]
})
export class ChartsModule {}
