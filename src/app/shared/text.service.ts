import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../api/services';
import { Translation } from '../api/models/translation';

@Injectable()
export class TextService {
  private _initialized = false;

  constructor(private translate: TranslateService, private api: ApiService) { }

  initialize() {
    this.api.getComponentTranslations(this.translate.currentLang)
      .subscribe(
        (data: Translation[]) => {
          console.log('got components translations');
          data.forEach(
            (each, index) => {
              this.translate.set(
                'components.' + each.ID_TRANSLATION.toString(),
                each.LABEL,
                this.translate.currentLang
               );
            }
          );
          console.log('add components translations complete');
          this._initialized = true;
        }
      );

    this.api.getPackingTranslations(this.translate.currentLang)
      .subscribe(
      (data: Translation[]) => {
        console.log('got packing translations');
        data.forEach(
          (each, index) => {
            this.translate.set(
              'packings.' + each.ID_TRANSLATION.toString(),
              each.LABEL,
              this.translate.currentLang
            );
          }
        );
        console.log('add packing translations complete');
        this._initialized = true;
      }
      );
  }

  public componentName(id: number) {
    return this.translate.instant('components.' + id.toString());
  }

  public packingLayer(id: number) {
    return this.translate.instant('packings.' + id.toString());
  }

}
