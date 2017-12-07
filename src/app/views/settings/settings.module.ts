import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { LayoutComponent } from './layout/layout.component';

import { MeshComponent } from './mesh/mesh.component';
import { CalculationComponent } from './calculation/calculation.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
  declarations: [LayoutComponent, MeshComponent, CalculationComponent, ResultComponent]
})
export class SettingsModule { }