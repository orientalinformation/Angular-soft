import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OnChanges } from '@angular/core';

import { ViewChild } from '@angular/core';
import { CalculatorComponent } from '../../calculation/calculator/calculator.component';
import * as Models from '../../../api/models';
import { User } from '../../../api/models/user';
import { ApiService } from '../../../api/services';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import 'chart.piecelabel.js';
import { TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { CheckControl } from '../../../api/models/check-control';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { EquipSizing } from '../../../api/models/equip-sizing';
import { Study } from '../../../api/models/study';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preliminary',
  templateUrl: './preliminary.component.html',
  styleUrls: ['./preliminary.component.scss']
})
export class PreliminaryComponent implements OnInit, AfterViewInit {
  @ViewChild('consumptionPieModal') public consumptionPieModal: ModalDirective;
  @ViewChild('modalSaveAs') public modalSaveAs: ModalDirective;
  @ViewChild('equipSizingModal') public equipSizingModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('viewEquipTrModal') public viewEquipTrModal: ModalDirective;
  @ViewChild('editEquipTrModal') public editEquipTrModal: ModalDirective;

  public study: Study;
  public user: User;
  public ecoEnable;
  public symbol;
  public resultAna;
  public headBalanceResults;
  public headBalanceMaxResults;
  public commonResults;
  public economicResults;
  public headBalanceResultsTr;
  public headBalanceResultsTr01;
  public headBalanceResultsTr02;
  public checkcontrol: CheckControl;

  public chartPieData = {
    name: '',
    percentProduct: 0,
    percentEquipmentPerm: 0,
    percentEquipmentDown: 0,
    percentLine: 0
  };
  public activePage = '';
  public displayPie: boolean;
  public pieOptions;
  public pieLabels;
  public pieData;
  public pieChartType = 'pie';

  public pieColours: Array<any> = [
    { backgroundColor: ['#0000FF', '#00BFBF', '#00FFFF', '#33CC33'], }
  ];

  public pieOptionsNone;
  public pieLabelsNone;
  public pieDataNone;
  public pieChartTypeNone = 'pie';

  public pieColoursNone: Array<any> = [
    { backgroundColor: ['#b4b9c1', '#b4b9c1', '#b4b9c1'], }
  ];

  public equipSizingName;
  public equipSizingDisable: boolean;
  public equipSizingLength: number;
  public equipSizingWidth: number;
  public equipSizingSurface: number;
  public equipSizingMinLength: number;
  public equipSizingMinWidth: number;
  public equipSizingMinSurf: number;
  public equipSizingMaxLength: number;
  public equipSizingMaxWidth: number;
  public equipSizingMaxSurf: number;
  public equipSizingMessage = '';

  public equipSizing: EquipSizing;
  public laddaEquipSizing = false;
  public equipment;
  public editLayoutForm: {
    stdEquipId?: number,
    widthInterval?: number,
    lengthInterval?: number,
    orientation?: number,
    toc?: number,
    capabilities?: number,
    crate?: number,
    shelvesLength: number,
    shelvesWidth: number,
    nbShelves: number
  };
  public unitData: Models.UnitDataEquipment;
  public unitDataRes = {
    price: 0,
    intervalL: 0,
    intervalW: 0
  };
  public eid = 0;
  public minmaxEquipment: Models.ViewMinMaxEquipment;
  public operatingSetting: Models.ViewOperatingSetting;
  public studyEquipment: Models.ViewStudyEquipment;
  public laddaUpdateLayout = false;
  public laddaCalTr = false;
  public laddaCalTs = false;
  public laddaCalculationEquip = false;
  public dhpMaxChecked = false;
  public idStudyEquipmentPie: number;
  public ENABLE_CONS_PIE = false;
  public trSelect = 1;
  public viewEquipTrData;
  public disabledTr = false;
  public tsValue: Array<number> = [];
  public trValue: Array<number> = [];
  public vcValue: Array<number> = [];
  public showLoader = false;
  public showLoaderOptimum = false;
  public imageConsumptionPie = '';
  public shelvesLengthDisable = true;
  public shelvesWidthDisable = true;


  @ViewChild('calculator') calculator: CalculatorComponent;
  @ViewChild(BaseChartDirective) myChart: BaseChartDirective;

