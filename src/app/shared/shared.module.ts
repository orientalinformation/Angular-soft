import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService } from './status.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [],
  providers: [
    StatusService,
  ],
  exports: [
    CommonModule,
    TranslateModule
  ]
})
export class SharedModule { }
