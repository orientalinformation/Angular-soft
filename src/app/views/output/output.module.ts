import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutputRoutingModule } from './output-routing.module';
import { PreliminaryComponent } from './preliminary/preliminary.component';
import { SizingComponent } from './sizing/sizing.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    OutputRoutingModule
  ],
  declarations: [PreliminaryComponent, SizingComponent, LayoutComponent]
})
export class OutputModule { }
