import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { StartPageComponent } from './start-page/start-page.component';
import { NewStudyComponent } from './new-study/new-study.component';
import { OpenStudyComponent } from './open-study/open-study.component';

import { SelectModule } from 'ng-select';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ImportComponent } from './import/import.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SelectModule,
    PerfectScrollbarModule
  ],
  declarations: [StartPageComponent, NewStudyComponent, OpenStudyComponent, ImportComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DashboardModule { }
