import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptor } from './authentication/authentication-interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { jqxBarGaugeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxbargauge';
import { MembersLayoutComponent } from './layouts/members-layout/members-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';

import { SelectModule } from 'ng-select';

import { LOCALE_ID } from '@angular/core';

import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeFr);
registerLocaleData(localeEs);
registerLocaleData(localeDe);
registerLocaleData(localeIt);


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
import { ApiService } from './api/services';
import { registerLocaleData } from '@angular/common';

import { jqxBulletChartComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxbulletchart';
import { jqxButtonGroupComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxbuttongroup';
import { jqxButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxbuttons';
import { jqxCalendarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxcalendar';
import { jqxChartComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxchart';
import { jqxCheckBoxComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxcheckbox';
import { jqxColorPickerComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxcolorpicker';
import { jqxComboBoxComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxcombobox';
import { jqxComplexInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxcomplexinput';
import { jqxDataTableComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdatatable';
import { jqxDateTimeInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxDockingComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdocking';
import { jqxDockingLayoutComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdockinglayout';
import { jqxDockPanelComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdockpanel';
import { jqxDragDropComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdragdrop';
import { jqxDrawComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdraw';
import { jqxDropDownButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxDropDownListComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxEditorComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxeditor';
import { jqxExpanderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxexpander';
import { jqxFileUploadComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxfileupload';
import { jqxFormattedInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxformattedinput';
import { jqxGaugeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgauge';
import { jqxInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxinput';
import { jqxKanbanComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import { jqxKnobComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxknob';
import { jqxLayoutComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxlayout';
import { jqxLinearGaugeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxlineargauge';
import { jqxLinkButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxlinkbutton';
import { jqxListBoxComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxlistbox';
import { jqxListMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxlistmenu';
import { jqxLoaderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxloader';
import { jqxMaskedInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmaskedinput';
import { jqxMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmenu';
import { jqxNavBarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnavbar';
import { jqxNavigationBarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnavigationbar';
import { jqxNotificationComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnotification';
import { jqxNumberInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnumberinput';
import { jqxPanelComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxpanel';
import { jqxPasswordInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxpasswordinput';
import { jqxPivotDesignerComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxpivotdesigner';
import { jqxPivotGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxpivotgrid';
import { jqxPopoverComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxpopover';
import { jqxProgressBarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxprogressbar';
import { jqxRadioButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxradiobutton';
import { jqxRangeSelectorComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxrangeselector';
import { jqxRatingComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxrating';
import { jqxRepeatButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxrepeatbutton';
import { jqxResponsivePanelComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxresponsivepanel';
import { jqxRibbonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxribbon';
import { jqxSchedulerComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxscheduler';
import { jqxScrollBarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxscrollbar';
import { jqxScrollViewComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxscrollview';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { jqxSortableComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxsortable';
import { jqxSplitterComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxsplitter';
import { jqxSwitchButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxswitchbutton';
import { jqxTabsComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtabs';
import { jqxTagCloudComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtagcloud';
import { jqxTextAreaComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtextarea';
import { jqxToggleButtonComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtogglebutton';
import { jqxToolBarComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtoolbar';
import { jqxTooltipComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtooltip';
import { jqxTreeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtree';
import { jqxTreeGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtreegrid';
import { jqxTreeMapComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtreemap';
import { jqxValidatorComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxvalidator';
import { jqxWindowComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxwindow';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
    jqxBarGaugeComponent,
    MembersLayoutComponent,
    AuthLayoutComponent,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    DashboardLayoutComponent,
    AppSysUtilzComponent,
    jqxBulletChartComponent,
    jqxButtonGroupComponent,
    jqxButtonComponent,
    jqxCalendarComponent,
    jqxChartComponent,
    jqxCheckBoxComponent,
    jqxColorPickerComponent,
    jqxComboBoxComponent,
    jqxComplexInputComponent,
    jqxDataTableComponent,
    jqxDateTimeInputComponent,
    jqxDockingComponent,
    jqxDockingLayoutComponent,
    jqxDockPanelComponent,
    jqxDragDropComponent,
    jqxDrawComponent,
    jqxDropDownButtonComponent,
    jqxDropDownListComponent,
    jqxEditorComponent,
    jqxExpanderComponent,
    jqxFileUploadComponent,
    jqxFormattedInputComponent,
    jqxGaugeComponent,
    jqxInputComponent,
    jqxKanbanComponent,
    jqxKnobComponent,
    jqxLayoutComponent,
    jqxLinearGaugeComponent,
    jqxLinkButtonComponent,
    jqxListBoxComponent,
    jqxListMenuComponent,
    jqxLoaderComponent,
    jqxMaskedInputComponent,
    jqxMenuComponent,
    jqxNavBarComponent,
    jqxNavigationBarComponent,
    jqxNotificationComponent,
    jqxNumberInputComponent,
    jqxPanelComponent,
    jqxPasswordInputComponent,
    jqxPivotDesignerComponent,
    jqxPivotGridComponent,
    jqxPopoverComponent,
    jqxProgressBarComponent,
    jqxRadioButtonComponent,
    jqxRangeSelectorComponent,
    jqxRatingComponent,
    jqxRepeatButtonComponent,
    jqxResponsivePanelComponent,
    jqxRibbonComponent,
    jqxSchedulerComponent,
    jqxScrollBarComponent,
    jqxScrollViewComponent,
    jqxSliderComponent,
    jqxSortableComponent,
    jqxSplitterComponent,
    jqxSwitchButtonComponent,
    jqxTabsComponent,
    jqxTagCloudComponent,
    jqxTextAreaComponent,
    jqxToggleButtonComponent,
    jqxToolBarComponent,
    jqxTooltipComponent,
    jqxTreeComponent,
    jqxTreeGridComponent,
    jqxTreeMapComponent,
    jqxValidatorComponent,
    jqxWindowComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    SelectModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
    SharedModule,
    ApiModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    SweetAlert2Module.forRoot({
    })
  ],
  providers: [
    AuthGuard,
    StudyRequiredGuard,
    StatusService,
    ApiService,
    AuthenticationService,
    AuthenticationInterceptor,
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
