import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptor } from './authentication/authentication-interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MembersLayoutComponent } from './layouts/members-layout/members-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { NoStudyGuard } from './guards/no-study.guard';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { SharedModule } from './shared/shared.module';

import { SelectModule } from 'ng-select';
import { ProfileModule } from './views/profile/profile.module';
import { ReferencesModule } from './views/references/references.module';
import { SettingsModule } from './views/settings/settings.module';
import { AdminModule } from './views/admin/admin.module';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
];

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
];

// Import 3rd party components
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { StudyRequiredGuard } from './guards/study-required.guard';
import { StatusService } from './shared/status.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AppSysUtilzComponent } from './components/app-sys-utilz/app-sys-utilz.component';
import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthenticationModule } from './authentication/authentication.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { TooltipModule } from 'ngx-bootstrap';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MembersLayoutComponent,
    AuthLayoutComponent,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    DashboardLayoutComponent,
    AppSysUtilzComponent,
    ProfileLayoutComponent,
    AdminLayoutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SelectModule,
    HttpClientModule,
    ChartsModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    SweetAlert2Module.forRoot({
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      progressBar: false,
      preventDuplicates: true
    }),
    TooltipModule.forRoot()
  ],
  providers: [
    AuthGuard,
    StudyRequiredGuard,
    NoStudyGuard,
    StatusService,
    HttpClientModule,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
