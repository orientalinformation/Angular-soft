import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
import 'rxjs/add/observable/zip';
import { Report } from '../../../api/models/report';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { Units } from '../../../api/models';

@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalGeneration') public modalGeneration: ModalDirective;
  public report: Models.Report;
  public study: Models.Study;
  public isSaveReport = false;
  public meshAxisPos: Models.ViewMeshPosition;
  public checkcontrol = false;
  public user: Models.User;
  public studyID: any;
  public optionSelected: number;
  public typeGenerate: number;
  public loading = false;
  public laddaGenerate = false;
  public fileToUpload: File = null;
  public checkUpload = 0;
  public urlLogo = '';
  public urlFirstpage = '';
  public isLoading = true;
  public reportParam: Report;
  public isRepCustomer: number;
  public isRefContRepProdList: number;
  public isRefContRepProd3D: number;
  public isRefContRepPacking: number;
  public isRefContRepEquipList: number;
  public isRefContRepPipeLine: number;
  public isRefContRepAssesConsump: number;
  public isRefContRepConsPie: number;
  public isRefContRepSizingValues: number;
  public isRefContRepSizingGraphe: number;
  public isRefContRepEnthalpyV: number;
  public isRefContRepEnthalpyG: number;
  public isRefContRepIsochroneV: number;
  public isRefContRepIsochroneG: number;
  public isRefContRepIsovalueV: number;
  public isRefContRepIsovalueG: number;
  public isRefContRep2DG: number;
  public displayProgesReport;
  public isProcessProduction = true;
  public isProcessProduct = true;
  public isProcessPacking = true;
  public isProcessEquipment = true;
  public isProcessPipeline = true;
  public isProcessConsumptionResult = false;
  public isProcessConsumptionPie = false;
  public isProcessHeatBalance = false;
  public isProcessSizing = false;
  public isProcessEnthalpie = false;
  public isProcessProductSection = false;
  public isProcessTimeBased = false;
  public isProcessContour = false;
  public isLoadingProgess = false;
  public isReportTranlation = false;
  public progressFileHtml = '';
  public iframeReport;
  public ischeckUser = true;
  public symbol: Models.Symbol;
  public shape: number;
  public countRunInterval = 0;

  // by haidt
  public listUnits: Array<Units>;
  public temperatureSymbol = '';
  public meshesSymbol = '';


  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private http: HttpClient,
     private sanitizer: DomSanitizer, private translate: TranslateService) {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.optionSelected = 0;
    this.typeGenerate = 0;
    this.checkUser();
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));

    if (this.listUnits) {

      for (let i = 0; i < this.listUnits.length; i++) {

        if (Number(this.listUnits[i].TYPE_UNIT) === 8) {
          this.temperatureSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 20) {
          this.meshesSymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.progressFileHtml = '';
    localStorage.setItem('iframeReport', this.progressFileHtml);
    this.isLoading = true;
    const params: ApiService.CheckControlViewParams = {
      idStudy: this.study.ID_STUDY,
      idProd: this.study.ID_PROD
    };
    this.api.checkControl(params).subscribe(
      data => {
        this.checkcontrol = data.checkcontrol;
        if (data.checkcontrol) {
          this.api.getSymbol(this.study.ID_STUDY).subscribe(
            dataSymbol => {
              this.symbol = dataSymbol;
              this.loadReport();
              this.loadMeshAxisPos();
            }
          );
          if (this.displayProgesReport) {
            clearInterval(this.displayProgesReport);
          }
        } else {
          this.router.navigate(['/calculation/check-control']);
          swal('Warning', this.translate.instant('The study is not completely defined	'), 'error');
          return false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.clearIntervalProgesReport();
  }

  loadReport() {
    this.api.getReport(this.study.ID_STUDY).subscribe(
      resp => {
        // console.log(resp);
        localStorage.setItem('ip', resp.ip);
        if (resp.productElmt) {
          this.shape = resp.productElmt.ID_SHAPE;
        }
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
        resp.isSizingValuesChosen = Number(resp.isSizingValuesChosen);
        resp.isSizingValuesMax = Number(resp.isSizingValuesMax);

        this.report = resp;
        // console.log(this.report);
        localStorage.setItem('reportParam', JSON.stringify(resp));
        this.reportParam = JSON.parse(localStorage.getItem('reportParam'));
      },
      err => {
        console.log(err);
        swal('Warning', this.translate.instant(err.error), 'error');
        this.router.navigate(['/output/preliminary']);
      },
      () => {

      }
    );
  }

  loadMeshAxisPos() {
    this.api.getMeshAxisPos(this.study.ID_STUDY)
      .subscribe(
      resp => {
        // console.log(resp);
        this.meshAxisPos = resp;
        this.isLoading = false;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  saveContentReport() {
    // console.log(this.report);
    if (Number(this.user.ID_USER) === Number(this.study.ID_USER)) {
      this.isSaveReport = true;
      this.api.saveReport({
        id: this.study.ID_STUDY,
        body: this.report
      }).subscribe(
        resp => {
          // console.log(this.report);
          localStorage.setItem('reportParam', JSON.stringify(this.report));
          if (resp === 1) {
            this.toastr.success(this.translate.instant('Save report of user success'), 'successfully');
          } else {
            swal('Warning', this.translate.instant('Save report error!'), 'error');
          }
          this.isSaveReport = false;
        },
        err => {
          console.log(err);
          this.toastr.error(this.translate.instant(err.error), 'error');
          this.isSaveReport = false;
        },
        () => {
          this.isSaveReport = false;
        }
      );
    }
    // else {
      // this.toastr.success('Save report', 'successfully');
    // }
  }

  viewPDF() {
    const reportParam: ApiService.DownLoadPDFParams = {
      id: this.study.ID_STUDY,
      reportParam: {
        DEST_SURNAME: this.report.DEST_SURNAME,
        DEST_NAME: this.report.DEST_NAME,
        DEST_FUNCTION: this.report.DEST_FUNCTION,
        DEST_COORD: this.report.DEST_COORD,
        PHOTO_PATH: this.report.PHOTO_PATH,
        CUSTOMER_LOGO: this.report.CUSTOMER_LOGO,
        REPORT_COMMENT: this.report.REPORT_COMMENT,
        WRITER_SURNAME: this.report.WRITER_SURNAME,
        WRITER_NAME: this.report.WRITER_NAME,
        WRITER_FUNCTION: this.report.WRITER_FUNCTION,
        WRITER_COORD: this.report.WRITER_COORD,
        // Input data
        PROD_LIST: this.report.PROD_LIST,
        PROD_3D: this.report.PROD_3D,
        EQUIP_LIST: this.report.EQUIP_LIST,
        REP_CUSTOMER: this.report.REP_CUSTOMER,
        PACKING: this.report.PACKING,
        ASSES_ECO: this.report.ASSES_ECO,
        PIPELINE: this.report.PIPELINE,
        // Calculation Output
        CONS_OVERALL: this.report.CONS_OVERALL,
        CONS_TOTAL: this.report.CONS_TOTAL,
        CONS_SPECIFIC: this.report.CONS_SPECIFIC,
        CONS_HOUR: this.report.CONS_HOUR,
        CONS_DAY: this.report.CONS_DAY,
        CONS_WEEK: this.report.CONS_WEEK,
        CONS_MONTH: this.report.CONS_MONTH,
        CONS_YEAR: this.report.CONS_YEAR,
        CONS_EQUIP: this.report.CONS_EQUIP,
        CONS_PIPE: this.report.CONS_PIPE,
        CONS_TANK: this.report.CONS_TANK,
        REP_CONS_PIE: this.report.REP_CONS_PIE,
        // Sizing
        isSizingValuesChosen: this.report.isSizingValuesChosen,
        isSizingValuesMax: this.report.isSizingValuesMax,
        SIZING_GRAPHE: this.report.SIZING_GRAPHE,
        // Enthalpies
        ENTHALPY_V: this.report.ENTHALPY_V,
        ENTHALPY_G: this.report.ENTHALPY_G,
        ENTHALPY_SAMPLE: this.report.ENTHALPY_SAMPLE,
        // product section
        ISOCHRONE_V: this.report.ISOCHRONE_V,
        ISOCHRONE_G: this.report.ISOCHRONE_G,
        ISOCHRONE_SAMPLE: this.report.ISOCHRONE_SAMPLE,
        // time base
        ISOVALUE_V: this.report.ISOVALUE_V,
        ISOVALUE_G: this.report.ISOVALUE_G,
        ISOVALUE_SAMPLE: this.report.ISOVALUE_SAMPLE,
        // Contour
        CONTOUR2D_G: this.report.CONTOUR2D_G,
        CONTOUR2D_TEMP_STEP: this.report.CONTOUR2D_TEMP_STEP,
        CONTOUR2D_TEMP_MIN: this.report.CONTOUR2D_TEMP_MIN,
        CONTOUR2D_TEMP_MAX: this.report.CONTOUR2D_TEMP_MAX,
        // AXE
        AXE1_X: this.report.AXE1_X,
        AXE1_Y: this.report.AXE1_Y,
        AXE2_X: this.report. AXE2_X,
        AXE2_Z: this.report.AXE2_Z,
        AXE3_Y: this.report.AXE3_Y,
        AXE3_Z: this.report.AXE3_Z,
        POINT1_X: this.report.POINT1_X,
        POINT1_Y: this.report.POINT1_Y,
        POINT1_Z: this.report.POINT1_Z,
        POINT2_X: this.report.POINT2_X,
        POINT2_Y: this.report.POINT2_Y,
        POINT2_Z: this.report.POINT2_Z,
        POINT3_X: this.report.POINT3_X,
        POINT3_Y: this.report.POINT3_Y,
        POINT3_Z: this.report.POINT3_Z,
        PLAN_Y: this.report.PLAN_Y,
        PLAN_Z: this.report.PLAN_Z,
      },
    };
    this.api.downLoadPDF(reportParam).subscribe(
    data => {
      /*this.isLoadingProgess = false;
      this.progressFileHtml = data.url;
      localStorage.setItem('iframeReport', this.progressFileHtml);
      this.modalGeneration.hide();
      this.router.navigate(['/report/reportview']);*/
    },
    err => {
      console.log(err);
      this.laddaGenerate = false;
    },
    () => {
      this.laddaGenerate = false;
    }
  );
  }

  viewHTML() {
    const reportParam: ApiService.DownLoadHtmlToPDFParams = {
      id: this.study.ID_STUDY,
      reportParam: {
        DEST_SURNAME: this.report.DEST_SURNAME,
        DEST_NAME: this.report.DEST_NAME,
        DEST_FUNCTION: this.report.DEST_FUNCTION,
        DEST_COORD: this.report.DEST_COORD,
        PHOTO_PATH: this.report.PHOTO_PATH,
        CUSTOMER_LOGO: this.report.CUSTOMER_LOGO,
        REPORT_COMMENT: this.report.REPORT_COMMENT,
        WRITER_SURNAME: this.report.WRITER_SURNAME,
        WRITER_NAME: this.report.WRITER_NAME,
        WRITER_FUNCTION: this.report.WRITER_FUNCTION,
        WRITER_COORD: this.report.WRITER_COORD,
        // Input data
        PROD_LIST: this.report.PROD_LIST,
        PROD_3D: this.report.PROD_3D,
        EQUIP_LIST: this.report.EQUIP_LIST,
        REP_CUSTOMER: this.report.REP_CUSTOMER,
        PACKING: this.report.PACKING,
        ASSES_ECO: this.report.ASSES_ECO,
        PIPELINE: this.report.PIPELINE,
        // Calculation Output
        CONS_OVERALL: this.report.CONS_OVERALL,
        CONS_TOTAL: this.report.CONS_TOTAL,
        CONS_SPECIFIC: this.report.CONS_SPECIFIC,
        CONS_HOUR: this.report.CONS_HOUR,
        CONS_DAY: this.report.CONS_DAY,
        CONS_WEEK: this.report.CONS_WEEK,
        CONS_MONTH: this.report.CONS_MONTH,
        CONS_YEAR: this.report.CONS_YEAR,
        CONS_EQUIP: this.report.CONS_EQUIP,
        CONS_PIPE: this.report.CONS_PIPE,
        CONS_TANK: this.report.CONS_TANK,
        REP_CONS_PIE: this.report.REP_CONS_PIE,
        // Sizing
        isSizingValuesChosen: this.report.isSizingValuesChosen,
        isSizingValuesMax: this.report.isSizingValuesMax,
        SIZING_GRAPHE: this.report.SIZING_GRAPHE,
        // Enthalpies
        ENTHALPY_V: this.report.ENTHALPY_V,
        ENTHALPY_G: this.report.ENTHALPY_G,
        ENTHALPY_SAMPLE: this.report.ENTHALPY_SAMPLE,
        // product section
        ISOCHRONE_V: this.report.ISOCHRONE_V,
        ISOCHRONE_G: this.report.ISOCHRONE_G,
        ISOCHRONE_SAMPLE: this.report.ISOCHRONE_SAMPLE,
        // time base
        ISOVALUE_V: this.report.ISOVALUE_V,
        ISOVALUE_G: this.report.ISOVALUE_G,
        ISOVALUE_SAMPLE: this.report.ISOVALUE_SAMPLE,
        // Contour
        CONTOUR2D_G: this.report.CONTOUR2D_G,
        CONTOUR2D_TEMP_STEP: this.report.CONTOUR2D_TEMP_STEP,
        CONTOUR2D_TEMP_MIN: this.report.CONTOUR2D_TEMP_MIN,
        CONTOUR2D_TEMP_MAX: this.report.CONTOUR2D_TEMP_MAX,
        // AXE
        AXE1_X: this.report.AXE1_X,
        AXE1_Y: this.report.AXE1_Y,
        AXE2_X: this.report. AXE2_X,
        AXE2_Z: this.report.AXE2_Z,
        AXE3_Y: this.report.AXE3_Y,
        AXE3_Z: this.report.AXE3_Z,
        POINT1_X: this.report.POINT1_X,
        POINT1_Y: this.report.POINT1_Y,
        POINT1_Z: this.report.POINT1_Z,
        POINT2_X: this.report.POINT2_X,
        POINT2_Y: this.report.POINT2_Y,
        POINT2_Z: this.report.POINT2_Z,
        POINT3_X: this.report.POINT3_X,
        POINT3_Y: this.report.POINT3_Y,
        POINT3_Z: this.report.POINT3_Z,
        PLAN_Y: this.report.PLAN_Y,
        PLAN_Z: this.report.PLAN_Z,
        countRunInterval: this.countRunInterval
      },
    };
    /*this.api.downLoadHtmlToPDF(reportParam).subscribe(
      data => {
        this.isLoadingProgess = false;
        this.progressFileHtml = data.url;
        localStorage.setItem('iframeReport', this.progressFileHtml);
        clearInterval(this.displayProgesReport);
        this.modalGeneration.hide();
        this.router.navigate(['/report/reportview']);
      },
      err => {
        console.log(err);
      },
      () => {
        this.laddaGenerate = false;
      }*/
    this.api.downLoadHtmlToPDF(reportParam).subscribe(
      data => {
        /*this.isLoadingProgess = false;
        this.progressFileHtml = data.url;
        localStorage.setItem('iframeReport', this.progressFileHtml);
        this.modalGeneration.hide();
        this.router.navigate(['/report/reportview']);*/
      },
      err => {
        console.log(err);
      },
      () => {
        this.laddaGenerate = false;
      }
    );
  }

  generatePDF() {
    // console.log(this.reportParam.AXE1_X);
    this.showContentReportWaiting(this.typeGenerate);
    this.saveContentReport();
    this.loading = true;
  }

  showContentReportWaiting(typeGenerate) {
    // console.log(this.report);
    // console.log(this.reportParam);
    this.isRepCustomer = this.report.REP_CUSTOMER;
    this.isRefContRepProdList = this.report.PROD_LIST;
    this.isRefContRepProd3D = this.report.PROD_3D;
    this.isRefContRepPacking = this.report.PACKING;
    this.isRefContRepEquipList = this.report.EQUIP_LIST;
    this.isRefContRepPipeLine = this.report.PIPELINE;
    this.isRefContRepAssesConsump = this.report.ASSES_CONSUMP;
    this.isRefContRepConsPie = this.report.REP_CONS_PIE;
    this.isRefContRepSizingValues = this.report.SIZING_VALUES;
    this.isRefContRepSizingGraphe = this.report.SIZING_GRAPHE;
    this.isRefContRepEnthalpyV = this.report.ENTHALPY_V;
    this.isRefContRepEnthalpyG = this.report.ENTHALPY_G;
    this.isRefContRepIsochroneV = this.report.ISOCHRONE_V;
    this.isRefContRepIsochroneG = this.report.ISOCHRONE_G;
    this.isRefContRepIsovalueV = this.report.ISOVALUE_V;
    this.isRefContRepIsovalueG = this.report.ISOVALUE_G;
    this.isRefContRep2DG = this.report.CONTOUR2D_G;
    this.modalGeneration.show();
    this.isLoadingProgess = true;

    if (Number(this.typeGenerate) === 1) {
      this.viewPDF();
    } else if (Number(this.typeGenerate) === 0)  {
      this.viewHTML();
    }

    this.displayProgesReport = setInterval(() => {
      this.processingReport(typeGenerate);
    }, 1500);
  }

  processingReport(typeGenerate) {
    this.api.processingReport(this.study.ID_STUDY).subscribe(
      data => {
        if (data != null) {
          if (typeGenerate === 1) {
            this.progressFileHtml = data.progressFilePdf;
          } else {
            this.progressFileHtml = data.progressFileHtml;
          }
          for (let i = 0; i < data.progress.length; i++) {
            if (data.progress[i] == 'Production') {
              this.isProcessProduction = true;
            }
            if (data.progress[i] == 'Product') {
              this.isProcessProduct = true;
            }
            if (data.progress[i] == 'Packing data') {
              this.isProcessPacking = true;
            }
            if (data.progress[i] == 'Equipment') {
              this.isProcessEquipment = true;
            }
            if (data.progress[i] == 'Pipeline Elements') {
              this.isProcessPipeline = true;
            }
            if (data.progress[i] == 'Consumptions Results') {
              this.isProcessConsumptionResult = true;
            }
            if (data.progress[i] == 'Consumption pies') {
              this.isProcessConsumptionPie = true;
            }
            if (data.progress[i] == 'Heat balance') {
              this.isProcessHeatBalance = true;
            }
            if (data.progress[i] == 'Sizing') {
              this.isProcessSizing = true;
            }
            if (data.progress[i] == 'Enthalpies') {
              this.isProcessEnthalpie = true;
            }
            if (data.progress[i] == 'Product Section') {
              this.isProcessProductSection = true;
            }
            if (data.progress[i] == 'Time Based') {
              this.isProcessTimeBased = true;
            }
            if (data.progress[i] == 'Contour') {
              this.isProcessContour = true;
            }
            if (data.progress[i] == 'Report translation') {
              this.isReportTranlation = true;
            }
            if (data.progress[i] == 'FINISH') {
              setTimeout(() => {
                this.isLoadingProgess = false;
                localStorage.setItem('iframeReport', this.progressFileHtml);
                clearInterval(this.displayProgesReport);
                this.modalGeneration.hide();
                this.router.navigate(['/report/reportview']);
              }, 1000);
            }
          }
        }
      }
    );
  }

  closeModalGeneration() {
    this.modalGeneration.hide();
    if (this.displayProgesReport) {
      clearInterval(this.displayProgesReport);
    }
  }

  clearIntervalProgesReport() {
    clearInterval(this.displayProgesReport);
  }

  handleFileInput(files: FileList) {
    this.checkUpload = 1;
    this.fileToUpload = files.item(0);
    // console.log('logo');
    this.uploadFileToActivity();
  }

  handleFilePhotoPath(files: FileList) {
    this.checkUpload = 2;
    this.fileToUpload = files.item(0);
    // console.log('photo path');
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.postFile(this.fileToUpload).subscribe(
      data => {
        // console.log(data);
      },
      error => {
        // console.log(error);
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

  checkUser() {
    if (Number(this.user.ID_USER) === Number(this.study.ID_USER)) {
      this.ischeckUser = false;
    }
  }
}
