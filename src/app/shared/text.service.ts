import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../api/services';
import { Translation } from '../api/models/translation';

@Injectable()
export class TextService {
  private _initialized = false;

  public shapeNames = {
    SLAB: 1,
    REC_STAND: 2,
    REC_LAY: 3,
    CYL_STAND: 4,
    CYL_LAY: 5,
    SPHERE: 6,
    CON_CYL_STAND: 7,
    CON_CYL_LAY: 8,
    BREAD: 9,
    D_REC_BLOCK_V: 10,
    D_REC_BLOCK_H: 11,
    D_STAND_CYL: 12,
    D_LYI_CYL: 13,
    D_SPHERE: 14,
    D_STAND_CON_CYL: 15,
    D_LYN_CON_CYL: 16,
    D_REC_BLOCK: 17,
    D_TRAP_3D: 18,
    D_STAND_OVAL: 19,
    D_LYN_OVAL: 20,
    D_STAND_CON_OVAL: 21,
    D_LYN_CON_OVAL: 22,
    D_SEMI_CYL: 23
  };

  constructor(private translate: TranslateService, private api: ApiService) { }

  initialize() {
    this.api.getComponentTranslations(this.translate.currentLang)
      .subscribe(
        (data: Translation[]) => {
          // console.log('got components translations');
          data.forEach(
            (each, index) => {
              this.translate.set(
                'components.' + each.ID_TRANSLATION.toString(),
                each.LABEL,
                this.translate.currentLang
               );
            }
          );
          // console.log('add components translations complete');
          this._initialized = true;
        }
      );

    this.api.getPackingTranslations(this.translate.currentLang)
      .subscribe(
      (data: Translation[]) => {
        // console.log('got packing translations');
        data.forEach(
          (each, index) => {
            this.translate.set(
              'packings.' + each.ID_TRANSLATION.toString(),
              each.LABEL,
              this.translate.currentLang
            );
          }
        );
        // console.log('add packing translations complete');
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
