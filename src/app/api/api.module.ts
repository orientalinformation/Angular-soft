import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration } from './api-configuration';

import { ApiService } from './services/api.service';
import { AdminService } from './services/admin.service';
import { CalculatorService } from './services/calculator.service';
import { InputService } from './services/input.service';
import { ReferencedataService } from './services/referencedata.service';
import { ProfileService } from './services/profile.service';

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
   InputService,
   ReferencedataService,
   ProfileService
  ],
})
export class ApiModule { }
