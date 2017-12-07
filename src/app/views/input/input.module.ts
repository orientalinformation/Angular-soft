import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputRoutingModule } from './input-routing.module';
import { ObjectivesComponent } from './objectives/objectives.component';
import { ProductComponent } from './product/product.component';
import { InitialComponent } from './initial/initial.component';
import { PackingComponent } from './packing/packing.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { LineComponent } from './line/line.component';
import { StudyRequiredGuard } from '../../guards/study-required.guard';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';

import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    InputRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ObjectivesComponent, ProductComponent, InitialComponent,
    PackingComponent, EquipmentComponent, LineComponent, LayoutComponent,
    jqxGridComponent
  ],
  providers: [
    StudyRequiredGuard
  ]
})
export class InputModule { }
