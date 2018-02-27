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
  public trGraph: number;
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

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.selectedEquip = 0;
    this.trGraph = 1;
  }

  ngAfterViewInit() {
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    showLoaderChange.style.display = 'block';
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getSymbol(this.study.ID_STUDY).subscribe(
        data => {
          console.log(data);
          this.activePage = 'result';
          this.symbol = data;
          showLoaderChange.style.display = 'none';
          if (this.study.CALCULATION_MODE == 1) {
            const paramsSizing: ApiService.SizingEstimationResultParams = {
              idStudy: this.study.ID_STUDY
            };
            this.api.sizingEstimationResult(paramsSizing).subscribe(
              (dataCh: ViewSizingEstimationResult) => {
                this.sizingEstimationValue = dataCh.result;
                this.dataGraphChart = dataCh.dataGraphChart;
                this.selectedEquip = this.dataGraphChart[0].id;
                this.productFlowRate = dataCh.productFlowRate;
                for (let i = 0; i < Object.keys(dataCh.dataGraphChart).length; i++) {
                  this.equipmentList.push(dataCh.dataGraphChart[i]);
                }
                // this.graphEstimationData = chartEstimationData;

                this.loadEquipmentEstimationChart();
              }
            );
          } else {
            this.api.sizingOptimumResult(this.study.ID_STUDY).subscribe(
              (dataCh: ViewSizingResultOptimum) => {
                this.sizingOptimumValue = dataCh.result;
                this.selectedEquipment = dataCh.selectedEquipment;
                this.availableEquipment = dataCh.availableEquipment;
                this.equipmentList = this.availableEquipment;
                this.activeEquipment = this.selectedEquipment;
                this.productFlowRate = dataCh.productFlowRate;
                this.loadOptimumAvailableChart();
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
        console.log(this.checkcontrol);
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
  }
  moveAvailableEquipment() {
    for (let i = 0; i < Object.keys(this.selectedActiveEquip).length; i++) {
      this.equipmentList.push(this.selectedActiveEquip[i]);
      const index = this.activeEquipment.indexOf(this.selectedActiveEquip[i]);
      this.activeEquipment.splice(index, 1);
    }
    this.selectedActiveEquip = [];
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
  changeEstimationTrGraph(value) {
    this.trGraph = value;
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
  openSize() {
    this.activePage = 'result';
    const size = <HTMLElement>document.getElementById('sizing');
    const tem = <HTMLElement>document.getElementById('temPer');
    size.style.display = 'block';
    tem.style.display = 'none';
  }
  openTem() {
    this.activePage = 'profile';
    const size = <HTMLElement>document.getElementById('sizing');
    const tem = <HTMLElement>document.getElementById('temPer');
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      dataSymbol => {
        this.symbol = dataSymbol;
        this.api.getstudyEquipmentByStudyId(this.study.ID_STUDY).subscribe(
          data => {
            this.studyEquipments = data;
            this.api.temperatureProfile(this.studyEquipments[0]['ID_STUDY_EQUIPMENTS']).subscribe(
              dataTempFirst => {
                const tempChartDataObj =  dataTempFirst.tempChartData;
                const convChartDataObj =  dataTempFirst.convChartData;
                const chartTempData = [
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.top)), label: this.translate.instant('Top'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.bottom)), label: this.translate.instant('Bottom'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.left)), label: this.translate.instant('Left'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.right)), label: this.translate.instant('Right'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.front)), label: this.translate.instant('Front'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,0)', backgroundColor: 'rgb(255,0,0)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(tempChartDataObj.rear)), label: this.translate.instant('Rear'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,255)', backgroundColor: 'rgb(255,0,255)', borderWidth: 2}
                ];
                const chartConvData = [
                  {data: JSON.parse(JSON.stringify(convChartDataObj.top)), label: this.translate.instant('Top'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(convChartDataObj.bottom)), label: this.translate.instant('Bottom'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(convChartDataObj.left)), label: this.translate.instant('Left'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(convChartDataObj.right)), label: this.translate.instant('Right'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(convChartDataObj.front)), label: this.translate.instant('Front'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,0)', backgroundColor: 'rgb(255,0,0)', borderWidth: 2},
                  {data: JSON.parse(JSON.stringify(convChartDataObj.rear)), label: this.translate.instant('Rear'),
                  type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,255)', backgroundColor: 'rgb(255,0,255)', borderWidth: 2}
                ];
                this.tempChartData =  chartTempData;
                this.convChartData =  chartConvData;
                this.tempChartOptions = {
                  animation: false,
                  responsive: false,
                  legend: {
                    onClick: (e) => e.stopPropagation(),
                    position: 'right',
                    labels: {
                      padding: 20
                    }
                  },
                  hoverMode: 'index',
                  stacked: false,
                  title: {
                      display: false,
                      text: 'Chart 1',
                      fontColor: '#000',
                      fontSize: 20
                  },
                  scales: {
                      xAxes: [{
                          type: 'linear',
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: this.translate.instant(this.symbol.timePositionSymbol),
                              fontColor: '#f00',
                              fontSize: 20
                          },
                      }],
                      yAxes: [{
                          type: 'linear',
                          display: true,
                          id: 'y-axis-1',
                          scaleLabel: {
                              display: true,
                              labelString: this.translate.instant(this.symbol.temperatureSymbol),
                              fontColor: '#f00',
                              fontSize: 20
                          },
                          ticks: {
                              stepSize : 10
                          }
                      }],
                  }
                };
                this.convChartOptions = {
                  animation: false,
                  responsive: false,
                  legend: {
                    onClick: (e) => e.stopPropagation(),
                    position: 'right',
                    labels: {
                      padding: 20
                    }
                  },
                  hoverMode: 'index',
                  stacked: false,
                  title: {
                    display: false,
                    text: 'Chart 1',
                    fontColor: '#000',
                    fontSize: 20
                  },
                  scales: {
                    xAxes: [{
                        type: 'linear',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translate.instant(this.symbol.timePositionSymbol),
                            fontColor: '#f00',
                            fontSize: 20
                        },
                    }],
                    yAxes: [{
                      type: 'linear',
                      display: true,
                      id: 'y-axis-1',
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.convectionCoeffSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      },
                      ticks: {
                          min: dataTempFirst.minScaleConv,
                          max: dataTempFirst.maxScaleConv,
                      }
                    }],
                  }
                };
              }
            );
          }
        );
        size.style.display = 'none';
        tem.style.display = 'block';
      }
    );
  }
  loadTempChart(element) {
    const showLoaderTermChange = <HTMLElement>document.getElementById('showLoaderTermChange');
    showLoaderTermChange.style.display = 'block';
    this.api.temperatureProfile(element).subscribe(
      data => {
        showLoaderTermChange.style.display = 'none';
        const tempChartDataObj =  data.tempChartData;
        const convChartDataObj =  data.convChartData;
        const chartTempData = [
          {data: JSON.parse(JSON.stringify(tempChartDataObj.top)), label: this.translate.instant('Top'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(tempChartDataObj.bottom)), label: this.translate.instant('Bottom'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(tempChartDataObj.left)), label: this.translate.instant('Left'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(tempChartDataObj.right)), label: this.translate.instant('Right'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(tempChartDataObj.front)), label: this.translate.instant('Front'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,0)', backgroundColor: 'rgb(255,0,0)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(tempChartDataObj.rear)), label: this.translate.instant('Rear'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,255)', backgroundColor: 'rgb(255,0,255)', borderWidth: 2}
        ];
        const chartConvData = [
          {data: JSON.parse(JSON.stringify(convChartDataObj.top)), label: this.translate.instant('Top'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(convChartDataObj.bottom)), label: this.translate.instant('Bottom'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(convChartDataObj.left)), label: this.translate.instant('Left'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(convChartDataObj.right)), label: this.translate.instant('Right'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(convChartDataObj.front)), label: this.translate.instant('Front'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,0)', backgroundColor: 'rgb(255,0,0)', borderWidth: 2},
          {data: JSON.parse(JSON.stringify(convChartDataObj.rear)), label: this.translate.instant('Rear'),
          type: 'line', radius: 0, fill: false, borderColor: 'rgb(255,0,255)', backgroundColor: 'rgb(255,0,255)', borderWidth: 2}
        ];
        this.tempChartData =  chartTempData;
        this.convChartData =  chartConvData;

        this.tempChartOptions = {
          animation: false,
          responsive: false,
          legend: {
            onClick: (e) => e.stopPropagation(),
            position: 'right',
            labels: {
              padding: 20
            }
          },
          hoverMode: 'index',
          stacked: false,
          title: {
              display: false,
              text: 'Chart 1',
              fontColor: '#000',
              fontSize: 20
          },
          scales: {
              xAxes: [{
                  type: 'linear',
                  display: true,
                  scaleLabel: {
                      display: true,
                      labelString: this.translate.instant(this.symbol.timePositionSymbol),
                      fontColor: '#f00',
                      fontSize: 20
                  },
              }],
              yAxes: [{
                  type: 'linear',
                  display: true,
                  id: 'y-axis-1',
                  scaleLabel: {
                      display: true,
                      labelString: this.translate.instant(this.symbol.temperatureSymbol),
                      fontColor: '#f00',
                      fontSize: 20
                  },
                  ticks: {
                      stepSize : 10
                  }
              }],
          }
        };
        this.convChartOptions = {
          animation: false,
          responsive: false,
          legend: {
            onClick: (e) => e.stopPropagation(),
            position: 'right',
            labels: {
              padding: 20
            }
          },
          hoverMode: 'index',
          stacked: false,
          title: {
            display: false,
            text: 'Chart 1',
            fontColor: '#000',
            fontSize: 20
          },
          scales: {
            xAxes: [{
                type: 'linear',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: this.translate.instant(this.symbol.timePositionSymbol),
                    fontColor: '#f00',
                    fontSize: 20
                },
            }],
            yAxes: [{
              type: 'linear',
              display: true,
              id: 'y-axis-1',
              scaleLabel: {
                  display: true,
                  labelString: this.translate.instant(this.symbol.convectionCoeffSymbol),
                  fontColor: '#f00',
                  fontSize: 20
              },
              ticks: {
                  min: data.minScaleConv,
                  max: data.maxScaleConv,
              }
            }],
          }
        };
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
    console.log(this.selectedEquip);
    const showLoaderChange = <HTMLElement>document.getElementById('showLoaderChange');
    showLoaderChange.style.display = 'block';
    const element = this.selectedEquip;
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        showLoaderChange.style.display = 'none';
        this.dataGraphChart = data.dataGraphChart;
        const dataCustomFlowRate = [];
        const dataDhp = [];
        const dataDhpMax = [];
        const dataConso = [];
        const dataConsoMax = [];
        for (let j = 0; j < Object.keys(data.dataGraphChart).length; j++) {
          if (data.dataGraphChart[j].id == element) {
            const objDataGraph = data.dataGraphChart[j].data;
            const dataGrapChartLength = Object.keys(objDataGraph).length;
            for (let i = dataGrapChartLength - 1; i >= 0; i--) {
              dataCustomFlowRate.push(this.productFlowRate);
              dataDhp.push(objDataGraph[i].dhp);
              dataDhpMax.push(objDataGraph[i].dhpMax);
              dataConso.push(objDataGraph[i].conso);
              dataConsoMax.push(objDataGraph[i].consoMax);
            }
            this.estimationBarChart = new Chart({
              chart: {
                type: 'column'
              },
              title: {
                text: ''
              },
              xAxis: {
                categories: this.graphEstimationLabels
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
                  color: 'rgba(0, 0, 255, .9)',
                  data: JSON.parse(JSON.stringify(dataDhp)),
                  stack: 'male',
              }, {
                name: this.translate.instant('Maximum product flowrate'),
                color: 'rgba(153, 204, 255, 1)',
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
        }
      }
    );
  }
  isNumberic(number) {
    return Number.isInteger(Math.floor(number));
  }
}
