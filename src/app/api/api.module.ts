import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration } from './api-configuration';

import { ApiService } from './services/api.service';
import { AdminService } from './services/admin.service';
import { CalculatorService } from './services/calculator.service';
import { ChainingService } from './services/chaining.service';
import { InputService } from './services/input.service';
import { MinmaxService } from './services/minmax.service';
import { ReferencedataService } from './services/referencedata.service';
import { ProfileService } from './services/profile.service';
import { New3dService } from './services/new-3d.service';
import { WarningService } from './services/warning.service';

/**
 * Module that provides instances for all API services
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiConfiguration,
   ApiService,
   AdminService,
   CalculatorService,
   ChainingService,
   InputService,
   MinmaxService,
   ReferencedataService,
   ProfileService,
   New3dService,
   WarningService
  ],
})
export class ApiModule { }
