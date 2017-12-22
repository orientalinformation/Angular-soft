import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferencesRoutingModule } from './references-routing.module';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    ReferencesRoutingModule
  ],
  declarations: [LayoutComponent]
})
export class ReferencesModule { }
