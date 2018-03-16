import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportConfigComponent } from './report-config/report-config.component';
import { LayoutComponent } from './layout/layout.component';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReportPdfviewerComponent } from './report-pdfviewer/report-pdfviewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReportRoutingModule,
    CommonModule,
    PdfViewerModule,
    FormsModule,
    SharedModule,
    TranslateModule.forChild(),
    ModalModule.forRoot()
  ],
  declarations: [
    LayoutComponent,
    ReportConfigComponent,
    ReportPdfviewerComponent,
  ]
})
export class ReportModule { }
