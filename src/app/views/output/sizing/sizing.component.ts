import { Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import { OnChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';
import { CalculatorComponent } from '../../calculation/calculator/calculator.component';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ApiService } from '../../../api/services';
import { TranslateService } from '@ngx-translate/core';
import { ViewSizingEstimationResult } from '../../../api/models/view-sizing-estimation-result';
import { ViewSizingResultOptimum } from '../../../api/models/view-sizing-result-optimum';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { CheckControl } from '../../../api/models/check-control';
import { Chart } from 'angular-highcharts';
import * as Models from '../../../api/models';

@Component({
  selector: 'app-sizing',
  templateUrl: './sizing.component.html',
  styleUrls: ['./sizing.component.scss']
})
export class SizingComponent implements OnInit, AfterViewInit {
  @ViewChild('calculator') calculator: CalculatorComponent;
  @ViewChild(BaseChartDirective) myGraphEstimationData;
  @ViewChild(BaseChartDirective) myEstimationAvailableChart;
  @ViewChild(BaseChartDirective) myGraphOptimumData;
  @ViewChild(BaseChartDirective) myGraphOptimumData01;
  @ViewChild('viewEquipTrModal') public viewEquipTrModal: ModalDirective;
  @ViewChild('addEquipModal') public addEquipModal: ModalDirective;

  public checkcontrol: CheckControl;

  constructor(private api: ApiService, private translate: TranslateService) { }

  public study;
  public symbol;
  public sizingOptimumValue;
  public sizingEstimationValue;
  public selectedEquipment;
  public availableEquipment;
  public customFlowRate;

  public graphType = 'bar';
  public graphLegend = true;
  public studyEquipments;
  public temperatureProfileData;

  public tempChartData;
  public tempChartOptions;
  public tempChartLegend = true;
  public tempChartType= 'line';
  public tempColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)', 'rgb(0,192,192)', 'rgb(0,255,255)', 'rgb(0,255,0)', 'rgb(255,0,0)', 'rgb(255,0,255)'], }
  ];

  public convChartData;
  public convChartOptions;
  public convChartLegend = true;
  public convChartType = 'line';
  public trGraph = 1;
  public selectedEquip: number;
  public selectedEquipList = [];
  public selectedActiveEquip = [];
  public productFlowRate: number;

  public minGraphChart;
  public maxGraphChart;

  public grapColours: Array<any> = [
    { backgroundColor: ['rgb(255,0,0)', 'rgb(0, 0, 255)', 'rgb(153, 204, 255)', 'rgb(51, 204, 51)', 'rgb(102, 255, 153)'], }
  ];

  public graphData;
  public graphOptions: any = {};
  public graphLabels;

  public dataGraphChart;
  public equipmentList = [];
  public activeEquipment = [];
  public graphEstimationData;
  public graphEstimationLabels = ['TR-10°C', 'TR', 'TR+10°C'];
  public graphEstimationOptions: any = {};
  public graphEstimationOptions01: any = {};

  public estimationAvailableChart;
  public estimationAvailableLabels;
  public estimationAvailableOptions: any = {};

  public activePage = '';
  public optimumBarChart;
  public estimationBarChart;
  public estimationEquipBarChart;
  public sizingOptimumImage: HTMLImageElement = new Image();
  public sizingEstimationImage: HTMLImageElement = new Image();
  public estimationEquipBarImage: HTMLImageElement = new Image();
  public imageTemp = '';
  public imageConv = '';
  public viewEquipTrData;
  public specialLength: Array<any> = [];
  public equipDuplicateId: number;
  public nbModule: number;
  public laddaAddEquip = false;
  public displayResult = true;
  public displayTemprature = false;
  public loadResultData = true;
  public loadTempData = false;

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.selectedEquip = 0;
  }

  ngAfterViewInit() {
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getSymbol(this.study.ID_STUDY).subscribe(
        data => {
          // console.log(data);
          this.activePage = 'result';
          this.symbol = data;
          if (this.study.CALCULATION_MODE == 1) {
            this.refreshSizingEstimationResult();
          } else {
            this.api.sizingOptimumResult(this.study.ID_STUDY).subscribe(
              (dataCh: ViewSizingResultOptimum) => {
                // console.log(dataCh);
                this.sizingOptimumValue = dataCh.result;
                this.selectedEquipment = dataCh.selectedEquipment;
                this.availableEquipment = dataCh.availableEquipment;
                this.equipmentList = this.availableEquipment;
                this.activeEquipment = this.selectedEquipment;
                this.productFlowRate = dataCh.productFlowRate;
                this.sizingOptimumImage.src = dataCh.imageSizing;
                this.loadResultData = false;
              }
            );
          }
        }
      );
    }

    const params: ApiService.CheckControlViewParams = {
      idStudy: this.study.ID_STUDY,
      idProd: this.study.ID_PROD
    };

    this.api.checkControl(params).subscribe(
      data => {
        this.checkcontrol = data;
        // console.log(this.checkcontrol);
      }
    );
  }
  refreshSizingEstimationResult() {
    const paramsSizing: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY
    };
    this.api.sizingEstimationResult(paramsSizing).subscribe(
      (dataCh: ViewSizingEstimationResult) => {
        // console.log(dataCh);
        this.sizingEstimationValue = dataCh.result;
        this.dataGraphChart = dataCh.dataGraphChart;
        this.selectedEquip = this.dataGraphChart[0].id;
        this.productFlowRate = dataCh.productFlowRate;
        for (let i = 0; i < Object.keys(dataCh.dataGraphChart).length; i++) {
          this.equipmentList.push(dataCh.dataGraphChart[i]);
        }
        this.sizingEstimationImage.src = this.dataGraphChart[0].image;
      }
    );
  }
  moveSelectedEquipment() {
    for (let i = 0; i < Object.keys(this.selectedEquipList).length; i++) {
      this.activeEquipment.push(this.selectedEquipList[i]);
      const index = this.equipmentList.indexOf(this.selectedEquipList[i]);
      this.equipmentList.splice(index, 1);
    }
    this.selectedEquipList = [];
    this.getSizingOptimumDraw();
  }
  moveAvailableEquipment() {
    for (let i = 0; i < Object.keys(this.selectedActiveEquip).length; i++) {
      this.equipmentList.push(this.selectedActiveEquip[i]);
      const index = this.activeEquipment.indexOf(this.selectedActiveEquip[i]);
      this.activeEquipment.splice(index, 1);
    }
    this.selectedActiveEquip = [];
    this.getSizingOptimumDraw();
  }
  loadEstimationAvailableChart() {
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    showLoaderChange.style.display = 'block';
    const dataGraphChart = this.activeEquipment;
    const dataGrapChartLength = Object.keys(dataGraphChart).length;
    if (dataGrapChartLength > 0) {
      const labelGrap = [];
      const dataCustomFlowRate = [];
      const dataDhp = [];
      const dataDhpMax = [];
      const dataConso = [];
      const dataConsoMax = [];
      for (let j = 0; j < Object.keys(dataGraphChart).length; j++) {
        labelGrap.push( dataGraphChart[j].equipName);
        const objDataGraph = dataGraphChart[j].data;
        for (let i = 0; i < Object.keys(objDataGraph).length; i++) {
          if (i == this.trGraph) {
            dataCustomFlowRate.push(this.productFlowRate);
            dataDhp.push(objDataGraph[i].dhp);
            dataDhpMax.push(objDataGraph[i].dhpMax);
            dataConso.push(objDataGraph[i].conso);
            dataConsoMax.push(objDataGraph[i].consoMax);
          }
        }
        this.estimationEquipBarChart = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: labelGrap
          },
          yAxis: [
            {
              min: 1,
              type: 'logarithmic',
              plotLines: [{
                color: '#F00',
                width: 2,
                value: this.productFlowRate
              }],
              title: {
                text: this.translate.instant('Flow rate') + ' ' + this.symbol.productFlowSymbol,
              }
            },
            {
            title: {
              text: this.translate.instant('Conso') + ' ' + this.symbol.consumSymbol + '/' + this.symbol.perUnitOfMassSymbol
            },
            opposite: true
          }],
          tooltip: {
            formatter: function () {
              return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y;
            }
          },
          plotOptions: {
            column: {
              events: {
                legendItemClick: function () {
                    return false;
                }
              }
            },
            spline: {
              events: {
                legendItemClick: function () {
                    return false;
                }
              },
              lineWidth: 0
            }
          },
          series: [{
            name: this.translate.instant('Product flowrate'),
            color: 'rgba(0, 0, 255, 1)',
            data: JSON.parse(JSON.stringify(dataDhp)),
            stack: 'male',
          }, {
            name: this.translate.instant('Maximum product flowrate'),
            color: 'rgba(153, 204, 255, .9)',
            data: JSON.parse(JSON.stringify(dataDhpMax)),
            stack: 'male'
          }, {
            name: this.translate.instant('Cryogen consumption (product + equipment heat losses)'),
            color: 'rgba(51, 204, 51, 1)',
            data: JSON.parse(JSON.stringify(dataConso)),
            stack: 'female',
            yAxis: 1
          }, {
            name: this.translate.instant('Maximum cryogen consumption (product + equipment heat losses)'),
            color: 'rgba(102, 255, 153, .9)',
            data: JSON.parse(JSON.stringify(dataConsoMax)),
            stack: 'female',
            yAxis: 1
          }, {
            name: this.translate.instant('Custom flow rate'),
            type: 'spline',
            color: '#f00',
            data: JSON.parse(JSON.stringify(dataCustomFlowRate)),
          }]
        });
      }
    } else {
      this.estimationEquipBarChart = '';
    }
    showLoaderChange.style.display = 'none';
  }
  loadOptimumAvailableChart() {
    const chartGraphOptimumData = <HTMLElement>document.getElementById('chartGraphOptimumData');
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    showLoaderChange.style.display = 'block';
    const dataGraphChart = this.activeEquipment;
    const dataGrapChartLength = Object.keys(dataGraphChart).length;
    const labelGrap = [];
    const dataCustomFlowRate = [];
    const dataDhp = [];
    const dataDhpMax = [];
    const dataConso = [];
    const dataConsoMax = [];
    if (dataGrapChartLength > 0) {
      for (let i = 0; i < Object.keys(dataGraphChart).length; i++) {
        labelGrap.push(dataGraphChart[i].equipName);
        dataCustomFlowRate.push(this.productFlowRate);
        dataDhp.push(dataGraphChart[i].dhp);
        dataDhpMax.push(dataGraphChart[i].dhpMax);
        dataConso.push(dataGraphChart[i].conso);
        dataConsoMax.push(dataGraphChart[i].consoMax);
      }
      this.optimumBarChart = new Chart({
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: labelGrap
        },
        yAxis: [
          {
            min: 1,
            type: 'logarithmic',
            plotLines: [{
              color: '#F00',
              width: 2,
              value: this.productFlowRate
            }],
            title: {
              text: this.translate.instant('Flow rate') + ' ' + this.symbol.productFlowSymbol,
            }
          },
          {
            title: {
              text: this.translate.instant('Conso') + ' ' + this.symbol.consumSymbol + '/' + this.symbol.perUnitOfMassSymbol
            },
            opposite: true
          }],
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y;
          }
        },
        plotOptions: {
          column: {
            events: {
              legendItemClick: function () {
                  return false;
              }
            }
          },
          spline: {
            events: {
              legendItemClick: function () {
                  return false;
              }
            },
            lineWidth: 0
          }
        },
        series: [{
          name: this.translate.instant('Product flowrate'),
          color: 'rgba(0, 0, 255, 1)',
          data: JSON.parse(JSON.stringify(dataDhp)),
          stack: 'male',
        }, {
          name: this.translate.instant('Maximum product flowrate'),
          color: 'rgba(153, 204, 255, .9)',
          data: JSON.parse(JSON.stringify(dataDhpMax)),
          stack: 'male'
        }, {
          name: this.translate.instant('Cryogen consumption (product + equipment heat losses)'),
          color: 'rgba(51, 204, 51, 1)',
          data: JSON.parse(JSON.stringify(dataConso)),
          stack: 'female',
          yAxis: 1
        }, {
          name: this.translate.instant('Maximum cryogen consumption (product + equipment heat losses)'),
          color: 'rgba(102, 255, 153, .9)',
          data: JSON.parse(JSON.stringify(dataConsoMax)),
          stack: 'female',
          yAxis: 1
        }, {
          name: this.translate.instant('Custom flow rate'),
          type: 'spline',
          color: '#f00',
          data: JSON.parse(JSON.stringify(dataCustomFlowRate)),
        }]
      });
    } else {
      this.optimumBarChart = '';
    }
    showLoaderChange.style.display = 'none';
  }
  getSizingOptimumDraw() {
    if (this.study.CALCULATION_MODE == 1) {
      if (this.activeEquipment.length > 0) {
        const params:  Array<any> = [];
        const trNumber = this.trGraph;
        this.activeEquipment.forEach(function (value) {
          params.push({
              id: value.id,
              equipName: value.equipName,
              dhp: value.data[trNumber].dhp,
              conso: value.data[trNumber].conso,
              dhpMax: value.data[trNumber].dhpMax,
              consoMax: value.data[trNumber].consoMax
            }
          );
        });
        this.api.sizingOptimumDraw({
          idStudy: this.study.ID_STUDY,
          body: params
        }).subscribe(
          data => {
            this.estimationEquipBarImage.src = '' + data + '';
          }
        );
      } else {
        this.estimationEquipBarImage.src = '';
      }
    } else {
      if (this.activeEquipment.length > 0) {
        const params:  Array<any> = [];
        this.activeEquipment.forEach(function (value) {
          params.push({
              id: value.id,
              equipName: value.equipName,
              dhp: value.dhp,
              conso: value.conso,
              dhpMax: value.dhpMax,
              consoMax: value.consoMax
            }
          );
        });
        this.api.sizingOptimumDraw({
          idStudy: this.study.ID_STUDY,
          body: params
        }).subscribe(
          data => {
            this.sizingOptimumImage.src = '' + data + '';
          }
        );
      } else {
        this.sizingOptimumImage.src = '';
      }
    }
  }
  changeEstimationTrGraph(value) {
    this.trGraph = value;
    this.getSizingOptimumDraw();
  }
  openSize() {
    this.activePage = 'result';
    this.displayResult = true;
    this.displayTemprature = false;
  }
  openTem() {
    this.activePage = 'profile';
    this.displayResult = false;
    this.displayTemprature = true;
    this.loadTempData = true;
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      dataSymbol => {
        this.symbol = dataSymbol;
        this.api.getstudyEquipmentByStudyId(this.study.ID_STUDY).subscribe(
          data => {
            this.studyEquipments = data;
            this.api.temperatureProfile(this.studyEquipments[0]['ID_STUDY_EQUIPMENTS']).subscribe(
              dataTempFirst => {
                this.imageTemp = dataTempFirst.imageTemp;
                this.imageConv = dataTempFirst.imageConv;
                this.loadTempData = false;
              }
            );
          }
        );
      }
    );
  }
  loadTempChart(element) {
    this.loadTempData = true;
    this.api.temperatureProfile(element).subscribe(
      data => {
        this.imageTemp = data.imageTemp;
        this.imageConv = data.imageConv;
        this.loadTempData = false;
      }
    );
  }
  loadEstimationValue(value) {
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    showLoaderChange.style.display = 'block';
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY,
      tr: value
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        this.sizingEstimationValue = data.result;
        showLoaderChange.style.display = 'none';
      }
    );
  }
  loadEquipmentEstimationChart() {
    for (let i = 0; i < this.dataGraphChart.length; i++) {
      if (this.dataGraphChart[i].id == this.selectedEquip) {
        this.sizingEstimationImage.src = this.dataGraphChart[i].image;
      }
    }
  }
  viewEquipTr(element) {
    this.viewEquipTrData = element;
    this.viewEquipTrModal.show();
  }
  isNumberic(number) {
    return Number.isInteger(Math.floor(number));
  }
  viewAddEquipModal(element) {
    this.api.getSpecialLength(element).subscribe(
      data => {
        this.nbModule = 1;
        this.equipDuplicateId = element;
        this.specialLength = data;
        this.addEquipModal.show();
      }
    );
  }
  changeNbModuleValue(value) {
    this.nbModule = value;
  }
  applyAddEquip() {
    this.laddaAddEquip = true;
    const params: Models.DuplicateEltNewSizeParam = {
      nbModule: this.nbModule
    };
    this.api.duplicateEltNewSize({
      id: this.equipDuplicateId,
      body: params
    }).subscribe(
      data => {
        this.refreshSizingEstimationResult();
        this.laddaAddEquip = false;
        this.addEquipModal.hide();
      }
    );
  }
  getCapability(capabilities, capMask) {
    /* tslint:disable */
    if ((Number(capabilities) & Number(capMask)) !== 0) {
        return true;
    } else {
        return false;
    }
  }
}
