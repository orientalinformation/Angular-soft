import { Component, OnInit, AfterViewInit  } from '@angular/core';

import { ApiService, AdminService } from '../../../api/services';
import * as Models from '../../../api/models';
import { User, Translation, Langue, ViewStran } from '../../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLabel } from '../../../api/models/change-label';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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
  public adminTran: Array<ViewStran> = [];
  public isLoading = false;
  public changeLange = 1;

  constructor(private api: ApiService, private translate: TranslateService, private toastr: ToastrService,
    private http: HttpClient, private apiAdmin: AdminService) {}

  ngOnInit() {
    this.activePage = 'interface';
    this.chooseRef = 1;
    this.chooseTrans = 1;
    this.isLoading = true;
  }

  ngAfterViewInit() {
    this.isLoading = true;
    this.refeshView();

    this.isLoading = true;
    this.getJSON().subscribe(
      data => {
        const dataV = [];
        Object.keys(data).forEach(function(key) {
          // console.log('Key : ' + key + ', Value : ' + data[key]);
          const dataTran  = new ViewStran();
          dataTran.key = key;
          dataTran.value = data[key];
          dataV.push(dataTran);
        });
        this.adminTran = dataV;
        // console.log(this.adminTran);
      },
      err => {},
      () => {
        this.isLoading = false;
      }
    );
  }

  openPageInterface() {
    this.activePage = 'interface';
  }

  openPageDataLabel() {
    this.activePage = 'datalabel';
  }

  refeshView() {
    this.isLoading = true;
    this.api.getDefaultLanguage().subscribe(
      data => {
        this.langNames = data.langName;
        this.showLabelRef = data.referenceLangs;
        this.showLabelTrans = data.translationLangs;
      },
      err => {},
      () => {
        this.isLoading = false;
      }
    );
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
      },
      err => {},
      () => {}
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

    this.api.changeLabels(changeLabel).subscribe(
      data => {
        this.refeshView();
        this.toastr.success(this.translate.instant('Save label completed!'), 'Success');
      },
      err => {},
      () => {}
    );
  }

  public getJSON(): Observable<any> {
    const userLogon = JSON.parse(localStorage.getItem('user'));
    let langname = 'en';
    if (Number(userLogon.CODE_LANGUE) === 1) {
      langname = 'en';
    } else if (Number(userLogon.CODE_LANGUE) === 2) {
      langname = 'fr';
    } else if (Number(userLogon.CODE_LANGUE) === 3) {
      langname = 'it';
    } else if (Number(userLogon.CODE_LANGUE) === 4) {
      langname = 'de';
    } else if (Number(userLogon.CODE_LANGUE) === 5) {
      langname = 'es';
    }
    return this.http.get('./assets/i18n/' + langname + '.json');
  }

  public loadJsonFile(change) {
    this.changeLange = change;
    this.isLoading = true;
    this.getChangeJSON(change).subscribe(
      data => {
        const dataV = [];
        Object.keys(data).forEach(function(key) {
          const dataTran  = new ViewStran();
          dataTran.key = key;
          dataTran.value = data[key];
          dataV.push(dataTran);
        });
        this.adminTran = dataV;
      },
      err => {},
      () => {
        this.isLoading = false;
      }
    );
  }

  public getChangeJSON(change): Observable<any> {
    let langname = 'en';
    if (Number(change) === 1) {
      langname = 'en';
    } else if (Number(change) === 2) {
      langname = 'fr';
    } else if (Number(change) === 3) {
      langname = 'it';
    } else if (Number(change) === 4) {
      langname = 'de';
    } else if (Number(change) === 5) {
      langname = 'es';
    }
    return this.http.get('./assets/i18n/' + langname + '.json');
  }

  public updateTran(change) {
    this.apiAdmin.saveFileTranslate({
      admintrans: this.adminTran,
      idlang: change
    }).subscribe(
      datatran => {
        this.toastr.success(this.translate.instant('Save interface completed!'), 'Success');
      },
      err => {},
      () => {}
    );
  }
}
