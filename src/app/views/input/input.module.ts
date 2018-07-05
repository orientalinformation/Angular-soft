import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InputRoutingModule } from './input-routing.module';
import { ObjectivesComponent } from './objectives/objectives.component';
import { ProductComponent, CompFilterPipe } from './product/product.component';
import { InitialComponent } from './initial/initial.component';
import { PackingComponent } from './packing/packing.component';
import { EquipmentComponent, FilterPipe } from './equipment/equipment.component';
import { LineComponent } from './line/line.component';
import { StudyRequiredGuard } from '../../guards/study-required.guard';
import { LayoutComponent } from './layout/layout.component';

import { ModalModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SelectModule } from 'ng2-select';
import { SharedModule } from '../../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChainingComponent } from './chaining/chaining.component';
import { ThreedviewComponent } from './threedview/threedview.component';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    SelectModule,
    InputRoutingModule,
    SharedModule,
    TabsModule.forRoot(),
    PerfectScrollbarModule,
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    NgbModule.forRoot(),
    BootstrapSwitchModule.forRoot()
  ],
  declarations: [
    ObjectivesComponent, ProductComponent, InitialComponent,
    PackingComponent, EquipmentComponent, LineComponent, LayoutComponent,
    CompFilterPipe,
    FilterPipe,
    ChainingComponent,
    ThreedviewComponent
  ],
  providers: [
    StudyRequiredGuard
  ]
})
export class InputModule { }
