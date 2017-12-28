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
@Component({
  selector: 'app-sizing',
  templateUrl: './sizing.component.html',
  styleUrls: ['./sizing.component.scss']
})
export class SizingComponent implements OnInit, AfterViewInit {
  @ViewChild('calculator') calculator: CalculatorComponent;
  @ViewChild('graphChart') graphChart;

  constructor(private api: ApiService, private translate: TranslateService) { }

  public study;
  public symbol;
  public sizingOptimumValue;
  public sizingEstimationValue;
  public selectedEquipment;
  public availableEquipment;
  public customFlowRate;
  public graphOptions: any = {};
  public graphEstimationOptions: any = {};
  public graphLabels;
  public graphType = 'bar';
  public graphLegend = true;
  public studyEquipments;
  public temperatureProfileData;

  public tempChartData;
  public tempChartOptions;
  public tempChartLegend = true;
  public tempChartType= 'line';

  public convChartData;
  public convChartOptions;
  public convChartLegend = true;
  public convChartType = 'line';
  public selectedEquip: number;

  public grapColours: Array<any> = [
    { backgroundColor: ['rgb(255,0,0)', 'rgb(0, 0, 255)', 'rgb(153, 204, 255)', 'rgb(51, 204, 51)', 'rgb(102, 255, 153)'], }
  ];