  constructor(private api: ApiService, private translate: TranslateService, private router: Router, private toastr: ToastrService,
    private auth: AuthenticationService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.displayPie = true;
    }
  }
  openPageHeat() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'block';
    pageCon.style.display = 'none';
    pageEco.style.display = 'none';
    this.activePage = 'heat';
  }
  openPageCon() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'none';
    pageEco.style.display = 'none';
    pageCon.style.display = 'block';
    this.activePage = 'consumpt';
  }
  openPageEco() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'none';
    pageEco.style.display = 'block';
    pageCon.style.display = 'none';
    this.activePage = 'economic';
  }
  openHeadBalacePage() {
    this.dhpMaxChecked = false;
    const headBalancePage = <HTMLElement>document.getElementById('headBalacePage');
    const headBalanceMaxPage = <HTMLElement>document.getElementById('headBalaceMaxPage');
    this.api.getOptimumHeadBalance(this.study.ID_STUDY).subscribe(
      data => {
        this.headBalanceResults = data;
        headBalancePage.style.display = 'block';
        headBalanceMaxPage.style.display = 'none';
      }
    );
  }
  openHeadBalaceMaxPage() {
    this.dhpMaxChecked = true;
    const headBalancePage = <HTMLElement>document.getElementById('headBalacePage');
    const headBalanceMaxPage = <HTMLElement>document.getElementById('headBalaceMaxPage');
    this.api.getOptimumHeadBalanceMax(this.study.ID_STUDY).subscribe(
      data => {
        this.headBalanceMaxResults = data;
        headBalancePage.style.display = 'none';
        headBalanceMaxPage.style.display = 'block';
      }
    );
  }
  openTrPage(value) {
    this.trSelect = value;
    const params: ApiService.GetEstimationHeadBalanceParams = {
      idStudy: this.study.ID_STUDY,
      tr: value
    };
    this.api.getEstimationHeadBalance(params).subscribe(
      data => {
        // console.log(data);
        this.headBalanceResultsTr = data;
      }
    );
  }
  ngAfterViewInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.refreshView();
    const params: ApiService.CheckControlViewParams = {
      idStudy: this.study.ID_STUDY,
      idProd: this.study.ID_PROD
    };

    this.api.checkControl(params).subscribe(
      data => {
        this.checkcontrol = data;
        if (!data.checkcontrol) {
          this.router.navigate(['/calculation/check-control']);
          swal('Warning', this.translate.instant('The study is not completely defined	'), 'error');
          return false;
        }
        // console.log(this.checkcontrol);
      }
    );
  }
  onConsumptionPie(element) {
    // console.log(element);
    this.chartPieData.name = element.equipName;
    this.chartPieData.percentProduct = element.percentProduct;
    this.chartPieData.percentEquipmentPerm = element.percentEquipmentPerm;
    this.chartPieData.percentEquipmentDown = element.percentEquipmentDown;
    this.chartPieData.percentLine = element.percentLine;
    this.idStudyEquipmentPie = element.id;
    if (Number(element.ENABLE_CONS_PIE) === 1) {
      this.ENABLE_CONS_PIE = true;
    }
    // console.log(this.ENABLE_CONS_PIE);
    // draw consumption pie chart
    const params: Models.ConsumptionPieParam = {
      percentProduct: element.percentProduct,
      percentEquipmentPerm: element.percentEquipmentPerm,
      percentEquipmentDown: element.percentEquipmentDown,
      percentLine: element.percentLine,
      percentProductLabel: this.translate.instant('Product'),
      percentEquipmentPermLabel: this.translate.instant('Equipment(permanent)'),
      percentEquipmentDownLabel:  this.translate.instant('Equipment(cool down)'),
      percentLineLabel: this.translate.instant('Line'),
    };
    this.api.drawConsumptionPie({
      idStudyEquipment: element.id,
      body: params
    }).subscribe(
      data => {
        this.imageConsumptionPie = data;
      }
    );
    this.pieOptions = {
      responsive: true,
      pieceLabel: {
          render: 'value',
          fontSize: 14,
          fontStyle: 600,
          fontColor: ['#fff', '#000', '#000', '#fff'],
          fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
          overlap: true
      },
      tooltips: {
        enabled: false
      },
      legend: {
        onClick: (e) => e.stopPropagation()
      }
    };
    this.pieLabels = [];
    this.pieLabels = [this.translate.instant('Product') + ': ' + element.percentProduct + '%',
    this.translate.instant('Equipment(permanent)') + ': ' + element.percentEquipmentPerm + '%',
    this.translate.instant('Equipment(cool down)') + ': ' + element.percentEquipmentDown + '%'];

    if (element.percentLine > 0) {
      this.pieLabels.push(this.translate.instant('Line') + ': ' + element.percentLine + '%');
    }
    this.displayPie = true;
    if ((element.percentProduct + element.percentEquipmentPerm + element.percentEquipmentDown + element.percentLine) === 0) {
      this.displayPie = false;
    }
    const dataChart = [element.percentProduct, element.percentEquipmentPerm, element.percentEquipmentDown, element.percentLine];
    this.pieData = [
      {
        data: [element.percentProduct, element.percentEquipmentPerm, element.percentEquipmentDown, element.percentLine]
      }
    ];
    if (this.myChart) {
      this.myChart.chart.config.data.labels = this.pieLabels;
      this.myChart.chart.update();
    }

    // pie none
    this.pieDataNone = [{
      data: [100, 0, 0]
    }];
    // console.log(this.pieDataNone);
    this.pieOptionsNone = {
      responsive: true,
      tooltips: {
        enabled: false
      },
      legend: {
        onClick: (e) => e.stopPropagation()
      }
    };
    this.pieLabelsNone = [];
    this.pieLabelsNone = [this.translate.instant('Product') + ': 0%',
    this.translate.instant('Equipment(permanent)') + ': 0%',
    this.translate.instant('Equipment(cool down)') + ': 0%'];

    this.consumptionPieModal.show();
  }
  addConsPieToReport() {
    const param: Models.ConsPieToReportParam = {
      ENABLE_CONS_PIE: this.ENABLE_CONS_PIE
    };
    this.api.addConsPieToReport({
      id: this.idStudyEquipmentPie,
      body: param
    }).subscribe();
  }
  closePie() {
    this.consumptionPieModal.hide();
  }
  refreshView() {
    // console.log(this.studyModifiable());
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
          dataEquip => {
            // console.log(dataEquip);
            if (dataEquip !== '') {
              localStorage.setItem('outputChart', JSON.stringify(dataEquip));
              // console.log(JSON.parse(localStorage.getItem('outputChart')));
            } else {
              localStorage.removeItem('outputChart');
            }
          }
        );
        this.api.getProInfoStudy(this.study.ID_STUDY).subscribe(
          res => {
            this.resultAna = res;
          }
        );
        this.api.getUnitData(this.study.ID_STUDY).subscribe(
          resp => {
            // console.log(resp);
            this.unitData = resp;
          }
        );
      }
    );

    if (Number(this.study.CALCULATION_MODE) === 1) {
      this.showLoader = true;
      const params: ApiService.GetEstimationHeadBalanceParams = {
        idStudy: this.study.ID_STUDY,
        tr: 1
      };
      this.api.getEstimationHeadBalance(params).subscribe(
        data => {
          // console.log(data);
          this.headBalanceResultsTr = data;
          this.showLoader = false;
          this.activePage = 'heat';
        }
      );
    } else {
      this.showLoaderOptimum = true;
      this.api.getOptimumHeadBalance(this.study.ID_STUDY).subscribe(
        data => {
          // console.log(data);
          this.headBalanceResults = data;
          this.showLoaderOptimum = false;
          this.activePage = 'heat';
        }
      );
    }

    this.api.getAnalyticalConsumption(this.study.ID_STUDY).subscribe(
      data => {
        this.commonResults = data;
      }
    );

    this.api.getAnalyticalEconomic(this.study.ID_STUDY).subscribe(
      data => {
        this.economicResults = data;
      }
    );
  }
  onEquipSizing(id) {
    this.api.getEquipSizing(id).subscribe(
      data => {
        this.equipSizing = data;
        this.equipSizingName = data.equipName;
        this.equipSizingDisable = data.disabled;
        this.equipSizingWidth = data.initWidth;
        this.equipSizingLength = data.initLength;
        this.equipSizingSurface = data.initSurface;
      }
    );
    this.equipSizingModal.show();
  }

  calculateWidth() {
    if (!this.validateEquipSizing()) {
      return false;
    }
    /* tslint:disable */
    this.equipSizingLength =  this.setMaxDigit( (isNaN(this.equipSizingLength) || (this.equipSizingLength <= 0)) ? this.equipSizing.initLength : this.equipSizingLength );
    this.equipSizingSurface =  this.setMaxDigit( (isNaN(this.equipSizingSurface)) ? this.equipSizing.initSurface : this.equipSizingSurface );
    this.equipSizingWidth =  this.setMaxDigit(this.equipSizingSurface / this.equipSizingLength);
    if (this.equipSizingWidth < this.equipSizing.minWidth) {
      this.equipSizingWidth = this.equipSizing.minWidth;
      this.equipSizingLength = -1;
    } else if (this.equipSizingWidth > this.equipSizing.maxLength) {
      this.equipSizingWidth = this.equipSizing.maxWidth;
      this.equipSizingLength = -1;
    }

    if (this.equipSizingLength === -1) {
      this.equipSizingLength = this.setMaxDigit(this.equipSizingSurface / this.equipSizingWidth);
      if (this.equipSizingLength < this.equipSizing.minLength) {
        this.equipSizingLength = this.equipSizing.minLength;
      } else if (this.equipSizingLength > this.equipSizing.maxLength) {
        this.equipSizingLength = this.equipSizing.maxLength;
      }

      this.equipSizingSurface = this.setMaxDigit(this.equipSizingWidth * this.equipSizingLength);
    }
  }

  calculateLength() {
    if (!this.validateEquipSizing()) {
      return false;
    }
    /* tslint:disable */
    this.equipSizingWidth =  this.setMaxDigit( (isNaN(this.equipSizingWidth) || (this.equipSizingWidth <= 0)) ? this.equipSizing.initWidth : this.equipSizingWidth );
    this.equipSizingSurface =  this.setMaxDigit( (isNaN(this.equipSizingSurface)) ? this.equipSizing.initSurface : this.equipSizingSurface );
    this.equipSizingLength =  this.setMaxDigit(this.equipSizingSurface / this.equipSizingWidth);
    if (this.equipSizingLength < this.equipSizing.minLength) {
      this.equipSizingLength = this.equipSizing.minLength;
      this.equipSizingWidth = -1;
    } else if (this.equipSizingLength > this.equipSizing.maxLength) {
      this.equipSizingLength = this.equipSizing.maxLength;
      this.equipSizingWidth = -1;
    }

    if (this.equipSizingWidth === -1) {
      this.equipSizingWidth = this.setMaxDigit(this.equipSizingSurface / this.equipSizingLength);
      if (this.equipSizingWidth < this.equipSizing.minWidth) {
        this.equipSizingWidth = this.equipSizing.minWidth;
      } else if (this.equipSizingWidth > this.equipSizing.maxLength) {
        this.equipSizingWidth = this.equipSizing.maxWidth;
      }

      this.equipSizingSurface = this.setMaxDigit(this.equipSizingWidth * this.equipSizingLength);
    }
  }

  saveEquipSizing() {
    if (!this.validateEquipSizing()) {
      return false;
    }
    this.laddaEquipSizing = true;
    const params: Models.EquipSizingParam = {
      width: this.equipSizingWidth,
      length: this.equipSizingLength
    };
    this.api.saveEquipSizing({
      id: this.equipSizing.idStudyEquipment,
      body: params
    }).subscribe(
      response => {
        this.toastr.success(this.translate.instant('Update success'), 'successfully');
        this.refreshView();
        this.laddaEquipSizing = false;
        this.equipSizingModal.hide();
       }
    );
  }

  viewEquipTr(element) {
    if (this.trSelect === 1) {
      this.api.getOperatingSetting(element.id).subscribe(
        data => {
          this.viewEquipTrData = element;
          this.operatingSetting = data;
          this.studyEquipment = data.studyEquipment;
          this.disabledTr = !(this.getCapability(data.studyEquipment.CAPABILITIES, 1));
          for (let i = 0; i < this.studyEquipment.ts.length; i++) {
            this.tsValue[i] = this.studyEquipment.ts[i];
          }
          for (let i = 0; i < this.studyEquipment.tr.length; i++) {
            this.trValue[i] = this.studyEquipment.tr[i];
          }
          for (let i = 0; i < this.studyEquipment.vc.length; i++) {
            this.vcValue[i] = this.studyEquipment.vc[i];
          }
        }
      );
      this.editEquipTrModal.show();
    } else {
      this.viewEquipTrData = element;
      this.viewEquipTrModal.show();
    } 
  }

  calcTr() {
    for (let i = 0; i < this.operatingSetting.studyEquipment.ts.length; i++) {
      const value = this.tsValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Residence / Dwell !'), 'Error');
        return;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Residence / Dwell !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Residence / Dwell') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    this.laddaCalTr = true;
    const newTsValue: Array<number> = [];
    this.tsValue.forEach(function (value) {
      newTsValue.push(value);
    }); 

    const params: Models.OutputComputeTrTsParam = {
      TR: this.trValue,
      TS: newTsValue,
      VC: this.vcValue,
      TE: this.studyEquipment.TExt,
      doTr: true
    }

    this.api.computeTrTs({
      idStudyEquipment: this.studyEquipment.ID_STUDY_EQUIPMENTS,
      body: params
    }).subscribe(
      data => {
        this.studyEquipment = data;
        for (let i = 0; i < this.studyEquipment.ts.length; i++) {
          this.tsValue[i] = this.studyEquipment.ts[i];
        }
        for (let i = 0; i < this.studyEquipment.tr.length; i++) {
          this.trValue[i] = this.studyEquipment.tr[i];
        }
        for (let i = 0; i < this.studyEquipment.vc.length; i++) {
          this.vcValue[i] = this.studyEquipment.vc[i];
        }
        this.laddaCalTr = false;
      }
    )
  }

  calcTs() {
    for (let i = 0; i < this.operatingSetting.studyEquipment.tr.length; i++) {
      const value = this.trValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Control temperature !'), 'Error');
        return;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Control temperature !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Control temperature ') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    this.laddaCalTs = true;
    const newTrValue: Array<number> = [];
    this.trValue.forEach(function (value) {
      newTrValue.push(value);
    }); 

    const params: Models.OutputComputeTrTsParam = {
      TR: newTrValue,
      TS: this.tsValue,
      VC: this.vcValue,
      TE: this.studyEquipment.TExt,
      doTr: false
    }

    this.api.computeTrTs({
      idStudyEquipment: this.studyEquipment.ID_STUDY_EQUIPMENTS,
      body: params
    }).subscribe(
      data => {
        this.studyEquipment = data;
        for (let i = 0; i < this.studyEquipment.ts.length; i++) {
          this.tsValue[i] = this.studyEquipment.ts[i];
        }
        for (let i = 0; i < this.studyEquipment.tr.length; i++) {
          this.trValue[i] = this.studyEquipment.tr[i];
        }
        for (let i = 0; i < this.studyEquipment.vc.length; i++) {
          this.vcValue[i] = this.studyEquipment.vc[i];
        }
        this.laddaCalTs = false;
      }
    )
  }

  submitCalculate() {
    for (let i = 0; i < this.operatingSetting.studyEquipment.ts.length; i++) {
      const value = this.tsValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Residence / Dwell !'), 'Error');
        return;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Residence / Dwell !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Residence / Dwell') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    for (let i = 0; i < this.operatingSetting.studyEquipment.tr.length; i++) {
      const value = this.trValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Control temperature !'), 'Error');
        return;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Control temperature !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Control temperature ') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    for (let i = 0; i < this.operatingSetting.studyEquipment.vc.length; i++) {
      const value = this.vcValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Convection Setting !'), 'Error');
        return;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Convection Setting !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Convection Setting ') +
          ' (' + this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    this.laddaCalculationEquip = true;
    const params: Models.OutputComputeTrTsParam = {
      TR: this.trValue,
      TS: this.tsValue,
      VC: this.vcValue,
      TE: this.studyEquipment.TExt,
    }
    
    this.api.runSequenceCalculation({
      idStudyEquipment: this.studyEquipment.ID_STUDY_EQUIPMENTS,
      body: params
    }).subscribe(
      data => {
        this.laddaCalculationEquip = false;
        this.toastr.success(this.translate.instant('Update success'), 'successfully');
        this.refreshView();
        this.editEquipTrModal.hide();
      }
    )
  }

  setMaxDigit(value) {
    return Math.round(value * 100) / 100;
  }

  validateEquipSizing() {
    if (!this.equipSizingWidth) {
      this.toastr.error(this.translate.instant('Enter a value in Width !'), 'Error');
      return false;
    } else if (!this.isNumberic(this.equipSizingWidth)) {
      this.toastr.error(this.translate.instant('Not a valid number in Width !'), 'Error');
      return false;
    } else if (!this.isInRangeOutput(this.equipSizingWidth, this.equipSizing.minWidth, this.equipSizing.maxWidth)) {
      this.toastr.error(this.translate.instant('Value out of range in Width') + '(' + this.equipSizing.minWidth +
      ' : ' + this.equipSizing.maxWidth + ') !', 'Error');
      return false;
    }

    if (!this.equipSizingLength) {
      this.toastr.error(this.translate.instant('Enter a value in Length !'), 'Error');
      return false;
    } else if (!this.isNumberic(this.equipSizingLength)) {
      this.toastr.error(this.translate.instant('Not a valid number in Length !'), 'Error');
      return false;
    } else if (!this.isInRangeOutput(this.equipSizingLength, this.equipSizing.minLength, this.equipSizing.maxLength)) {
      this.toastr.error(this.translate.instant('Value out of range in Length') + '(' + this.equipSizing.minLength +
      ' : ' + this.equipSizing.maxLength + ') !', 'Error');
      return false;
    }

    if (!this.equipSizingSurface) {
      this.toastr.error(this.translate.instant('Enter a value in Surface !'), 'Error');
      return false;
    } else if (!this.isNumberic(this.equipSizingSurface)) {
      this.toastr.error(this.translate.instant('Not a valid number in Surface !'), 'Error');
      return false;
    } else if (!this.isInRangeOutput(this.equipSizingSurface, this.equipSizing.minSurf, this.equipSizing.maxSurf)) {
      this.toastr.error(this.translate.instant('Value out of range in Surface') + '(' + this.equipSizing.minSurf +
      ' : ' + this.equipSizing.maxSurf + ') !', 'Error');
      return false;
    }
    return true;
  }

  equipEditLayout(stdEquipId, index: number) {
    this.api.getStudyEquipmentById(stdEquipId).subscribe(
      equip => {
        // console.log(equip);
        this.equipment = equip;
        this.eid = index;
        this.editLayoutForm = {
          stdEquipId: equip.ID_STUDY_EQUIPMENTS,
          orientation: equip.ORIENTATION,
          capabilities: equip.CAPABILITIES,
          toc: equip.layoutResults.LOADING_RATE,
          crate: equip.layoutGen.SHELVES_TYPE,
          shelvesLength: equip.layoutGen.SHELVES_EURO_LENGTH,
          shelvesWidth: equip.layoutGen.SHELVES_EURO_WIDTH,
          nbShelves: equip.layoutGen.NB_SHELVES_PERSO
        };
        this.editLayoutForm.lengthInterval = equip.layoutGen.LENGTH_INTERVAL;
        if (equip.layoutGen.LENGTH_INTERVAL < 0) {
          this.editLayoutForm.lengthInterval = this.unitData.IntervalLength;
        }
        this.editLayoutForm.widthInterval = equip.layoutGen.WIDTH_INTERVAL;
        if (equip.layoutGen.WIDTH_INTERVAL < 0) {
          this.editLayoutForm.widthInterval = this.unitData.IntervalWidth;
        }
        this.api.getMinMaxEquipment(this.study.ID_STUDY).subscribe(
          mm => {
            this.minmaxEquipment = mm;
          }
        );
        this.api.getStudyEquipmentLayout(equip.ID_STUDY_EQUIPMENTS).subscribe(
          data => {
            this.editModal.show();
            setTimeout(function() {
              // console.log(data);
              const img = <HTMLImageElement>document.getElementById('stdEqpLayoutImg');
              img.src = data;
            }, 500);
          },
          err => {
            // @TODO: show error message box
            console.log(err);
          }
        );
      }
    );
  }

  showDims() {
    if (this.editLayoutForm.crate == 0) {
      this.editLayoutForm.shelvesLength = this.equipment.layoutGen.SHELVES_EURO_LENGTH;
      this.editLayoutForm.shelvesWidth = this.equipment.layoutGen.SHELVES_EURO_WIDTH;
      this.shelvesLengthDisable = true;
      this.shelvesWidthDisable = true;
    } else if (this.editLayoutForm.crate == 1) {
      this.editLayoutForm.shelvesLength = this.equipment.layoutGen.SHELVES_GASTRO_LENGTH;
      this.editLayoutForm.shelvesWidth = this.equipment.layoutGen.SHELVES_GASTRO_WIDTH;
      this.shelvesLengthDisable = true;
      this.shelvesWidthDisable = true;
    } else if (this.editLayoutForm.crate == 2) {
      this.editLayoutForm.shelvesLength = this.equipment.layoutGen.SHELVES_LENGTH;
      this.editLayoutForm.shelvesWidth = this.equipment.layoutGen.SHELVES_WIDTH;
      this.shelvesLengthDisable = false;
      this.shelvesWidthDisable = false;
    }
  }

  updateStdEquipLayout() {
    if (!this.editLayoutForm.lengthInterval) {
      this.toastr.error(this.translate.instant('Enter a value in specify Lenght !'), 'Error');
      return;
    } else if (!this.isNumberic(this.editLayoutForm.lengthInterval)) {
      this.toastr.error(this.translate.instant('Not a valid number in specify Lenght !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.editLayoutForm.lengthInterval, this.minmaxEquipment.mmLInterval.LIMIT_MIN,
      this.minmaxEquipment.mmLInterval.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in specify Lenght') +
        ' (' + this.minmaxEquipment.mmLInterval.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmLInterval.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.editLayoutForm.widthInterval) {
      this.toastr.error(this.translate.instant('Enter a value in specify Width !'), 'Error');
      return;
    } else if (!this.isNumberic(this.editLayoutForm.widthInterval)) {
      this.toastr.error(this.translate.instant('Not a valid number in specify Width !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.editLayoutForm.widthInterval, this.minmaxEquipment.mmWInterval.LIMIT_MIN,
      this.minmaxEquipment.mmWInterval.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in specify Width') +
        ' (' + this.minmaxEquipment.mmWInterval.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmWInterval.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.editLayoutForm.toc) {
      this.toastr.error(this.translate.instant('Enter a value in Belt coverage !'), 'Error');
      return;
    } else if (!this.isNumberic(this.editLayoutForm.toc)) {
      this.toastr.error(this.translate.instant('Not a valid number in Belt coverage !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.editLayoutForm.toc, 0, 100)) {
        this.toastr.error(this.translate.instant('Value out of range in Belt coverage') +
        ' (0 : 100) !', 'Error');
        return;
    }

    if (this.equipment.BATCH_PROCESS == 1) {
      if (!this.editLayoutForm.shelvesLength) {
        this.toastr.error(this.translate.instant('Enter a value in Dimensions (length x width) !'), 'Error');
        return;
      } else if (!this.isNumberic(this.editLayoutForm.shelvesLength)) {
        this.toastr.error(this.translate.instant('Not a valid number in Dimensions (length x width) !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.editLayoutForm.shelvesLength,
        this.minmaxEquipment.mmShelvesL.LIMIT_MIN, this.minmaxEquipment.mmShelvesL.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Dimensions (length x width)') +
          ' (' + this.minmaxEquipment.mmShelvesL.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmShelvesL.LIMIT_MAX + ') !', 'Error');
          return;
      }

      if (!this.editLayoutForm.shelvesWidth) {
        this.toastr.error(this.translate.instant('Enter a value in Dimensions (length x width) !'), 'Error');
        return;
      } else if (!this.isNumberic(this.editLayoutForm.shelvesWidth)) {
        this.toastr.error(this.translate.instant('Not a valid number in Dimensions (length x width) !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.editLayoutForm.shelvesWidth,
        this.minmaxEquipment.mmShelvesW.LIMIT_MIN, this.minmaxEquipment.mmShelvesW.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Dimensions (length x width)') +
          ' (' + this.minmaxEquipment.mmShelvesW.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmShelvesW.LIMIT_MAX + ') !', 'Error');
          return;
      }

      if (!this.editLayoutForm.nbShelves) {
        this.toastr.error(this.translate.instant('Enter a value in Number of shelves !'), 'Error');
        return;
      } else if (!this.isNumberic(this.editLayoutForm.nbShelves)) {
        this.toastr.error(this.translate.instant('Not a valid number in Number of shelves !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.editLayoutForm.nbShelves,
        this.minmaxEquipment.mmShelvesNb.LIMIT_MIN, this.minmaxEquipment.mmShelvesNb.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Number of shelves') +
          ' (' + this.minmaxEquipment.mmShelvesNb.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmShelvesNb.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    this.laddaUpdateLayout = true;
    this.api.updateStudyEquipmentLayout({
      id: this.editLayoutForm.stdEquipId,
      body: {
        lengthInterval: this.editLayoutForm.lengthInterval,
        widthInterval: this.editLayoutForm.widthInterval,
        orientation: this.editLayoutForm.orientation,
        toc: this.editLayoutForm.toc,
        crate: this.editLayoutForm.crate,
        nbShelves: this.editLayoutForm.nbShelves,
        studyClean: false
      }
    }).subscribe(
      (resp) => {
        if (this.getCapability(this.editLayoutForm.capabilities, 8192)) {
          this.api.getStudyEquipmentLayout(this.editLayoutForm.stdEquipId).subscribe(
            data => {
              const img = <HTMLImageElement>document.getElementById('stdEqpLayoutImg');
              img.src = data;
            }
          );
        }
        this.api.getStudyEquipmentById(this.editLayoutForm.stdEquipId).subscribe(
          equip => {
            this.equipment = equip;
            this.laddaUpdateLayout = false;
            // console.log(this.equipment);
          }
        );
      },
      (err) => {
        console.log(err);
        this.editModal.hide();
      },
      () => {
        // this.editModal.hide();
        // this.refreshView();
      }
    );
  }

  closeEditModal() {
    this.editModal.hide();
    this.refreshView();
  }

  closeEditEquipTrModal() {
    this.editEquipTrModal.hide();
    this.refreshView();
  }

  onTocPopup(id) {
    swal('Oops', this.translate.instant('Not yet implement !'), 'error');
    return;
  }
  onFinishCalculate() {
    this.refreshView();
    if (this.dhpMaxChecked) {
      this.openHeadBalaceMaxPage();
    }
  }
  isNumberic(number) {
    return Number.isInteger(Math.floor(number));
  }
  isInRangeOutput(value, min, max) {
    if (value < min || value > max) {
      return false;
    } else {
      return true;
    }
  }
  studyModifiable() {
    if (typeof this.study === 'undefined' && this.study == null ) { return false; }
    const owned = this.auth.user().ID_USER === this.study.ID_USER;
    return owned;
    // return owned && ((!this.study.CHAINING_CONTROLS) || (!this.study.HAS_CHILD));
  }
  getCapability(capabilities, capMask) {
    /* tslint:disable */
    if ((Number(capabilities) & Number(capMask)) !== 0) {
        return true;
    } else {
        return false;
    }
  }
  validate(value: Number, minmax: Models.MinMax, name) {
    if (!value) {
      this.toastr.error(this.translate.instant('Enter a value in') + ' ' + this.translate.instant(name) + ' !', 'Error');
      return false;
    } else if (!this.isNumberic(value)) {
      this.toastr.error(this.translate.instant('Not a valid number in') + ' ' + this.translate.instant(name) + ' !', 'Error');
      return false;
    } else if (!this.isInRangeOutput(value, minmax.LIMIT_MIN, minmax.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in') + ' ' + this.translate.instant(name) +
        ' (' + minmax.LIMIT_MIN + ' : ' + minmax.LIMIT_MAX + ') !', 'Error');
        return false;
    } else {
      return true;
    }
  }
}
