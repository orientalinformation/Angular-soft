import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { UnitsComponent } from './units/units.component';
import { TranslationsComponent } from './translations/translations.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ModalModule,
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [UsersComponent, UnitsComponent, TranslationsComponent]
})
export class AdminModule { }