  public tempColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)', 'rgb(0,192,192)', 'rgb(0,255,255)', 'rgb(0,255,0)', 'rgb(255,0,0)', 'rgb(255,0,255)'], }
  ];

  public graphData: any[];

  public dataGraphChart;
  public graphEstimationData;
  public graphEstimationLabels = ['TR-10°C', 'TR', 'TR+10°C'];

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.selectedEquip = 0;
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getSymbol(this.study.ID_STUDY).subscribe(
        data => {
          this.symbol = data;
        }
      );
      if (this.study.CALCULATION_MODE == 1) {
        const params: ApiService.SizingEstimationResultParams = {
          idStudy: this.study.ID_STUDY
        };
        this.api.sizingEstimationResult(params).subscribe(
          (data: ViewSizingEstimationResult) => {
            this.sizingEstimationValue = data.result;
            this.dataGraphChart = data.dataGraphChart;
            this.selectedEquip = this.dataGraphChart[0].id;
            const dataCustomFlowRate = [];
            const dataDhp = [];
            const dataDhpMax = [];
            const dataConso = [];
            const dataConsoMax = [];
            const objDataGraph = data.dataGraphChart[0].data;
            for (let i = 0; i < Object.keys(objDataGraph).length; i++) {
              dataCustomFlowRate.push(objDataGraph[i].dhp);
              dataDhp.push(objDataGraph[i].dhp);
              dataDhpMax.push(objDataGraph[i].dhpMax);
              dataConso.push(objDataGraph[i].conso);
              dataConsoMax.push(objDataGraph[i].consoMax);
            }
            const chartEstimationData = [
              {data: JSON.parse(JSON.stringify(dataCustomFlowRate)), label: this.translate.instant('Custom flow rate'),
              type: 'line', radius: 0, fill: false, borderColor: '#f00', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(dataDhp)), label: this.translate.instant('Product flowrate'),
                      backgroundColor: 'rgb(0, 0, 255)'},
              {data: JSON.parse(JSON.stringify(dataDhpMax)), label: this.translate.instant('Maximum product flowrate'),
                      backgroundColor: 'rgb(153, 204, 255)'},
              {data: JSON.parse(JSON.stringify(dataConso)),
                      label: this.translate.instant('Cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(51, 204, 51)', yAxisID: 'y-axis-2'},
              {data: JSON.parse(JSON.stringify(dataConsoMax)),
                      label: this.translate.instant('Maximum cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(102, 255, 153)', yAxisID: 'y-axis-2'}
            ];
            this.graphEstimationData = chartEstimationData;
            this.graphEstimationOptions = {
              scaleShowVerticalLines: false,
              responsive: false,
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20
                }
              },
              title:
              {
                display: false,
                text: 'Graph Chart',
                fontColor: '#000',
                fontSize: 20
              },
              tooltips: {
                mode: 'index',
                intersect: true
              },
              scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    scaleLabel: {
                      display: true,
                      labelString: this.translate.instant('Flow rate') + ' ' + this.symbol.productFlowSymbol,
                      fontColor: '#f00',
                      fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }, {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                      drawOnChartArea: false
                    },
                    scaleLabel: {
                      display: true,
                      labelString: this.translate.instant('Conso')
                      + ' ' + this.symbol.consumSymbol + '/' + this.symbol.perUnitOfMassSymbol,
                      fontColor: '#f00',
                      fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }],
              },
              showTooltips: false
            }; 
          }
        );
      } else {
        this.api.sizingOptimumResult(this.study.ID_STUDY).subscribe(
          data => {
            this.sizingOptimumValue = data.result;
            this.selectedEquipment = data.selectedEquipment;
            this.availableEquipment = data.availableEquipment;
            this.customFlowRate = data.customFlowRate;
            const labelGrap = [];
            const dataCustomFlowRate = [];
            const dataDhp = [];
            const dataDhpMax = [];
            const dataConso = [];
            const dataConsoMax = [];
            for (let i = 0; i < Object.keys(data.dataGrapChart).length; i++) {
              labelGrap.push(data.dataGrapChart[i].equipName);
              dataCustomFlowRate.push(data.customFlowRate);
              dataDhp.push(data.dataGrapChart[i].dhp);
              dataDhpMax.push(data.dataGrapChart[i].dhpMax);
              dataConso.push(data.dataGrapChart[i].conso);
              dataConsoMax.push(data.dataGrapChart[i].consoMax);
            }
            this.graphLabels = labelGrap;
            const chartData = [
              {data: JSON.parse(JSON.stringify(dataCustomFlowRate)), label: this.translate.instant('Custom flow rate'),
              type: 'line', radius: 0, fill: false, borderColor: '#f00', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(dataDhp)), label: this.translate.instant('Product flowrate'),
                      backgroundColor: 'rgb(0, 0, 255)'},
              {data: JSON.parse(JSON.stringify(dataDhpMax)), label: this.translate.instant('Maximum product flowrate'),
                      backgroundColor: 'rgb(153, 204, 255)'},
              {data: JSON.parse(JSON.stringify(dataConso)),
                      label: this.translate.instant('Cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(51, 204, 51)', yAxisID: 'y-axis-2'},
              {data: JSON.parse(JSON.stringify(dataConsoMax)),
                      label: this.translate.instant('Maximum cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(102, 255, 153)', yAxisID: 'y-axis-2'}
            ];
            this.graphData = chartData;
            this.graphOptions = {
              scaleShowVerticalLines: false,
              responsive: false,
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20
                }
              },
              title:
              {
                display: false,
                text: 'Graph Chart',
                fontColor: '#000',
                fontSize: 20
              },
              tooltips: {
                mode: 'index',
                intersect: true
              },
              scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    scaleLabel: {
                      display: true,
                      labelString: this.translate.instant('Flow rate') + ' ' + this.symbol.productFlowSymbol,
                      fontColor: '#f00',
                      fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }, {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        drawOnChartArea: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.translate.instant('Conso')
                        + ' ' + this.symbol.consumSymbol + '/' + this.symbol.perUnitOfMassSymbol,
                        fontColor: '#f00',
                        fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }],
              },
              showTooltips: false
            };
          }
        );
      }
    }
  }

  loadChart(element) {
    this.api.sizingOptimumResult(element).subscribe(
      data => {
        this.sizingOptimumValue = data.result;
        this.selectedEquipment = data.selectedEquipment;
        this.availableEquipment = data.availableEquipment;
        this.customFlowRate = data.customFlowRate;
        const labelGrap = [];
        const dataCustomFlowRate = [];
        const dataDhp = [];
        const dataDhpMax = [];
        const dataConso = [];
        const dataConsoMax = [];
        for (let i = 0; i < Object.keys(data.dataGrapChart).length; i++) {
          labelGrap.push(data.dataGrapChart[i].equipName);
          dataCustomFlowRate.push(data.customFlowRate);
          dataDhp.push(data.dataGrapChart[i].dhp);
          dataDhpMax.push(data.dataGrapChart[i].dhpMax);
          dataConso.push(data.dataGrapChart[i].conso);
          dataConsoMax.push(data.dataGrapChart[i].consoMax);
        }
        this.graphLabels = labelGrap;
      }
    );
  }
  openSize() {
    const size = <HTMLElement>document.getElementById('sizing');
    const tem = <HTMLElement>document.getElementById('temPer');
    size.style.display = 'block';
    tem.style.display = 'none';
  }
  openTem() {
    const size = <HTMLElement>document.getElementById('sizing');
    const tem = <HTMLElement>document.getElementById('temPer');
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
      }
    );
    this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
      data => {
        this.studyEquipments = data;
        // console.log(this.studyEquipments[0]);
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
  loadTempChart(element) {
    this.api.temperatureProfile(element).subscribe(
      data => {
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
  loadEstimationValue() {
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY,
      tr: 0
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        this.sizingEstimationValue = data.result;
      }
    );
  }
  loadEstimationValue01() {
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        this.sizingEstimationValue = data.result;
      }
    );
  }
  loadEstimationValue02() {
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY,
      tr: 2
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        this.sizingEstimationValue = data.result;
      }
    );
  }
  loadEquipmentEstimationChart() {
    const element = this.selectedEquip;
    const params: ApiService.SizingEstimationResultParams = {
      idStudy: this.study.ID_STUDY
    };
    this.api.sizingEstimationResult(params).subscribe(
      data => {
        this.dataGraphChart = data.dataGraphChart;
        const dataCustomFlowRate = [];
        const dataDhp = [];
        const dataDhpMax = [];
        const dataConso = [];
        const dataConsoMax = [];
        for (let j = 0; j < Object.keys(data.dataGraphChart).length; j++) {
          if (data.dataGraphChart[j].id == element) {
            const objDataGraph = data.dataGraphChart[j].data;
            for (let i = 0; i < Object.keys(objDataGraph).length; i++) {
              dataCustomFlowRate.push(objDataGraph[i].dhp);
              dataDhp.push(objDataGraph[i].dhp);
              dataDhpMax.push(objDataGraph[i].dhpMax);
              dataConso.push(objDataGraph[i].conso);
              dataConsoMax.push(objDataGraph[i].consoMax);
            }
            const chartEstimationData = [
              {data: JSON.parse(JSON.stringify(dataCustomFlowRate)), label: this.translate.instant('Custom flow rate'),
              type: 'line', radius: 0, fill: false, borderColor: '#f00', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(dataDhp)), label: this.translate.instant('Product flowrate'),
                      backgroundColor: 'rgb(0, 0, 255)'},
              {data: JSON.parse(JSON.stringify(dataDhpMax)), label: this.translate.instant('Maximum product flowrate'),
                      backgroundColor: 'rgb(153, 204, 255)'},
              {data: JSON.parse(JSON.stringify(dataConso)),
                      label: this.translate.instant('Cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(51, 204, 51)', yAxisID: 'y-axis-2'},
              {data: JSON.parse(JSON.stringify(dataConsoMax)),
                      label: this.translate.instant('Maximum cryogen consumption (product + equipment heat losses)'),
                      backgroundColor: 'rgb(102, 255, 153)', yAxisID: 'y-axis-2'}
            ];
            this.graphEstimationData = chartEstimationData;
            this.graphEstimationOptions = {
              scaleShowVerticalLines: false,
              responsive: false,
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20
                }
              },
              title:
              {
                display: false,
                text: 'Graph Chart',
                fontColor: '#000',
                fontSize: 20
              },
              tooltips: {
                mode: 'index',
                intersect: true
              },
              scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    scaleLabel: {
                      display: true,
                      labelString: this.translate.instant('Flow rate') + ' ' + this.symbol.productFlowSymbol,
                      fontColor: '#f00',
                      fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }, {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                      drawOnChartArea: false
                    },
                    scaleLabel: {
                      display: true,
                      labelString: this.translate.instant('Conso')
                      + ' ' + this.symbol.consumSymbol + '/' + this.symbol.perUnitOfMassSymbol,
                      fontColor: '#f00',
                      fontSize: 20
                    },
                    ticks: {
                      min: 0
                    }
                }],
              },
              showTooltips: false
            };
          }
        }
      }
    );
  }
}
