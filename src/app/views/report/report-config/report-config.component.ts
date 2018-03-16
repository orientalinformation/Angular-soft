import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as Models from '../../../api/models';
import { ApiService } from '../../../api/services/api.service';

import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit, AfterViewInit {
  public report: Models.Report;
  public study: Models.Study;
  public isSaveReport = false;
  public meshAxisPos: Models.ViewMeshPosition;
  public checkcontrol = false;
  public user: Models.User;
  public studyID: any;
  public optionSelected: number;
  public typeGenerate: number;
  public loading: boolean;
  public laddaGenerate = false;
  public fileToUpload: File = null;
  public checkUpload = 0;
  public urlLogo = '';
  public urlFirstpage = '';

  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private http: HttpClient) {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.optionSelected = 0;
    this.typeGenerate = 0;
  }

  ngAfterViewInit() {
    const params: ApiService.CheckControlViewParams = {
      idStudy: this.study.ID_STUDY,
      idProd: this.study.ID_PROD
    };
    this.api.checkControl(params).subscribe(
      data => {
        this.checkcontrol = data.checkcontrol;
        if (!data.checkcontrol) {
          this.router.navigate(['/calculation/check-control']);
          swal('Oops..', 'Report is available only when equipments are calculated numerically', 'error');
        }
      }
    );
    this.loadReport();
    this.loadMeshAxisPos();
  }

  loadReport() {
    this.api.getReport(this.study.ID_STUDY).subscribe(
      resp => {
        localStorage.setItem('ip', resp.ip);
        resp.ASSES_CONSUMP = Number(resp.ASSES_CONSUMP);
        resp.ASSES_ECO = Number(resp.ASSES_ECO);
        resp.ASSES_TERMAL = Number(resp.ASSES_TERMAL);
        resp.ASSES_TR = Number(resp.ASSES_TR);
        resp.ASSES_TR_MAX = Number(resp.ASSES_TR_MAX);
        resp.ASSES_TR_MIN = Number(resp.ASSES_TR_MIN);
        resp.CONS_DAY = Number(resp.CONS_DAY);
        resp.CONS_EQUIP = Number(resp.CONS_EQUIP);
        resp.CONS_HOUR = Number(resp.CONS_HOUR);
        resp.CONS_MONTH = Number(resp.CONS_MONTH);
        resp.CONS_OVERALL = Number(resp.CONS_OVERALL);
        resp.CONS_PIPE = Number(resp.CONS_PIPE);
        resp.CONS_SPECIFIC = Number(resp.CONS_SPECIFIC);
        resp.CONS_TANK = Number(resp.CONS_TANK);
        resp.CONS_TOTAL = Number(resp.CONS_TOTAL);
        resp.CONS_WEEK = Number(resp.CONS_WEEK);
        resp.CONS_YEAR = Number(resp.CONS_YEAR);
        resp.CONTOUR2D_G = Number(resp.CONTOUR2D_G);
        resp.CONTOUR2D_OUTLINE_TIME = Number(resp.CONTOUR2D_OUTLINE_TIME);
        resp.CONTOUR2D_SAMPLE = Number(resp.CONTOUR2D_SAMPLE);
        resp.ENTHALPY_G = Number(resp.ENTHALPY_G);
        resp.ENTHALPY_SAMPLE = Number(resp.ENTHALPY_SAMPLE);
        resp.ENTHALPY_V = Number(resp.ENTHALPY_V);
        resp.EQUIP_LIST = Number(resp.EQUIP_LIST);
        resp.EQUIP_PARAM = Number(resp.EQUIP_PARAM);
        resp.ISOCHRONE_G = Number(resp.ISOCHRONE_G);
        resp.ISOCHRONE_SAMPLE = Number(resp.ISOCHRONE_SAMPLE);
        resp.ISOCHRONE_V = Number(resp.ISOCHRONE_V);
        resp.ISOVALUE_G = Number(resp.ISOVALUE_G);
        resp.ISOVALUE_SAMPLE = Number(resp.ISOVALUE_SAMPLE);
        resp.ISOVALUE_V = Number(resp.ISOVALUE_V);
        resp.PACKING = Number(resp.PACKING);
        resp.PIPELINE = Number(resp.PIPELINE);
        resp.PROD_3D = Number(resp.PROD_3D);
        resp.PROD_LIST = Number(resp.PROD_LIST);
        resp.PROD_TEMP = Number(resp.PROD_TEMP);
        resp.REP_CONS_PIE = Number(resp.REP_CONS_PIE);
        resp.REP_CUSTOMER = Number(resp.REP_CUSTOMER);
        resp.SIZING_GRAPHE = Number(resp.SIZING_GRAPHE);
        resp.SIZING_TEMP_G = Number(resp.SIZING_TEMP_G);
        resp.SIZING_TEMP_SAMPLE = Number(resp.SIZING_TEMP_SAMPLE);
        resp.SIZING_TEMP_V = Number(resp.SIZING_TEMP_V);
        resp.SIZING_TR = Number(resp.SIZING_TR);
        resp.SIZING_TR_MAX = Number(resp.SIZING_TR_MAX);
        resp.SIZING_TR_MIN = Number(resp.SIZING_TR_MIN);
        resp.SIZING_VALUES = Number(resp.SIZING_VALUES);

        this.report = resp;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  loadMeshAxisPos() {
    this.api.getMeshAxisPos(this.study.ID_STUDY)
      .subscribe(
      resp => {
        this.meshAxisPos = resp;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  saveContentReport() {
    if (Number(this.user.ID_USER) === Number(this.study.ID_USER)) {
      this.isSaveReport = true;
      this.api.saveReport({
        id: this.study.ID_STUDY,
        body: this.report
      })
        .subscribe(
        resp => {
          if (resp === 1) {
            this.toastr.success('Save report of user success', 'successfully');
          } else {
            swal('Oops..', 'Save report error!', 'error');
          }
          this.isSaveReport = false;
        },
        err => {
          console.log(err);
          this.isSaveReport = false;
        },
        () => {
          this.isSaveReport = false;
        }
      );
    } else {
      this.toastr.success('Save report', 'successfully');
    }
  }

  viewPDF() {
    this.api.downLoadPDF(this.study.ID_STUDY).subscribe(
    data => {
      window.location.href = data.url;
    },
    err => {
      console.log(err);
      swal('Oops..', 'Generate the report have some error!', 'error');
      this.laddaGenerate = false;
    },
    () => {
    }
  );
  }

  viewHTML() {
    this.api.downLoadHtmlToPDF(this.study.ID_STUDY).subscribe(
      data => {
        window.location.href = data.url;
      },
      err => {
        console.log(err);
        swal('Oops..', 'Generate the report have some error!', 'error');
        this.laddaGenerate = false;
      },
      () => {
      }
    );
  }

  generatePDF() {
    if (Number(this.typeGenerate) === 1) {
      this.loading = true;
      this.laddaGenerate = true;
      this.viewPDF();
    } else if (Number(this.typeGenerate) === 0)  {
      this.loading = true;
      this.laddaGenerate = true;
      this.viewHTML();
    }
  }

  handleFileInput(files: FileList) {
    this.checkUpload = 1;
    this.fileToUpload = files.item(0);
    console.log('logo');
    this.uploadFileToActivity();
  }

  handleFilePhotoPath(files: FileList) {
    this.checkUpload = 2;
    this.fileToUpload = files.item(0);
    console.log('photo path');
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.postFile(this.fileToUpload).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = localStorage.getItem('ip') + '/api/v1/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData, {responseType: 'text'}).map(res => {
      if (this.checkUpload === 1) {
        this.report.CUSTOMER_LOGO = res;
      } else if (this.checkUpload === 2) {
        this.report.PHOTO_PATH = res;
      }

      return true;
    });
  }
}

