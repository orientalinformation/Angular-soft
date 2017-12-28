import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculationRoutingModule } from './calculation-routing.module';
import { LayoutComponent } from './layout/layout.component';

import { CheckControlComponent } from './check-control/check-control.component';
import { CalculationStatusComponent } from './calculation-status/calculation-status.component';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatorComponent } from './calculator/calculator.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CalculationRoutingModule,
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    SharedModule,
    FormsModule
  ],
  declarations: [LayoutComponent, CheckControlComponent, CalculationStatusComponent, CalculatorComponent],
  exports: [
    CalculatorComponent
  ]
})
export class CalculationModule { }
