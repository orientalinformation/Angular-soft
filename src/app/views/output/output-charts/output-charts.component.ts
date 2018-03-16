import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { HttpClient } from '@angular/common/http';
import { Symbol } from '../../../api/models/symbol';
declare var Plotly: any;

@Component({
  selector: 'app-output-charts',
  templateUrl: './output-charts.component.html',
  styleUrls: ['./output-charts.component.scss']
})
export class OutputChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('valuesModal') public valuesModal: ModalDirective;
  public study;
  public symbol: Symbol;
  public activePage = '';
  public activeBtn = '';

  public displayLocationPage = true;
  public displayHeatExchangePage = false;
  public displayProductSectionPage = false;
  public displayTimeBasePage = false;
  public display2dOutlinePage = false;

  public outputProductChartList;
  public outputProductChart;
  public tempRecordPts;
  public nbSteps;
  public NB_STEPS: number;
  public selectedEquip;
  public folderImg;
  public shape: number;
  public mesAxisX;
  public mesAxisY;
  public mesAxisZ;
  public locationAxisSelected;
  public mesAxisXSelected: number;
  public mesAxisYSelected: number;
  public mesAxisZSelected: number;

  public rbpoint01;
  public rbpoint02;
  public rbpoint03;
  public radioChecked;
  public chart2D;

  public imgAxis = {
    axis1: '',
    axis2: '',
    axis3: ''
  };
  public imgPlan = {
    plan1: '',
    plan2: '',
    plan3: ''
  };

  public tempForm = {
    nbSteps: ''
  };

  public recordType: string;

  public imgProd3D;
  public radioDisable: boolean;
  public selectDisable: boolean;

  public headExchangeResult;
  public headExchangeCurve;

  public heatExchangeChartData;
  public heatExchangeChartOptions;
  public heatExchangeChartLegend = true;
  public heatExchangeChartType= 'line';
  public heatExchangeColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)'], }
  ];

  public selectedAxe: number;
  public productSectionDataChart;
  public productSectionResult;
  public productSectionValue;
  public productSectionRecAxis;
  public productSectionMesAxis;
  public productSectionAxisTemp;
  public axis1Disable: boolean;
  public axis2Disable: boolean;
  public axis3Disable: boolean;

  public productSectionChartData;
  public productSectionChartOptions;
  public productSectionChartLegend = true;
  public productSectionChartType= 'line';
  public productSectionColours: Array<any> = [];
  public dataArrChart: Array<any> = [];
  public dataArrColor = [];

  public timeBasedResult;
  public timeBasedCurve;
  public timeBasedLabel;

  public timeBasedChartData;
  public timeBasedChartOptions;
  public timeBasedChartLegend = true;
  public timeBasedChartType= 'line';
  public timeBasedColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)', 'rgb(0,192,192)', 'rgb(0,255,255)', 'rgb(0,255,0)'], }
  ];

  public loadLocationData: boolean;
  public loadHeatExchangeData: boolean;
  public loadTimeBaseData: boolean;
  public loadProductSectionData: boolean;
  public loadProductChartData: boolean;
  public loadProductChart: boolean;
  public temperatureStep: number;
  public temperatureMin: number;
  public temperatureMax: number;
  public timeRecords;
  public selectedPlan: number;
  public plan1Disable: boolean;
  public plan2Disable: boolean;
  public plan3Disable: boolean;
  public speedAnimation: Array<any> = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
  public selectedSpeed: number;
  public timeSelected: number;
  public timeInterval: number;
  public outline2Ddata;
  public contourData: Array<any> = [];
  public axisName: Array<any> = [];
  public axisX;
  public axisY;
  public dataFile = '';

  public dataContour = {
    X: [],
    Y: [],
    Z: [],
  };

  public minTempStep: number;
  public maxTempStep: number;
  public minTemperature: number;
  public maxTemperature: number;
  public displayContourChart: boolean;
  public contourImage: HTMLImageElement = new Image();
  public contourImages: Array<HTMLImageElement> = [];
  public activeContour = 0;
  public x: number;
  public displayAnimationContour;
  public sort = 1;
  public percent = 0;
  public contourValue;


  constructor(private api: ApiService, private translate: TranslateService, private router: Router, private http: HttpClient) {
      this.tempForm.nbSteps = '';
    }

  @ViewChild(BaseChartDirective) heatExchangeChart: BaseChartDirective;
  @ViewChild(BaseChartDirective) productSectionChart: BaseChartDirective;


  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.radioDisable = true;
      this.selectDisable = true;
      this.rbpoint01 = '';
      this.rbpoint02 = '';
      this.rbpoint03 = '';
      this.recordType = 'points';
      this.radioChecked = null;
      this.selectedAxe = 2;
      this.axis1Disable = false;
      this.axis2Disable = false;
      this.axis3Disable = false;
      this.selectedPlan = 3;
      this.plan1Disable = false;
      this.plan2Disable = false;
      this.plan3Disable = false;
      this.selectedSpeed = 1;
      this.axisX = '';
      this.axisY = '';
      this.loadLocationData = false;
      this.loadHeatExchangeData = false;
      this.loadTimeBaseData = false;
      this.loadProductSectionData = false;
      this.loadProductChartData = false;
      this.loadProductChart = false;
      this.x = -1;
      this.displayContourChart = false;
    }
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
        dataEquip => {
          if (dataEquip == '') {
            swal('Oops..', 'This study has no product charts results.', 'error');
            this.router.navigate(['/output/preliminary']);
          } else {
            this.outputProductChartList = dataEquip;
            this.selectedEquip = dataEquip[0].ID_STUDY_EQUIPMENTS;
            this.api.getProductElmt(this.study.ID_STUDY).subscribe(
              data => {
                this.shape = data.SHAPECODE;
                console.log(this.shape);
              }
            );
            this.refeshView();
          }
        }
      );
    }
  }
  refeshView() {
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.activePage = 'location';
        this.loadData();
        this.api.getTempRecordPts(this.study.ID_STUDY).subscribe(
          dataTemp => {
            this.tempRecordPts = dataTemp;
            this.nbSteps = dataTemp.NB_STEPS;
            this.NB_STEPS = this.nbSteps;
            this.loadLocationData = true;
          }
        );
      }
    );
  }
  savePoint() {
    swal('Oops', 'Not yet implement !', 'error');
    return;
  }
  changeEquipment() {
    this.activeBtn = '';
    this.radioDisable = true;
    this.selectDisable = true;
    this.radioChecked = null;
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.selectedAxe = 2;
    this.loadData();
  }

  loadData() {
    console.log(this.shape);
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      dataEquip => {
        this.outputProductChartList = dataEquip;
        for (let i = 0; i < Object.keys(dataEquip).length; i++) {
          if (dataEquip[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = dataEquip[i];
          }
        }
        if (this.shape == 1) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'SLAB';
          }
          this.axis1Disable = true;
          this.axis2Disable = false;
          this.axis3Disable = true;
        } else if (this.shape == 2) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'STANDING_PLPD/parallel';
            this.axis1Disable = true;
            this.axis2Disable = false;
            this.axis3Disable = false;
          } else {
            this.folderImg = 'STANDING_PLPD/perpendicular';
            this.axis1Disable = false;
            this.axis2Disable = false;
            this.axis3Disable = true;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_PLPD/parallel';
          } else {
            this.folderImg = 'LAYING_PLPD/perpendicular';
          }
          this.axis3Disable = true;
        } else if (this.shape == 4) {
          this.folderImg = 'STANDING_CYL';
          this.axis1Disable = false;
          this.axis2Disable = false;
          this.axis3Disable = true;
        } else if (this.shape == 5) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL/parallel';
          } else {
            this.folderImg = 'LAYING_CYL/perpendicular';
          }
          this.axis1Disable = false;
          this.axis2Disable = false;
          this.axis3Disable = true;
        } else if (this.shape == 6) {
          this.folderImg = 'SPHERE';
          this.axis1Disable = true;
          this.axis2Disable = false;
          this.axis3Disable = true;
        } else if (this.shape == 7) {
          this.folderImg = 'STANDING_CYL_C';
          this.axis3Disable = true;
        } else if (this.shape == 8) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL_C/parallel';
          } else {
            this.folderImg = 'LAYING_CYL_C/perpendicular';
          }
          this.axis3Disable = true;
        } else if (this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'BREADED/parallel';
            this.axis1Disable = true;
            this.axis2Disable = false;
            this.axis3Disable = false;
          } else {
            this.folderImg = 'BREADED/perpendicular';
            this.axis3Disable = true;
            this.axis2Disable = false;
            this.axis3Disable = false;
          }
        }
        console.log(this.axis3Disable);
        if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.plan1Disable = false;
            this.plan2Disable = true;
            this.plan3Disable = true;
            this.selectedPlan = 1;
          } else {
            this.plan1Disable = true;
            this.plan2Disable = true;
            this.plan3Disable = false;
            this.selectedPlan = 3;
          }
        } else if (this.shape == 3) {
          this.plan1Disable = true;
          this.plan2Disable = true;
          this.plan3Disable = false;
          this.selectedPlan = 3;
        } else {
          this.plan1Disable = false;
          this.plan2Disable = false;
          this.plan3Disable = false;
          this.selectedPlan = 3;
        }
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/shape.png';
        console.log(this.plan3Disable);
      }
    );
  }

  selectPoints() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'points';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/points.png';
    this.rbpoint01 = this.translate.instant('Surface');
    this.rbpoint02 = this.translate.instant('Internal');
    this.rbpoint03 = this.translate.instant('Bottom');
    this.recordType = 'points';
  }

  selectAxis() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'axis';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/axes.png';
    if (this.shape == 1) {
      this.rbpoint01 = this.translate.instant('Axis 3');
      this.rbpoint02 = this.translate.instant('Axis 2');
      this.rbpoint03 = this.translate.instant('Axis 1');
    } else if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Axis 3');
        this.rbpoint02 = this.translate.instant('Axis 2');
        this.rbpoint03 = this.translate.instant('Axis 1');
      } else {
        this.rbpoint01 = this.translate.instant('Axis 1');
        this.rbpoint02 = this.translate.instant('Axis 2');
        this.rbpoint03 = this.translate.instant('Axis 3');
      }
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Axis 3');
        this.rbpoint02 = this.translate.instant('Axis 1');
        this.rbpoint03 = this.translate.instant('Axis 2');
      } else {
        this.rbpoint01 = this.translate.instant('Axis 2');
        this.rbpoint02 = this.translate.instant('Axis 1');
        this.rbpoint03 = this.translate.instant('Axis 3');
      }
    } else if (this.shape == 4 || this.shape == 5 || this.shape == 6) {
      this.rbpoint01 = this.translate.instant('Axis 1');
      this.rbpoint02 = this.translate.instant('Axis 2');
      this.rbpoint03 = this.translate.instant('Axis 3');
    } else if (this.shape == 7) {
      this.rbpoint01 = this.translate.instant('Axis 2');
      this.rbpoint02 = this.translate.instant('Axis 3');
      this.rbpoint03 = this.translate.instant('Axis 1');
    } else if (this.shape == 8) {
      this.rbpoint01 = this.translate.instant('Axis 2');
      this.rbpoint02 = this.translate.instant('Axis 1');
      this.rbpoint03 = this.translate.instant('Axis 3');
    }
    this.recordType = 'axis';
  }

  selectPlans() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'plans';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/plans.png';
    if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Slice 12');
        this.rbpoint02 = this.translate.instant('Slice 13');
        this.rbpoint03 = this.translate.instant('Slice 23');
      } else {
        this.rbpoint01 = this.translate.instant('Slice 23');
        this.rbpoint02 = this.translate.instant('Slice 13');
        this.rbpoint03 = this.translate.instant('Slice 12');
      }
    } else if (this.shape == 5 || this.shape == 7) {
      this.rbpoint01 = this.translate.instant('Slice 13');
      this.rbpoint02 = this.translate.instant('Slice 23');
      this.rbpoint03 = this.translate.instant('Slice 12');
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Slice 12');
        this.rbpoint02 = this.translate.instant('Slice 23');
        this.rbpoint03 = this.translate.instant('Slice 13');
      } else {
        this.rbpoint01 = this.translate.instant('Slice 13');
        this.rbpoint02 = this.translate.instant('Slice 23');
        this.rbpoint03 = this.translate.instant('Slice 12');
      }
    } else if (this.shape == 4 || this.shape == 8) {
      this.rbpoint01 = this.translate.instant('Slice 23');
      this.rbpoint02 = this.translate.instant('Slice 13');
      this.rbpoint03 = this.translate.instant('Slice 12');
    }
    this.recordType = 'plans';
  }

  onrbChange(recordType, value) {
    this.selectDisable = false;
    this.radioChecked = value;
    console.log(this.shape);
    console.log(value);
    console.log(recordType);
    this.api.getMeshPoints(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        if (recordType === 'points') {
          this.mesAxisX = data[2];
          this.mesAxisY = data[1];
          this.mesAxisZ = data[0];
        }
        if (recordType === 'axis') {
          if (value === 0) {
            this.mesAxisX = [];
            this.mesAxisY = data[1];
            this.mesAxisZ = data[0];
          } else if (value === 1) {
            this.mesAxisX = data[2];
            this.mesAxisY = [];
            this.mesAxisZ = data[0];
          } else {
            this.mesAxisX = data[2];
            this.mesAxisY = data[1];
            this.mesAxisZ = [];
          }
        }
        if (recordType === 'plans') {
          if (value === 0) {
            this.mesAxisX = data[2];
            this.mesAxisY = [];
            this.mesAxisZ = [];
          } else if (value === 1) {
            this.mesAxisX = [];
            this.mesAxisY = data[1];
            this.mesAxisZ = [];
          } else {
            this.mesAxisX = [];
            this.mesAxisY = [];
            this.mesAxisZ = data[0];
          }
        }
      }
    );
    this.api.getlocationAxisSelected(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        this.locationAxisSelected = data;
        if (recordType === 'points') {
          if (value === 0) {
            this.mesAxisXSelected = this.locationAxisSelected.top[2];
            this.mesAxisYSelected = this.locationAxisSelected.top[1];
            this.mesAxisZSelected = this.locationAxisSelected.top[0];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_top.png';
          } else if (value === 1) {
            this.mesAxisXSelected = this.locationAxisSelected.int[2];
            this.mesAxisYSelected = this.locationAxisSelected.int[1];
            this.mesAxisZSelected = this.locationAxisSelected.int[0];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_int.png';
          } else {
            this.mesAxisXSelected = this.locationAxisSelected.bot[2];
            this.mesAxisYSelected = this.locationAxisSelected.bot[1];
            this.mesAxisZSelected = this.locationAxisSelected.bot[0];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_bot.png';
          }
        }
        if (recordType === 'axis') {
          console.log(this.shape);
          if (this.shape == 2 || this.shape == 9) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgAxis.axis1 = 'axe3.png';
              this.imgAxis.axis2 = 'axe2.png';
              this.imgAxis.axis3 = 'axe1.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[2];
              this.mesAxisYSelected = this.locationAxisSelected.int[1];
              this.mesAxisZSelected = this.locationAxisSelected.int[0];
            } else {
              this.imgAxis.axis1 = 'axe1.png';
              this.imgAxis.axis2 = 'axe2.png';
              this.imgAxis.axis3 = 'axe3.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[2];
              this.mesAxisYSelected = this.locationAxisSelected.int[1];
              this.mesAxisZSelected = this.locationAxisSelected.int[0];
            }
          } else if (this.shape == 7 || this.shape == 8) {
            this.imgAxis.axis1 = 'axe2.png';
            this.imgAxis.axis2 = 'axe1.png';
            this.imgAxis.axis3 = 'axe3.png';
            this.mesAxisXSelected = this.locationAxisSelected.int[1];
            this.mesAxisYSelected = this.locationAxisSelected.int[2];
            this.mesAxisZSelected = this.locationAxisSelected.int[0];
          } else if (this.shape == 3) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgAxis.axis1 = 'axe3.png';
              this.imgAxis.axis2 = 'axe1.png';
              this.imgAxis.axis3 = 'axe2.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[0];
              this.mesAxisYSelected = this.locationAxisSelected.int[0];
              this.mesAxisZSelected = this.locationAxisSelected.int[2];
            } else {
              this.imgAxis.axis1 = 'axe2.png';
              this.imgAxis.axis2 = 'axe1.png';
              this.imgAxis.axis3 = 'axe3.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[1];
              this.mesAxisYSelected = this.locationAxisSelected.int[2];
              this.mesAxisZSelected = this.locationAxisSelected.int[0];
            }
          } else if (this.shape == 1) {
            this.imgAxis.axis1 = 'axe3.png';
            this.imgAxis.axis2 = 'axe2.png';
            this.imgAxis.axis3 = 'axe1.png';
            this.mesAxisXSelected = this.locationAxisSelected.int[0];
            this.mesAxisYSelected = this.locationAxisSelected.int[1];
            this.mesAxisZSelected = this.locationAxisSelected.int[2];
          }
          if (value === 0) {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis1;
            this.mesAxisX = [];
          } else if (value === 1) {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis2;
          } else {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis3;
          }
        }
        if (recordType === 'plans') {
          if (this.shape == 2 || this.shape == 9) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgPlan.plan1 = 'plan12.png';
              this.imgPlan.plan2 = 'plan13.png';
              this.imgPlan.plan3 = 'plan23.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[2];
              this.mesAxisYSelected = this.locationAxisSelected.int[1];
              this.mesAxisZSelected = this.locationAxisSelected.int[0];
            } else {
              this.imgPlan.plan1 = 'plan23.png';
              this.imgPlan.plan2 = 'plan13.png';
              this.imgPlan.plan3 = 'plan12.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[0];
              this.mesAxisYSelected = this.locationAxisSelected.int[1];
              this.mesAxisZSelected = this.locationAxisSelected.int[2];
            }
          } else if (this.shape == 5 || this.shape == 7) {
            this.imgPlan.plan1 = 'plan13.png';
            this.imgPlan.plan2 = 'plan23.png';
            this.imgPlan.plan3 = 'plan12.png';
            this.mesAxisXSelected = this.locationAxisSelected.int[1];
            this.mesAxisYSelected = this.locationAxisSelected.int[0];
            this.mesAxisZSelected = this.locationAxisSelected.int[2];
          } else if (this.shape == 8) {
            this.imgPlan.plan1 = 'plan23.png';
            this.imgPlan.plan2 = 'plan13.png';
            this.imgPlan.plan3 = 'plan12.png';
            this.mesAxisXSelected = this.locationAxisSelected.int[0];
            this.mesAxisYSelected = this.locationAxisSelected.int[1];
            this.mesAxisZSelected = this.locationAxisSelected.int[2];
          } else if (this.shape == 3) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgPlan.plan1 = 'plan12.png';
              this.imgPlan.plan2 = 'plan23.png';
              this.imgPlan.plan3 = 'plan13.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[0];
              this.mesAxisYSelected = this.locationAxisSelected.int[2];
              this.mesAxisZSelected = this.locationAxisSelected.int[1];
            } else {
              this.imgPlan.plan1 = 'plan13.png';
              this.imgPlan.plan2 = 'plan23.png';
              this.imgPlan.plan3 = 'plan12.png';
              this.mesAxisXSelected = this.locationAxisSelected.int[1];
              this.mesAxisYSelected = this.locationAxisSelected.int[0];
              this.mesAxisZSelected = this.locationAxisSelected.int[2];
            }
          } else if (this.shape == 4) {
            this.imgPlan.plan1 = 'plan23.png';
            this.imgPlan.plan2 = 'plan13.png';
            this.imgPlan.plan3 = 'plan12.png';
            this.mesAxisXSelected = this.locationAxisSelected.int[0];
            this.mesAxisYSelected = this.locationAxisSelected.int[1];
            this.mesAxisZSelected = this.locationAxisSelected.int[2];
          }
          if (value === 0) {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan1;
          } else if (value === 1) {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan2;
          } else {
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan3;
          }
        }
        console.log(this.mesAxisXSelected);
        console.log(this.mesAxisYSelected);
        console.log(this.mesAxisZSelected);
      }
    );
  }

  loadLocation() {
    this.activePage = 'location';
    this.displayContourChart = true;
    this.stopAnimationContour();
    this.displayLocationPage = true;
    this.displayHeatExchangePage = false;
    this.displayProductSectionPage = false;
    this.displayTimeBasePage = false;
    this.display2dOutlinePage = false;
    this.refeshView();
  }

  loadheadExchage() {
    this.activePage = 'heatExchange';
    this.displayContourChart = true;
    this.stopAnimationContour();
    this.displayLocationPage = false;
    this.displayHeatExchangePage = true;
    this.displayProductSectionPage = false;
    this.displayTimeBasePage = false;
    this.display2dOutlinePage = false;
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (data[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = data[i];
          }
        }
        const params: ApiService.HeatExchangeParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.heatExchange(params).subscribe(
          dataChart => {
            this.headExchangeCurve = dataChart.curve;
            this.headExchangeResult = dataChart.result;
            const chartData = [
              {data: JSON.parse(JSON.stringify(this.headExchangeCurve)), label: this.translate.instant('Enthalpy'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2}
            ];
            this.heatExchangeChartData =  chartData;
            this.heatExchangeChartOptions = {
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
                  text: this.outputProductChart.EQUIP_NAME,
                  fontColor: '#f00',
                  fontSize: 16
              },
              scales: {
                  xAxes: [{
                      type: 'linear',
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.enthalpySymbol),
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
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
          }
        );
        this.loadHeatExchangeData = true;
      }
    );
  }

  loadProductSection() {
    this.activePage = 'productSection';
    this.displayContourChart = true;
    this.stopAnimationContour();
    this.displayLocationPage = false;
    this.displayHeatExchangePage = false;
    this.displayProductSectionPage = true;
    this.displayTimeBasePage = false;
    this.display2dOutlinePage = false;
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        this.productSectionDataChart = data.dataChart;
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
        this.loadChartProductSection(this.productSectionDataChart, this.productSectionResult);
        this.loadProductSectionData = true;
      }
    );
  }

  loadTimeBased() {
    this.activePage = 'timeBased';
    this.stopAnimationContour();
    this.displayLocationPage = false;
    this.displayHeatExchangePage = false;
    this.displayProductSectionPage = false;
    this.displayTimeBasePage = true;
    this.display2dOutlinePage = false;
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (data[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = data[i];
          }
        }
        const params: ApiService.TimeBasedParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.timeBased(params).subscribe(
          dataTimeBased => {
            console.log(dataTimeBased);
            this.timeBasedResult = dataTimeBased.result;
            this.timeBasedCurve = dataTimeBased.curve;
            this.timeBasedLabel = dataTimeBased.label;
            const chartDataObj =  this.timeBasedCurve;
            const chartData = [
              {data: JSON.parse(JSON.stringify(chartDataObj.top)), label: this.translate.instant('Top(' + this.timeBasedLabel.top + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.int)),
                      label: this.translate.instant('Internal(' + this.timeBasedLabel.int + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.bot)), label: this.translate.instant('Bottom(' + this.timeBasedLabel.bot + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.average)),
                      label: this.translate.instant('Average temperature'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2}
            ];
            this.timeBasedChartData =  chartData;
            console.log(this.timeBasedChartData);
            this.timeBasedChartOptions = {
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
                  text: this.outputProductChart.EQUIP_NAME,
                  fontColor: '#f00',
                  fontSize: 16
              },
              scales: {
                  xAxes: [{
                      type: 'linear',
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.temperatureSymbol),
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
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
            this.loadTimeBaseData = true;
          }
        );
      }
    );
  }

  loadOutlines2d() {
    this.activePage = 'outlines2d';
    this.displayLocationPage = false;
    this.displayHeatExchangePage = false;
    this.displayProductSectionPage = false;
    this.displayTimeBasePage = false;
    this.display2dOutlinePage = true;
    const params: ApiService.Productchart2DParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedPlan: this.selectedPlan,
      dimension: this.translate.instant('Dimension')
    };
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
    data => {
      console.log(data);
      for (let i = 0; i < Object.keys(data).length; i++) {
        if (data[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
          this.outputProductChart = data[i];
        }
      }
      this.api.getRecordPosition(this.outputProductChart.ID_STUDY_EQUIPMENTS).subscribe(
        dataRecord => {
          this.timeRecords = dataRecord;
        }
      );
      this.api.productchart2D(params).subscribe(
        dataPr => {
          console.log(dataPr);
          this.minTempStep = dataPr.minMax.minTempStep;
          this.maxTempStep = dataPr.minMax.maxTempStep;
          this.minTemperature = dataPr.minMax.minTemperature;
          this.maxTemperature = dataPr.minMax.maxTemperature;
          this.outline2Ddata = dataPr.valueRecAxis;
          this.timeSelected = dataPr.lfDwellingTime;
          this.timeInterval = dataPr.lftimeInterval;
          this.temperatureMin = dataPr.chartTempInterval[0];
          this.temperatureMax = dataPr.chartTempInterval[1];
          this.temperatureStep = dataPr.chartTempInterval[2];
          this.axisName = dataPr.axisName;
          if (typeof this.axisName[0] !== 'undefined') {
            this.axisX = this.axisName[0];
          }
          if (typeof this.axisName[1] !== 'undefined') {
            this.axisY = this.axisName[1];
          }

          this.contourImage.src = dataPr.imageContour[0];
          this.loadProductChart = true;
          this.loadProductChartData = true;
          this.displayContourChart = true;
        }
      );
    });
  }

  changeAxePS() {
    console.log(this.selectedAxe);

    this.loadProductSectionData = false;
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        console.log(data);
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
        this.productSectionDataChart = data.dataChart;
        this.loadChartProductSection(this.productSectionDataChart, this.productSectionResult);
        this.loadProductSectionData = true;
      }
    );
  }

  saveNbStep() {
    if (!this.NB_STEPS) {
      swal('Oops', this.translate.instant('Enter a value in Curve Number !'), 'error');
      return;
    } else if (!this.isNumberic(this.NB_STEPS)) {
      swal('Oops', this.translate.instant('Not a valid number in Curve Number !'), 'error');
      return;
    }
    const showLoader = <HTMLElement>document.getElementById('showLoaderProductSection');
    console.log(this.NB_STEPS);
    showLoader.style.display = 'block';
    const params = {
      ID_STUDY: this.study.ID_STUDY,
      ID_STUDY_EQUIPMENTS: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      AXE: this.selectedAxe,
      NB_STEPS: this.NB_STEPS
    };
    this.api.saveTempRecordPts(params).subscribe(
      data => {
        console.log(data);
        showLoader.style.display = 'none';
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
        this.productSectionDataChart = data.dataChart;
        // this.loadChartProductSection(this.productSectionDataChart, this.productSectionResult);
      },
      (err) => {
        swal('Error', err.error.message, 'error');
        console.log(err);
        showLoader.style.display = 'none';
      },
      () => {
      }
    );
  }

  loadChartProductSection(chartDataObj, productResust) {
    const dynamicColors = function() {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    };

    this.dataArrChart = [];
    this.dataArrColor = [];
    for (let i = 0; i < chartDataObj.length; i++) {
      const color = dynamicColors();
      const dataC = {
        data: JSON.parse(JSON.stringify(chartDataObj[i])),
        label: this.translate.instant('Temperature T ' + productResust[i] + '(' + this.symbol.timeSymbol + '))'),
        type: 'line',
        radius: 0,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2
      };

      this.dataArrColor.push(color);
      this.dataArrChart.push(dataC);
    }
    this.productSectionColours = [
      { backgroundColor: [this.dataArrColor], }
    ];
    console.log(this.dataArrColor);
    this.productSectionChartData =  JSON.parse(JSON.stringify(this.dataArrChart));
    this.productSectionChartOptions = {
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
        text: 'test',
        fontColor: '#f00',
        fontSize: 16
      },
      scales: {
        xAxes: [{
            type: 'linear',
            display: true,
            position: 'top',
            scaleLabel: {
                display: true,
                labelString: this.translate.instant(this.symbol.prodchartDimensionSymbol),
                fontColor: '#f00',
                fontSize: 20
            },
        }],
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-1',
            scaleLabel: {
                display: true,
                labelString: this.translate.instant(this.symbol.temperatureSymbol),
                fontColor: '#f00',
                fontSize: 20
            }
        }],
      }
    };
    if (this.productSectionChart) {
      this.productSectionChart.datasets[0].data = this.productSectionChartData;
      this.productSectionChart.chart.update();
    }
  }

  refreshStaticTemp() {
    const temperatureStepId = <HTMLElement>document.getElementById('temperatureStep');
    const temperatureMinId = <HTMLElement>document.getElementById('temperatureMin');
    const temperatureMaxId = <HTMLElement>document.getElementById('temperatureMax');
    console.log(Number.isInteger(this.temperatureStep));
    if (!this.temperatureStep) {
      temperatureStepId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature step !'), 'error');
      return;
    } else if (!this.isNumberic(this.temperatureStep)) {
      temperatureStepId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature step !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureStep, this.minTempStep, this.maxTempStep) === false) {
      temperatureStepId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature step (' + this.minTempStep + ' : ' + this.maxTempStep + ') !'), 'error');
      return;
    } else if (!this.temperatureMin) {
      temperatureMinId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature Min !'), 'error');
      return;
    } else if (!this.isNumberic(this.temperatureMin)) {
      temperatureMinId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature Min !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureMin, this.minTemperature, this.maxTemperature) === false) {
      temperatureMinId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature Min (' + this.minTemperature + ' : ' + this.maxTemperature + ') !'),
      'error');
      return;
    } else if (!this.temperatureMax) {
      temperatureMaxId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature Max !'), 'error');
    } else if (!this.isNumberic(this.temperatureMax)) {
      temperatureMaxId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature Max !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureMax, this.minTemperature, this.maxTemperature) === false) {
      temperatureMaxId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature Max (' + this.minTemperature + ' : ' + this.maxTemperature + ') !'),
      'error');
      return;
    }
    this.loadProductChart = false;
    const params = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedPlan: this.selectedPlan,
      temperatureStep: this.temperatureStep,
      temperatureMin: this.temperatureMin,
      temperatureMax: this.temperatureMax,
      timeSelected: this.timeSelected,
      timeInterval: this.timeInterval,
      axisX: this.axisX,
      axisY: this.axisY,
      dimension: this.translate.instant('Dimension'),
    };
    this.api.productChart2DStatic(params).subscribe(
      dataPr => {
        console.log(dataPr);
        this.temperatureMin = dataPr.chartTempInterval[0];
        this.temperatureMax = dataPr.chartTempInterval[1];
        this.temperatureStep = dataPr.chartTempInterval[2];
        this.contourImage.src = dataPr.imageContour[0];
        this.loadProductChart = true;
        this.displayContourChart = true;
      }
    );
  }

  rewindForwardStatic(type) {
    const temperatureStepId = <HTMLElement>document.getElementById('temperatureStep');
    const temperatureMinId = <HTMLElement>document.getElementById('temperatureMin');
    const temperatureMaxId = <HTMLElement>document.getElementById('temperatureMax');
    console.log(Number.isInteger(this.temperatureStep));
    if (!this.temperatureStep) {
      temperatureStepId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature step !'), 'error');
      return;
    } else if (!this.isNumberic(this.temperatureStep)) {
      temperatureStepId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature step !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureStep, this.minTempStep, this.maxTempStep) === false) {
      temperatureStepId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature step (' + this.minTempStep + ' : ' + this.maxTempStep + ') !'), 'error');
      return;
    } else if (!this.temperatureMin) {
      temperatureMinId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature Min !'), 'error');
      return;
    } else if (!this.isNumberic(this.temperatureMin)) {
      temperatureMinId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature Min !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureMin, this.minTemperature, this.maxTemperature) === false) {
      temperatureMinId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature Min (' + this.minTemperature + ' : ' + this.maxTemperature + ') !'),
      'error');
      return;
    } else if (!this.temperatureMax) {
      temperatureMaxId.focus();
      swal('Oops', this.translate.instant('Enter a value in Temperature Max !'), 'error');
    } else if (!this.isNumberic(this.temperatureMax)) {
      temperatureMaxId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Temperature Max !'), 'error');
      return;
    } else if (this.isInRangeOutput(this.temperatureMax, this.minTemperature, this.maxTemperature) === false) {
      temperatureMaxId.focus();
      swal('Oops',
      this.translate.instant('Value out of range in Temperature Max (' + this.minTemperature + ' : ' + this.maxTemperature + ') !'),
      'error');
      return;
    }
    this.displayContourChart = true;
    this.loadProductChart = false;
    for (let i = 0; i < Object.keys(this.timeRecords).length; i++) {
      if (this.timeSelected == this.timeRecords[i]['RECORD_TIME']) {
        if (type == 0) {
          console.log(this.timeSelected);
          if (i > 0) {
            this.timeSelected = this.timeRecords[i - 1]['RECORD_TIME'];
          } else {
            this.loadProductChart = true;
            return;
          }
        } else if (type == 1) {
          console.log(this.timeSelected);
          if (i < Object.keys(this.timeRecords).length - 1) {
            this.timeSelected = this.timeRecords[i + 1]['RECORD_TIME'];
            break;
          } else {
            this.loadProductChart = true;
            return;
          }
        }
      }
    }
    const params = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedPlan: this.selectedPlan,
      temperatureStep: this.temperatureStep,
      temperatureMin: this.temperatureMin,
      temperatureMax: this.temperatureMax,
      timeSelected: this.timeSelected,
      timeInterval: this.timeInterval,
      axisX: this.axisX,
      axisY: this.axisY,
      dimension: this.translate.instant('Dimension'),
    };
    this.api.productChart2DStatic(params).subscribe(
      dataPr => {
        console.log(dataPr);
        this.temperatureMin = dataPr.chartTempInterval[0];
        this.temperatureMax = dataPr.chartTempInterval[1];
        this.temperatureStep = dataPr.chartTempInterval[2];
        this.loadProductChart = true;
      }
    );
  }

  refreshAnim() {
    this.stopAnimationContour();
    const timeIntervalId = <HTMLElement>document.getElementById('timeInterval');
    if (!this.timeInterval) {
      timeIntervalId.focus();
      swal('Oops', this.translate.instant('Enter a value in Interval of time (s) !'), 'error');
      return;
    } else if (!this.isNumberic(this.timeInterval) || this.timeInterval <= 0) {
      timeIntervalId.focus();
      swal('Oops', this.translate.instant('Not a valid number in Interval of time (s) !'), 'error');
      return;
    }
    this.loadProductChart = false;
    const params = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedPlan: this.selectedPlan,
      temperatureStep: this.temperatureStep,
      temperatureMin: this.temperatureMin,
      temperatureMax: this.temperatureMax,
      timeSelected: this.timeSelected,
      timeInterval: this.timeInterval,
      axisX: this.axisX,
      axisY: this.axisY,
      dimension: this.translate.instant('Dimension'),
    };
    this.api.productchart2DAnim(params).subscribe(
      data => {
        console.log(data);
        this.temperatureMin = data.chartTempInterval[0];
        this.temperatureMax = data.chartTempInterval[1];
        this.temperatureStep = data.chartTempInterval[2];
        this.contourImages = [];
        for (let i = 0; i < data.imageContour.length; i++) {
          const contourImage: HTMLImageElement = new Image();
          contourImage.src = data.imageContour[i];
          this.contourImages.push(contourImage);
        }
        console.log(this.contourImages);
        this.displayContourChart = false;
        this.loadProductChart = true;
        this.displayAnimationContour = setInterval(() => {
          this.displayNextImage();
        }, this.selectedSpeed * 1000);
      }
    );
  }

  getValueContour() {
    this.api.readDataContour(this.outputProductChart['ID_STUDY_EQUIPMENTS']).subscribe(
      data => {
        this.contourValue = JSON.parse(data.valueContour);
        console.log(this.contourValue);
        this.valuesModal.show();
      }
    );
  }

  displayNextImage() {
    if (!this.contourImages) {
      return; // no data
    }
    if (this.activeContour < this.contourImages.length - 1) {
      this.activeContour++;
    } else {
      this.activeContour = 0;
    }
    if (this.sort < this.contourImages.length) {
      this.sort++;
    } else {
      this.sort = 1;
    }
    this.percent = 100 - (100 - (this.sort / this.contourImages.length) * 100);
    console.log(this.percent);
  }

  stopAnimationContour() {
    if (this.displayAnimationContour) {
      clearInterval(this.displayAnimationContour);
      this.displayContourChart = true;
    }
  }
  getConfig(url) {
    return this.http.get(url);
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

  contourChart(dataContour) {
    const size = this.temperatureStep;
    const data = [{
      x: JSON.parse(JSON.stringify(dataContour.X)),
      y: JSON.parse(JSON.stringify(dataContour.Y)),
      z: JSON.parse(JSON.stringify(dataContour.Z)),
      type: 'contour',
      colorscale: [
        [0, 'rgb(0,25,255)'],
        [.125, 'rgb(0, 107, 255)'],
        [.25, 'rgb(0,152,255)'],
        [.375, 'rgb(37, 232, 109)'],
        [.5, 'rgb(44,255,150)'],
        [.625, 'rgb(151,255,0)'],
        [.75, 'rgb(255,234,0)'],
        [.875, 'rgb(255,111,0)'],
        [1, 'rgb(255,0,0)']
      ],
      colorbar: {
        thickness: 50,
        thicknessmode: 'pixels',
        len: 1,
        lenmode: 'fraction',
        outlinewidth: 0,
        borderwidth: 1
        },
      contours: {
        start: this.temperatureMin,
        end: this.temperatureMax,
        size: size,
        coloring: 'heatmap'
      }
    }
  ];

  const layout = {
    title: '',
    autosize: true,
    height: 400,
    showlegend: false,
    margin: {
      t: 10, r: 0, b: 43, l: 40
    },
    xaxis: {
      title: this.translate.instant('Dimension') + ' ' + this.axisX + ' (' + this.symbol.prodchartDimensionSymbol + ')',
      titlefont: {
        color: '#f00'
      }
    },
    yaxis: {
      title: this.translate.instant('Dimension') + ' '   + this.axisY + ' (' + this.symbol.prodchartDimensionSymbol + ')',
      titlefont: {
        color: '#f00'
      }
    }
  };

  Plotly.newPlot('contourChart', data, layout, {displayModeBar: false});
  }
}
