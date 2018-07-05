import { Component, OnInit, AfterViewInit  } from '@angular/core';

import {ApiService } from '../../../api/services';
import * as Models from '../../../api/models';
import { User, Translation, Langue } from '../../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLabel } from '../../../api/models/change-label';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit, AfterViewInit  {
  public activePage = '';
  public showLabelRef: Array<any> = [];
  public showLabelTrans: Array<any> = [];
  public langNames: Array<any> = [];
  public trans: Translation;
  public chooseRef: number;
  public chooseTrans: number;
  constructor( private api: ApiService, private translate: TranslateService, private toastr: ToastrService) {
    }

  ngOnInit() {
    this.activePage = 'datalabel';
    this.chooseRef = 1;
    this.chooseTrans = 1;
  }

  ngAfterViewInit() {
    this.refeshView();
  }

  openPageInterface() {
    this.activePage = 'interface';
  }

  openPageDataLabel() {
    this.activePage = 'datalabel';
  }
  refeshView() {
    this.api.getDefaultLanguage().subscribe(
      data => {
          this.langNames = data.langName;
          this.showLabelRef = data.referenceLangs;
          this.showLabelTrans = data.translationLangs;
      });
  }

  changeTrans() {
    const params = {
      id: this.chooseRef,
      idtrans: this.chooseTrans
    };
    this.api.filterTrans(params).subscribe(
      data => {
        this.showLabelTrans = data.translation;
        this.showLabelRef = data.referenceLangs;
      }
    );
  }

  updateLabel() {
    const changeLabel: ChangeLabel[] = [];
      for (let i = 0; i < this.showLabelTrans.length; i++) {
        changeLabel.push({
          CODE_LANGUE: this.showLabelTrans[i].CODE_LANGUE,
          ID_TRANSLATION: this.showLabelTrans[i].ID_TRANSLATION,
          TRANS_TYPE: this.showLabelTrans[i].TRANS_TYPE,
          LABEL: this.showLabelTrans[i].LABEL,
        });
      }
      // console.log(changeLabel);
        this.api.changeLabels(changeLabel).subscribe(
          data => {
            this.refeshView();
            this.toastr.success(this.translate.instant('Save label completed!'), 'Success');
      });
  }
}
