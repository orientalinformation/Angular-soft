import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService } from './status.service';
import { TextService } from './text.service';
import { ApiModule } from '../api/api.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NgxLocalizedNumbers } from 'ngx-localized-numbers';
import { NgxLocalizedNumbersService } from 'ngx-localized-numbers';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';


@NgModule({
  imports: [
    CommonModule,
    LaddaModule.forRoot({
      style: 'slide-left',
    }),
    ApiModule,
    AuthenticationModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLocalizedNumbers.forRoot()
  ],
  declarations: [],
  providers: [
    StatusService,
    TextService,
    NgxLocalizedNumbersService,
    FormBuilder
  ],
  exports: [
    CommonModule,
    ApiModule,
    AuthenticationModule,
    NgxLocalizedNumbers,
    ReactiveFormsModule,
    FormsModule,
    LaddaModule
  ]
})
export class SharedModule { }
