import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculationRoutingModule } from './calculation-routing.module';
import { LayoutComponent } from './layout/layout.component';

import { CheckControlComponent } from './check-control/check-control.component';
import { CalculateComponent } from './calculate/calculate.component';
import { CalculationStatusComponent } from './calculation-status/calculation-status.component';

@NgModule({
  imports: [
    CommonModule,
    CalculationRoutingModule
  ],
  declarations: [LayoutComponent, CheckControlComponent, CalculateComponent, CalculationStatusComponent]
})
export class CalculationModule { }
