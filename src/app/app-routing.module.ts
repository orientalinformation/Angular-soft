import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MembersLayoutComponent } from './layouts/members-layout/members-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { StudyRequiredGuard } from './guards/study-required.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { InputModule } from './views/input/input.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  /**
   * MEMBER LAYOUTS
   */
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'setting',
        loadChildren: './views/settings/settings.module#SettingsModule'
      }
    ]
  },
  {
    path: '',
    component: MembersLayoutComponent,
    canActivate: [AuthGuard, StudyRequiredGuard],
    children: [
      {
        path: 'input',
        loadChildren: './views/input/input.module#InputModule'
      },
      {
        path: 'calculation',
        loadChildren: './views/calculation/calculation.module#CalculationModule'
      },
      {
        path: 'output',
        loadChildren: './views/output/output.module#OutputModule'
      },
      {
        path: 'report',
        loadChildren: './views/report/report.module#ReportModule'
      }
    ]
  },
  /**
   * AUTHENTICATION LAYOUT
   */
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      }, {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
      }
    ]
  },
  { // 404
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
