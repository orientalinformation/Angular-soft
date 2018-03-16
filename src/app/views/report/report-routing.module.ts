import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ReportConfigComponent } from './report-config/report-config.component';
import { ReportPdfviewerComponent } from './report-pdfviewer/report-pdfviewer.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'reportconfig',
        pathMatch: 'full',
      },
      {
        path: 'reportconfig',
        component: ReportConfigComponent,
      },
      {
        path: 'reportview',
        component: ReportPdfviewerComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
