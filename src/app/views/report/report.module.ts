import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportConfigComponent } from './report-config/report-config.component';
import { LayoutComponent } from './layout/layout.component';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    ReportRoutingModule,
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    ModalModule.forRoot()
  ],
  declarations: [
    ReportConfigComponent,
    LayoutComponent,
  ]
})
export class ReportModule { }
