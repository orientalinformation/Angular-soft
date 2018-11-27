import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Models from '../../../api/models';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { HttpClient } from '@angular/common/http';
import { Symbol } from '../../../api/models/symbol';
import { Study } from '../../../api/models/study';
import { User } from '../../../api/models/user';
import { TextService } from '../../../shared/text.service';
declare var Plotly: any;

@Component({
  selector: 'app-output-charts',
  templateUrl: './output-charts.component.html',
  styleUrls: ['./output-charts.component.scss']
})
export class OutputChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('valuesModal') public valuesModal: ModalDirective;
  public study: Study;
  public user: User;
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
  public mesAxisXData;
  public mesAxisYData;
  public mesAxisZData;
  public locationAxisSelected;
  public mesAxisXSelected: number;
  public mesAxisYSelected: number;
  public mesAxisZSelected: number;
  public selectedPoints: Models.SelectedMeshPoint;

  public rbpoint01;
  public rbpoint02;
  public rbpoint03;
  public radioChecked = 0;
  public chart2D;
  public disableChange = false;
  public imageTimeBased = '';
  public imageProductSection = '';
  public imageHeatExchange = '';

  public pointSelectedValueX: number;
  public pointSelectedValueY: number;
  public pointSelectedValueZ: number;

  public pointSelectedUnitX: string;
  public pointSelectedUnitY: string;
  public pointSelectedUnitZ: string;

  public imgPoint = {
    top: 'point_top.png',
    int: 'point_int.png',
    bot: 'point_bot.png'
  };

  public imgAxis = {
    axis1: 'axe1.png',
    axis2: 'axe2.png',
    axis3: 'axe3.png'
  };
  public imgPlan = {
    plan1: 'plan12.png',
    plan2: 'plan13.png',
    plan3: 'plan23.png'
  };

  public tempForm = {
    nbSteps: ''
  };

  public recordType: string;

  public imgProd3D;
  public radioDisable: boolean;
  public selectDisable: boolean;
  public radioMeshAxis = {
    obj1: false,
    obj2: false,
    obj3: false
  };
  public radioMeshPlan = {
    obj1: false,
    obj2: false,
    obj3: false
  };
  public selectedMeshPoint = {
    obj1: {
      x: true,
      y: true,
      z: true
    },
    obj2: {
      x: true,
      y: true,
      z: true
    },
    obj3: {
      x: true,
      y: true,
      z: true
    },
  };
  public selectedMeshAxis = {
    obj1: {
      x: true,
      y: true,
      z: true
    },
    obj2: {
      x: true,
      y: true,
      z: true
    },
    obj3: {
      x: true,
      y: true,
      z: true
    },
  };
  public selectedMeshPlan = {
    obj1: {
      x: true,
      y: true,
      z: true
    },
    obj2: {
      x: true,
      y: true,
      z: true
    },
    obj3: {
      x: true,
      y: true,
      z: true
    },
  };
  public selectedPointStorage = {
    point: {
      top: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      int: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      bot: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    },
    axis: {
      axe1: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      axe2: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      axe3: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    },
    plan: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
  };
  public radio1Disable = true;
  public radio2Disable = true;
  public radio3Disable = true;

  public select1Disable = true;
  public select2Disable = true;
  public select3Disable = true;

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
  public productSectionValueLength = 0;
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
  public planDisabled = false;

  public POINT_TOP_X: number;
  public POINT_TOP_Y: number;
  public POINT_TOP_Z: number;
  public POINT_INT_X: number;
  public POINT_INT_Y: number;
  public POINT_INT_Z: number;
  public POINT_BOT_X: number;
  public POINT_BOT_Y: number;
  public POINT_BOT_Z: number;
  public AXIS_AXE1_X: number;
  public AXIS_AXE1_Y: number;
  public AXIS_AXE1_Z: number;
  public AXIS_AXE2_X: number;
  public AXIS_AXE2_Y: number;
  public AXIS_AXE2_Z: number;
  public AXIS_AXE3_X: number;
  public AXIS_AXE3_Y: number;
  public AXIS_AXE3_Z: number;
  public PLAN_X: number;
  public PLAN_Y: number;
  public PLAN_Z: number;

  public laddaViewContourValue = false;


  constructor(private api: ApiService, private translate: TranslateService, private router: Router, private http: HttpClient,
    private toastr: ToastrService, private text: TextService) {
      this.tempForm.nbSteps = '';
    }

  @ViewChild(BaseChartDirective) heatExchangeChart: BaseChartDirective;
  @ViewChild(BaseChartDirective) productSectionChart: BaseChartDirective;


  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.user = JSON.parse(localStorage.getItem('user'));
      if (this.study.ID_USER != this.user.ID_USER) {
        this.disableChange = true;
      }
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
          // console.log(dataEquip);
          if (dataEquip == '') {
            swal('Warning', 'This study has no product charts results.', 'error');
            this.router.navigate(['/output/preliminary']);
          } else {
            this.outputProductChartList = dataEquip;
            this.selectedEquip = dataEquip[0].ID_STUDY_EQUIPMENTS;
            this.api.getProductElmt(this.study.ID_STUDY).subscribe(
              data => {
                this.shape = data.SHAPECODE;
                if (this.shape == 1 || this.shape == 6) {
                  this.planDisabled = true;
                }
                // console.log(this.shape);
              }
            );
            this.refeshView();
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.stopAnimationContour();
  }

  refeshView() {
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.activePage = 'location';
        this.loadData();
        // console.log(this.radioMeshAxis);
        // console.log(this.radioMeshPlan);
        this.api.getTempRecordPts(this.study.ID_STUDY).subscribe(
          dataTemp => {
            // console.log(dataTemp);
            this.tempRecordPts = dataTemp;
            this.nbSteps = dataTemp.NB_STEPS;
            this.NB_STEPS = this.nbSteps;
            this.loadLocationData = true;
          }
        );
        this.api.getSelectedMeshPoints(this.study.ID_STUDY).subscribe(
          dataMesh => {
            // console.log(data);
            this.selectedPoints = dataMesh;
          }
        );
      }
    );
  }
  changeEquipment() {
    this.activeBtn = '';
    this.radioDisable = true;
    this.selectDisable = true;
    this.radioChecked = null;
    this.selectedAxe = 2;
    this.loadData();
  }

  loadData() {
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      dataEquip => {
        this.outputProductChartList = dataEquip;
        for (let i = 0; i < Object.keys(dataEquip).length; i++) {
          if (dataEquip[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = dataEquip[i];
          }
        }
        if (this.shape == 1) {
          this.folderImg = 'SLAB';
          this.axis1Disable = true;
          this.axis2Disable = false;
          this.axis3Disable = true;
          this.radioMeshAxis.obj1 = true;
          this.radioMeshAxis.obj3 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: true,
              y: false,
              z: true,
            },
            obj3: {
              x: true,
              y: false,
              z: true,
            }
          };
        } else if (this.shape == 2 || this.shape == 10 || this.shape == 18) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'STANDING_PLPD/parallel';
            if (this.shape < 10) {
              this.axis1Disable = true;
            }
            this.axis2Disable = false;
            this.axis3Disable = false;
          } else {
            this.folderImg = 'STANDING_PLPD/perpendicular';
            this.axis1Disable = false;
            this.axis2Disable = false;
            if (this.shape < 10) {
              this.axis3Disable = true;
            }
          }
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: false,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: false,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: true,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshPlan = {
            obj1: {
              x: false,
              y: true,
              z: true,
            },
            obj2: {
              x: true,
              y: false,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: false,
            }
          };
        } else if (this.shape == 3 || this.shape == 11) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_PLPD/parallel';
          } else {
            this.folderImg = 'LAYING_PLPD/perpendicular';
          }
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: false,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: false,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: true,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshPlan = {
            obj1: {
              x: false,
              y: true,
              z: true,
            },
            obj2: {
              x: true,
              y: false,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: false,
            }
          };
        } else if (this.shape == 4 || this.shape == 12 || this.shape == 19) {
          this.folderImg = 'STANDING_CYL';
          this.axis1Disable = false;
          this.axis2Disable = false;
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.radioMeshAxis.obj3 = true;
          this.radioMeshPlan.obj1 = true;
          this.radioMeshPlan.obj2 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: false,
              z: true,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: true,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: true,
            }
          };
        } else if (this.shape == 5 || this.shape == 13 || this.shape == 20) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL/parallel';
          } else {
            this.folderImg = 'LAYING_CYL/perpendicular';
          }
          this.axis1Disable = false;
          this.axis2Disable = false;
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.radioMeshAxis.obj3 = true;
          this.radioMeshPlan.obj1 = true;
          this.radioMeshPlan.obj2 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: false,
              z: true,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: true,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: true,
            }
          };
        } else if (this.shape == 6 || this.shape == 14) {
          this.folderImg = 'SPHERE';
          if (this.shape < 10) {
            this.axis1Disable = true;
          }
          this.axis2Disable = false;
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.radioMeshAxis.obj1 = true;
          this.radioMeshAxis.obj3 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: true,
              y: false,
              z: true,
            },
            obj3: {
              x: true,
              y: false,
              z: true,
            }
          };
        } else if (this.shape == 7 || this.shape == 15) {
          this.folderImg = 'STANDING_CYL_C';
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.radioMeshAxis.obj3 = true;
          this.radioMeshPlan.obj1 = true;
          this.radioMeshPlan.obj2 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: false,
              z: true,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: true,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: true,
            }
          };
        } else if (this.shape == 8 || this.shape == 16) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL_C/parallel';
          } else {
            this.folderImg = 'LAYING_CYL_C/perpendicular';
          }
          if (this.shape < 10) {
            this.axis3Disable = true;
          }
          this.radioMeshAxis.obj3 = true;
          this.radioMeshPlan.obj1 = true;
          this.radioMeshPlan.obj2 = true;
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: false,
              z: true,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: true,
            },
            obj2: {
              x: false,
              y: true,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: true,
            }
          };
        } else if (this.shape == 9 || this.shape == 17) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'BREADED/parallel';
            if (this.shape < 10) {
              this.axis1Disable = true;
            }
            this.axis2Disable = false;
            this.axis3Disable = false;
          } else {
            this.folderImg = 'BREADED/perpendicular';
            if (this.shape < 10) {
              this.axis1Disable = true;
            }
            this.axis2Disable = false;
            this.axis3Disable = false;
          }
          this.selectedMeshPoint = {
            obj1: {
              x: false,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: false,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: false,
            }
          };
          this.selectedMeshAxis = {
            obj1: {
              x: true,
              y: false,
              z: false,
            },
            obj2: {
              x: false,
              y: true,
              z: false,
            },
            obj3: {
              x: false,
              y: false,
              z: true,
            }
          };
          this.selectedMeshPlan = {
            obj1: {
              x: false,
              y: true,
              z: true,
            },
            obj2: {
              x: true,
              y: false,
              z: true,
            },
            obj3: {
              x: true,
              y: true,
              z: false,
            }
          };
        }
        // console.log(this.axis3Disable);
        if (this.shape < 9) {
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
        } else {
          switch (Number(this.shape)) {
            case this.text.shapeNames.D_STAND_CYL:
            case this.text.shapeNames.D_LYI_CYL:
            case this.text.shapeNames.D_STAND_CON_CYL:
            case this.text.shapeNames.D_LYN_CON_CYL:
            case this.text.shapeNames.D_STAND_OVAL:
            case this.text.shapeNames.D_LYN_OVAL:
              this.plan1Disable = true;
              this.plan2Disable = true;
              this.plan3Disable = false;
              this.selectedPlan = 3;
              break;
            default:
              this.plan1Disable = false;
              this.plan2Disable = false;
              this.plan3Disable = false;
              this.selectedPlan = 3;
              break;
          }
        }
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/shape.png';
        // console.log(this.plan3Disable);
        this.api.getlocationAxisSelected(this.study.ID_STUDY).subscribe(
          data => {
            // console.log(data);
            this.locationAxisSelected = data;
            this.selectedPointStorage.point.top.x = data['top'][0].value;
            this.selectedPointStorage.point.top.y = data['top'][1].value;
            this.selectedPointStorage.point.top.z = data['top'][2].value;
            this.selectedPointStorage.point.int.x = data['int'][0].value;
            this.selectedPointStorage.point.int.y = data['int'][1].value;
            this.selectedPointStorage.point.int.z = data['int'][2].value;
            this.selectedPointStorage.point.bot.x = data['bot'][0].value;
            this.selectedPointStorage.point.bot.y = data['bot'][1].value;
            this.selectedPointStorage.point.bot.z = data['bot'][2].value;
            this.selectedPointStorage.plan.x = data['plan'][0].value;
            this.selectedPointStorage.plan.y = data['plan'][1].value;
            this.selectedPointStorage.plan.z = data['plan'][2].value;
            if (this.shape == 1) {
              this.selectedPointStorage.axis.axe1.x = data['axe1'][0].value;
              this.selectedPointStorage.axis.axe1.y = data['axe1'][1].value;
              this.selectedPointStorage.axis.axe1.z = data['axe1'][2].value;
              this.selectedPointStorage.axis.axe2.x = data['axe2'][0].value;
              this.selectedPointStorage.axis.axe2.y = data['axe2'][1].value;
              this.selectedPointStorage.axis.axe2.z = data['axe2'][2].value;
              this.selectedPointStorage.axis.axe3.x = data['axe3'][0].value;
              this.selectedPointStorage.axis.axe3.y = data['axe3'][1].value;
              this.selectedPointStorage.axis.axe3.z = data['axe3'][2].value;
            } else if (this.shape == 2 || this.shape == 9) {
              if (this.outputProductChart.ORIENTATION == 1) {
                this.selectedPointStorage.axis.axe1.x = data['axe3'][0].value;
                this.selectedPointStorage.axis.axe1.y = data['axe3'][1].value;
                this.selectedPointStorage.axis.axe1.z = data['axe3'][2].value;
                this.selectedPointStorage.axis.axe2.x = data['axe2'][0].value;
                this.selectedPointStorage.axis.axe2.y = data['axe2'][1].value;
                this.selectedPointStorage.axis.axe2.z = data['axe2'][2].value;
                this.selectedPointStorage.axis.axe3.x = data['axe1'][0].value;
                this.selectedPointStorage.axis.axe3.y = data['axe1'][1].value;
                this.selectedPointStorage.axis.axe3.z = data['axe1'][2].value;
              } else {
                this.selectedPointStorage.axis.axe1.x = data['axe1'][0].value;
                this.selectedPointStorage.axis.axe1.y = data['axe1'][1].value;
                this.selectedPointStorage.axis.axe1.z = data['axe1'][2].value;
                this.selectedPointStorage.axis.axe2.x = data['axe2'][0].value;
                this.selectedPointStorage.axis.axe2.y = data['axe2'][1].value;
                this.selectedPointStorage.axis.axe2.z = data['axe2'][2].value;
                this.selectedPointStorage.axis.axe3.x = data['axe3'][0].value;
                this.selectedPointStorage.axis.axe3.y = data['axe3'][1].value;
                this.selectedPointStorage.axis.axe3.z = data['axe3'][2].value;
              }
            } else if (this.shape == 3) {
              if (this.outputProductChart.ORIENTATION == 1) {
                this.selectedPointStorage.axis.axe1.x = data['axe3'][0].value;
                this.selectedPointStorage.axis.axe1.y = data['axe3'][1].value;
                this.selectedPointStorage.axis.axe1.z = data['axe3'][2].value;
                this.selectedPointStorage.axis.axe2.x = data['axe1'][0].value;
                this.selectedPointStorage.axis.axe2.y = data['axe1'][1].value;
                this.selectedPointStorage.axis.axe2.z = data['axe1'][2].value;
                this.selectedPointStorage.axis.axe3.x = data['axe2'][0].value;
                this.selectedPointStorage.axis.axe3.y = data['axe2'][1].value;
                this.selectedPointStorage.axis.axe3.z = data['axe2'][2].value;
              } else {
                this.selectedPointStorage.axis.axe1.x = data['axe2'][0].value;
                this.selectedPointStorage.axis.axe1.y = data['axe2'][1].value;
                this.selectedPointStorage.axis.axe1.z = data['axe2'][2].value;
                this.selectedPointStorage.axis.axe2.x = data['axe1'][0].value;
                this.selectedPointStorage.axis.axe2.y = data['axe1'][1].value;
                this.selectedPointStorage.axis.axe2.z = data['axe1'][2].value;
                this.selectedPointStorage.axis.axe3.x = data['axe3'][0].value;
                this.selectedPointStorage.axis.axe3.y = data['axe3'][1].value;
                this.selectedPointStorage.axis.axe3.z = data['axe3'][2].value;
              }
            } else if (this.shape == 4 || this.shape == 5) {
              this.selectedPointStorage.axis.axe1.x = data['axe1'][0].value;
              this.selectedPointStorage.axis.axe1.y = data['axe1'][1].value;
              this.selectedPointStorage.axis.axe1.z = data['axe1'][2].value;
              this.selectedPointStorage.axis.axe2.x = data['axe2'][0].value;
              this.selectedPointStorage.axis.axe2.y = data['axe2'][1].value;
              this.selectedPointStorage.axis.axe2.z = data['axe2'][2].value;
              this.selectedPointStorage.axis.axe3.x = 0.0;
              this.selectedPointStorage.axis.axe3.y = 0.0;
              this.selectedPointStorage.axis.axe3.z = 0.0;
            } else if (this.shape ==7 || this.shape == 8) {
              this.selectedPointStorage.axis.axe1.x = data['axe2'][0].value;
              this.selectedPointStorage.axis.axe1.y = data['axe2'][1].value;
              this.selectedPointStorage.axis.axe1.z = data['axe2'][2].value;
              this.selectedPointStorage.axis.axe2.x = data['axe1'][0].value;
              this.selectedPointStorage.axis.axe2.y = data['axe1'][1].value;
              this.selectedPointStorage.axis.axe2.z = data['axe1'][2].value;
              this.selectedPointStorage.axis.axe3.x = 0.0;
              this.selectedPointStorage.axis.axe3.y = 0.0;
              this.selectedPointStorage.axis.axe3.z = 0.0;
            } else if (this.shape == 6) {
              this.selectedPointStorage.axis.axe1.x = 0.0;
              this.selectedPointStorage.axis.axe1.y = 0.0;
              this.selectedPointStorage.axis.axe1.z = 0.0;
              this.selectedPointStorage.axis.axe2.x = data['axe1'][0].value;
              this.selectedPointStorage.axis.axe2.y = data['axe1'][1].value;
              this.selectedPointStorage.axis.axe2.z = data['axe1'][2].value;
              this.selectedPointStorage.axis.axe3.x = 0.0;
              this.selectedPointStorage.axis.axe3.y = 0.0;
              this.selectedPointStorage.axis.axe3.z = 0.0;
            } else {
              this.selectedPointStorage.axis.axe1.x = 0.0;
              this.selectedPointStorage.axis.axe1.y = 0.0;
              this.selectedPointStorage.axis.axe1.z = 0.0;
              this.selectedPointStorage.axis.axe2.x = 0.0;
              this.selectedPointStorage.axis.axe2.y = 0.0;
              this.selectedPointStorage.axis.axe2.z = 0.0;
              this.selectedPointStorage.axis.axe3.x = 0.0;
              this.selectedPointStorage.axis.axe3.y = 0.0;
              this.selectedPointStorage.axis.axe3.z = 0.0;
            }
            // console.log(this.selectedPointStorage);
          }
        );
        this.api.getMeshPoints(this.study.ID_STUDY).subscribe(
          data => {
            if (this.shape == 1) {
              this.mesAxisXData = data[0];
              this.mesAxisYData = data[1];
              this.mesAxisZData = data[2];
            } else if (this.shape == 2 || this.shape == 9) {
              if (this.outputProductChart.ORIENTATION == 1) {
                this.mesAxisXData = data[2];
                this.mesAxisYData = data[1];
                this.mesAxisZData = data[0];
              } else {
                this.mesAxisXData = data[0];
                this.mesAxisYData = data[1];
                this.mesAxisZData = data[2];
              }
            } else if (this.shape == 3) {
              if (this.outputProductChart.ORIENTATION == 1) {
                this.mesAxisXData = data[2];
                this.mesAxisYData = data[0];
                this.mesAxisZData = data[1];
              } else {
                this.mesAxisXData = data[1];
                this.mesAxisYData = data[0];
                this.mesAxisZData = data[2];
              }
            } else if (this.shape == 4 || this.shape == 5) {
              this.mesAxisXData = data[0];
              this.mesAxisYData = data[1];
              this.mesAxisZData = [];
            } else if (this.shape == 7 || this.shape == 8) {
              this.mesAxisXData = data[1];
              this.mesAxisYData = data[0];
              this.mesAxisZData = [];
            } else if (this.shape == 6){
              this.mesAxisXData = [];
              this.mesAxisYData = data[1];
              this.mesAxisZData = [];
            } else {
              this.mesAxisXData = [];
              this.mesAxisYData = [];
              this.mesAxisZData = [];
            }
            // console.log(data);
          }
        );
      }
    );
  }

  convertPointForAppletDim(axisDataAxe) {
    const result = [];
    if (this.shape == 1) {
      result[0] = axisDataAxe[0];
      result[1] = axisDataAxe[1];
      result[2] = axisDataAxe[2];
    } else if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        result[0] = axisDataAxe[2];
        result[1] = axisDataAxe[1];
        result[2] = axisDataAxe[0];
      } else {
        result[0] = axisDataAxe[0];
        result[1] = axisDataAxe[1];
        result[2] = axisDataAxe[2];
      }
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        result[0] = axisDataAxe[2];
        result[1] = axisDataAxe[0];
        result[2] = axisDataAxe[1];
      } else {
        result[0] = axisDataAxe[1];
        result[1] = axisDataAxe[0];
        result[2] = axisDataAxe[2];
      }
    } else if (this.shape == 4 || this.shape == 5) {
      result[0] = axisDataAxe[0];
      result[1] = axisDataAxe[1];
      result[2] = 0.0;
    } else if (this.shape == 7 || this.shape == 8) {
      result[0] = axisDataAxe[1];
      result[1] = axisDataAxe[0];
      result[2] = 0.0;
    } else if (this.shape == 6) {
      result[0] = 0.0;
      result[1] = axisDataAxe[1];
      result[2] = 0.0;
    } else {
      result[0] = 0.0;
      result[1] = 0.0;
      result[2] = 0.0;
    }

    return result;
  }

  selectPoints() {
    this.mesAxisXSelected = 0;
    this.mesAxisYSelected = 0;
    this.mesAxisZSelected = 0;
    this.activeBtn = 'points';
    this.radioDisable = false;
    this.radio1Disable = false;
    this.radio2Disable = false;
    this.radio3Disable = false;
    this.select1Disable = true;
    this.select2Disable = true;
    this.select3Disable = true;
    this.pointSelectedValueX = 0;
    this.pointSelectedValueY = 0;
    this.pointSelectedValueZ = 0;
    this.pointSelectedUnitX = '';
    this.pointSelectedUnitY = '';
    this.pointSelectedUnitZ = '';
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/points.png';
    this.rbpoint01 = this.translate.instant('Surface');
    this.rbpoint02 = this.translate.instant('Internal');
    this.rbpoint03 = this.translate.instant('Bottom');
    this.recordType = 'points';
  }

  selectAxis() {
    this.mesAxisXSelected = 0;
    this.mesAxisYSelected = 0;
    this.mesAxisZSelected = 0;
    // console.log(this.outputProductChart.ORIENTATION);
    this.activeBtn = 'axis';
    this.radioDisable = false;
    this.radio1Disable = this.radioMeshAxis.obj1;
    this.radio2Disable = this.radioMeshAxis.obj2;
    this.radio3Disable = this.radioMeshAxis.obj3;
    this.select1Disable = true;
    this.select2Disable = true;
    this.select3Disable = true;
    this.pointSelectedValueX = 0;
    this.pointSelectedValueY = 0;
    this.pointSelectedValueZ = 0;
    this.pointSelectedUnitX = '';
    this.pointSelectedUnitY = '';
    this.pointSelectedUnitZ = '';
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
    } else {
      this.rbpoint01 = this.translate.instant('Axis 1');
      this.rbpoint02 = this.translate.instant('Axis 2');
      this.rbpoint03 = this.translate.instant('Axis 3');
    }
    this.recordType = 'axis';
  }

  selectPlans() {
    this.mesAxisXSelected = 0;
    this.mesAxisYSelected = 0;
    this.mesAxisZSelected = 0;
    this.activeBtn = 'plans';
    this.radioDisable = false;
    this.radio1Disable = this.radioMeshPlan.obj1;
    this.radio2Disable = this.radioMeshPlan.obj2;
    this.radio3Disable = this.radioMeshPlan.obj3;
    this.select1Disable = true;
    this.select2Disable = true;
    this.select3Disable = true;
    this.radioChecked = null;
    this.pointSelectedValueX = 0;
    this.pointSelectedValueY = 0;
    this.pointSelectedValueZ = 0;
    this.pointSelectedUnitX = '';
    this.pointSelectedUnitY = '';
    this.pointSelectedUnitZ = '';
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
    } else {
      this.rbpoint01 = this.translate.instant('Slice 12');
      this.rbpoint02 = this.translate.instant('Slice 13');
      this.rbpoint03 = this.translate.instant('Slice 23');
    }
    this.recordType = 'plans';
  }

  onrbChange(recordType, value) {
    this.selectDisable = false;
    this.radioChecked = value;
    // console.log(this.shape);
    // console.log(this.selectedPointStorage);
    this.api.getMeshPoints(this.study.ID_STUDY).subscribe(
      data => {
        // console.log(data);
        if (this.shape == 1) {
          this.mesAxisX = data[0];
          this.mesAxisY = data[1];
          this.mesAxisZ = data[2];
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisX = data[2];
            this.mesAxisY = data[1];
            this.mesAxisZ = data[0];
          } else {
            this.mesAxisX = data[0];
            this.mesAxisY = data[1];
            this.mesAxisZ = data[2];
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisX = data[2];
            this.mesAxisY = data[0];
            this.mesAxisZ = data[1];
          } else {
            this.mesAxisX = data[1];
            this.mesAxisY = data[0];
            this.mesAxisZ = data[2];
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisX = data[0];
          this.mesAxisY = data[1];
          this.mesAxisZ = [];
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisX = data[1];
          this.mesAxisY = data[0];
          this.mesAxisZ = [];
        } else if (this.shape == 6){
          this.mesAxisX = [];
          this.mesAxisY = data[1];
          this.mesAxisZ = [];
        } else {
          this.mesAxisX = [];
          this.mesAxisY = [];
          this.mesAxisZ = [];
        }
        // console.log(data);
        if (recordType === 'points') {
          if (value === 0) {
            this.select1Disable = this.selectedMeshPoint.obj1.x;
            this.select2Disable = this.selectedMeshPoint.obj1.y;
            this.select3Disable = this.selectedMeshPoint.obj1.z;
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPoint.top;
          } else if (value === 1) {
            this.select1Disable = this.selectedMeshPoint.obj2.x;
            this.select2Disable = this.selectedMeshPoint.obj2.y;
            this.select3Disable = this.selectedMeshPoint.obj2.z;
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPoint.int;
          } else {
            this.select1Disable = this.selectedMeshPoint.obj3.x;
            this.select2Disable = this.selectedMeshPoint.obj3.y;
            this.select3Disable = this.selectedMeshPoint.obj3.z;
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPoint.bot;
          }
        }
        if (recordType === 'axis') {
          // console.log(this.shape);
          if (this.shape == 2 || this.shape == 9) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgAxis.axis1 = 'axe3.png';
              this.imgAxis.axis2 = 'axe2.png';
              this.imgAxis.axis3 = 'axe1.png';
            } else {
              this.imgAxis.axis1 = 'axe1.png';
              this.imgAxis.axis2 = 'axe2.png';
              this.imgAxis.axis3 = 'axe3.png';
            }
          } else if (this.shape == 7 || this.shape == 8) {
            this.imgAxis.axis1 = 'axe2.png';
            this.imgAxis.axis2 = 'axe1.png';
            this.imgAxis.axis3 = 'axe3.png';
          } else if (this.shape == 3) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgAxis.axis1 = 'axe3.png';
              this.imgAxis.axis2 = 'axe1.png';
              this.imgAxis.axis3 = 'axe2.png';
            } else {
              this.imgAxis.axis1 = 'axe2.png';
              this.imgAxis.axis2 = 'axe1.png';
              this.imgAxis.axis3 = 'axe3.png';
            }
          } else if (this.shape == 1) {
            this.imgAxis.axis1 = 'axe3.png';
            this.imgAxis.axis2 = 'axe2.png';
            this.imgAxis.axis3 = 'axe1.png';
          }
          if (value === 0) {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshAxis.obj1.x;
              this.select2Disable = this.selectedMeshAxis.obj1.y;
              this.select3Disable = this.selectedMeshAxis.obj1.z;
            } else {
              this.select1Disable = false;
              this.select2Disable = false;
              this.select3Disable = true;
            }
            this.mesAxisX = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis1;
          } else if (value === 1) {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshAxis.obj2.x;
              this.select2Disable = this.selectedMeshAxis.obj2.y;
              this.select3Disable = this.selectedMeshAxis.obj2.z;
            } else {
              this.select1Disable = false;
              this.select2Disable = true;
              this.select3Disable = false;
            }
              this.mesAxisY = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis2;
          } else {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshAxis.obj3.x;
              this.select2Disable = this.selectedMeshAxis.obj3.y;
              this.select3Disable = this.selectedMeshAxis.obj3.z;
            } else {
              this.select1Disable = true;
              this.select2Disable = false;
              this.select3Disable = false;
            }
            this.mesAxisZ = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis3;
          }
        }
        if (recordType === 'plans') {
          if (this.shape == 2 || this.shape == 9) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgPlan.plan1 = 'plan12.png';
              this.imgPlan.plan2 = 'plan13.png';
              this.imgPlan.plan3 = 'plan23.png';
            } else {
              this.imgPlan.plan1 = 'plan23.png';
              this.imgPlan.plan2 = 'plan13.png';
              this.imgPlan.plan3 = 'plan12.png';
            }
          } else if (this.shape == 5 || this.shape == 7) {
            this.imgPlan.plan1 = 'plan13.png';
            this.imgPlan.plan2 = 'plan23.png';
            this.imgPlan.plan3 = 'plan12.png';
          } else if (this.shape == 8) {
            this.imgPlan.plan1 = 'plan23.png';
            this.imgPlan.plan2 = 'plan13.png';
            this.imgPlan.plan3 = 'plan12.png';
          } else if (this.shape == 3) {
            if (this.outputProductChart.ORIENTATION == 1) {
              this.imgPlan.plan1 = 'plan12.png';
              this.imgPlan.plan2 = 'plan23.png';
              this.imgPlan.plan3 = 'plan13.png';
            } else {
              this.imgPlan.plan1 = 'plan13.png';
              this.imgPlan.plan2 = 'plan23.png';
              this.imgPlan.plan3 = 'plan12.png';
            }
          } else if (this.shape == 4) {
            this.imgPlan.plan1 = 'plan23.png';
            this.imgPlan.plan2 = 'plan13.png';
            this.imgPlan.plan3 = 'plan12.png';
          }
          if (value === 0) {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshPlan.obj1.x;
              this.select2Disable = this.selectedMeshPlan.obj1.y;
              this.select3Disable = this.selectedMeshPlan.obj1.z;
            } else {
              this.select1Disable = false;
              this.select2Disable = true;
              this.select3Disable = true;
            }
            this.mesAxisY = [];
            this.mesAxisZ = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan1;
          } else if (value === 1) {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshPlan.obj2.x;
              this.select2Disable = this.selectedMeshPlan.obj2.y;
              this.select3Disable = this.selectedMeshPlan.obj2.z;
            } else {
              this.select1Disable = true;
              this.select2Disable = false;
              this.select3Disable = true;
            }
            this.mesAxisX = [];
            this.mesAxisZ = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan2;
          } else {
            if (this.shape <= 9) {
              this.select1Disable = this.selectedMeshPlan.obj3.x;
              this.select2Disable = this.selectedMeshPlan.obj3.y;
              this.select3Disable = this.selectedMeshPlan.obj3.z;
            } else {
              this.select1Disable = true;
              this.select2Disable = true;
              this.select3Disable = false;
            }
            this.mesAxisX = [];
            this.mesAxisY = [];
            this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan3;
          }
        }
      }
    );
    if (recordType === 'points') {
      if (value === 0) {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.point.top.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.top.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.top.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.top.x;
            this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.top.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.top.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.top.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.top.y;
            this.mesAxisYSelected = this.selectedPointStorage.point.top.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.point.top.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.point.top.y;
          this.mesAxisYSelected = this.selectedPointStorage.point.top.x;
          this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.point.top.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.point.top.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.top.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.top.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = this.selectedPoints.POINT1_X.value;
          this.pointSelectedValueY = this.selectedPoints.POINT1_Y.value;
          this.pointSelectedValueZ = this.selectedPoints.POINT1_Z.value;
          this.pointSelectedUnitX = this.selectedPoints.POINT1_X.unit;
          this.pointSelectedUnitY = this.selectedPoints.POINT1_Y.unit;
          this.pointSelectedUnitZ = this.selectedPoints.POINT1_Z.unit;
        }
      } else if (value === 1) {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.point.int.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.int.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.int.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.int.x;
            this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.int.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.int.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.int.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.int.y;
            this.mesAxisYSelected = this.selectedPointStorage.point.int.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.point.int.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.point.int.y;
          this.mesAxisYSelected = this.selectedPointStorage.point.int.x;
          this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.point.int.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.point.int.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.int.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.int.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = this.selectedPoints.POINT2_X.value;
          this.pointSelectedValueY = this.selectedPoints.POINT2_Y.value;
          this.pointSelectedValueZ = this.selectedPoints.POINT2_Z.value;
          this.pointSelectedUnitX = this.selectedPoints.POINT2_X.unit;
          this.pointSelectedUnitY = this.selectedPoints.POINT2_Y.unit;
          this.pointSelectedUnitZ = this.selectedPoints.POINT2_Z.unit;
        }
      } else if (value == 2) {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.point.bot.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.bot.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.bot.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.bot.x;
            this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
            this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.point.bot.z;
            this.mesAxisYSelected = this.selectedPointStorage.point.bot.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.bot.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.point.bot.y;
            this.mesAxisYSelected = this.selectedPointStorage.point.bot.x;
            this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.point.bot.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.point.bot.y;
          this.mesAxisYSelected = this.selectedPointStorage.point.bot.x;
          this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.point.bot.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.point.bot.x;
          this.mesAxisYSelected = this.selectedPointStorage.point.bot.y;
          this.mesAxisZSelected = this.selectedPointStorage.point.bot.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = this.selectedPoints.POINT3_X.value;
          this.pointSelectedValueY = this.selectedPoints.POINT3_Y.value;
          this.pointSelectedValueZ = this.selectedPoints.POINT3_Z.value;
          this.pointSelectedUnitX = this.selectedPoints.POINT3_X.unit;
          this.pointSelectedUnitY = this.selectedPoints.POINT3_Y.unit;
          this.pointSelectedUnitZ = this.selectedPoints.POINT3_Z.unit;
        }
      }
    }
    if (recordType === 'axis') {
      if (value === 0) {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.x;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.y;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.y;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.x;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe1.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe1.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe1.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = this.selectedPoints.AXE1_X.value;
          this.pointSelectedValueY = this.selectedPoints.AXE1_Y.value;
          this.pointSelectedValueZ = 0;
          this.pointSelectedUnitX = this.selectedPoints.AXE1_X.unit;
          this.pointSelectedUnitY = this.selectedPoints.AXE1_Y.unit;
          this.pointSelectedUnitZ = '';
        }
      } else if (value === 1) {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.x;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.y;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.y;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.x;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe2.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe2.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe2.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = this.selectedPoints.AXE2_X.value;
          this.pointSelectedValueY = 0;
          this.pointSelectedValueZ = this.selectedPoints.AXE2_Z.value;
          this.pointSelectedUnitX = this.selectedPoints.AXE2_X.unit;
          this.pointSelectedUnitY = '';
          this.pointSelectedUnitZ = this.selectedPoints.AXE2_Z.unit;
        }
      } else {
        if (this.shape == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.x;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.x;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.z;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.y;
          } else {
            this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.y;
            this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.x;
            this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
        } else if (this.shape == 7 || this.shape == 8) {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.y;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.x;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
        } else if (this.shape == 6){
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.axis.axe3.x;
          this.mesAxisYSelected = this.selectedPointStorage.axis.axe3.y;
          this.mesAxisZSelected = this.selectedPointStorage.axis.axe3.z;
        }

        if (this.shape > 9) {
          this.pointSelectedValueX = 0;
          this.pointSelectedValueY = this.selectedPoints.AXE3_Y.value;
          this.pointSelectedValueZ = this.selectedPoints.AXE3_Z.value;
          this.pointSelectedUnitX = '';
          this.pointSelectedUnitY = this.selectedPoints.AXE3_Y.unit;
          this.pointSelectedUnitZ = this.selectedPoints.AXE3_Z.unit;
        }
      }
    }
    if (recordType === 'plans') {
      if (this.shape == 1) {
        this.mesAxisXSelected = this.selectedPointStorage.plan.x;
        this.mesAxisYSelected = this.selectedPointStorage.plan.y;
        this.mesAxisZSelected = this.selectedPointStorage.plan.z;
      } else if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.plan.z;
          this.mesAxisYSelected = this.selectedPointStorage.plan.y;
          this.mesAxisZSelected = this.selectedPointStorage.plan.x;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.plan.x;
          this.mesAxisYSelected = this.selectedPointStorage.plan.y;
          this.mesAxisZSelected = this.selectedPointStorage.plan.z;
        }
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.mesAxisXSelected = this.selectedPointStorage.plan.z;
          this.mesAxisYSelected = this.selectedPointStorage.plan.x;
          this.mesAxisZSelected = this.selectedPointStorage.plan.y;
        } else {
          this.mesAxisXSelected = this.selectedPointStorage.plan.y;
          this.mesAxisYSelected = this.selectedPointStorage.plan.x;
          this.mesAxisZSelected = this.selectedPointStorage.plan.z;
        }
      } else if (this.shape == 4 || this.shape == 5) {
        this.mesAxisXSelected = this.selectedPointStorage.plan.x;
        this.mesAxisYSelected = this.selectedPointStorage.plan.y;
        this.mesAxisZSelected = this.selectedPointStorage.plan.z;
      } else if (this.shape == 7 || this.shape == 8) {
        this.mesAxisXSelected = this.selectedPointStorage.plan.y;
        this.mesAxisYSelected = this.selectedPointStorage.plan.x;
        this.mesAxisZSelected = this.selectedPointStorage.plan.z;
      } else if (this.shape == 6){
        this.mesAxisXSelected = this.selectedPointStorage.plan.x;
        this.mesAxisYSelected = this.selectedPointStorage.plan.y;
        this.mesAxisZSelected = this.selectedPointStorage.plan.z;
      } else {
        this.mesAxisXSelected = this.selectedPointStorage.plan.x;
        this.mesAxisYSelected = this.selectedPointStorage.plan.y;
        this.mesAxisZSelected = this.selectedPointStorage.plan.z;
      }
      switch (Number(value)) {
        case 0:
          this.pointSelectedValueX = this.selectedPoints.PLAN_X.value;
          this.pointSelectedValueY = 0;
          this.pointSelectedValueZ = 0;
          this.pointSelectedUnitX = this.selectedPoints.PLAN_X.unit;
          this.pointSelectedUnitY = '';
          this.pointSelectedUnitZ = '';
          break;
        case 1:
          this.pointSelectedValueX = 0;
          this.pointSelectedValueY = this.selectedPoints.PLAN_Y.value;
          this.pointSelectedValueZ = 0;
          this.pointSelectedUnitX = '';
          this.pointSelectedUnitY = this.selectedPoints.PLAN_Y.unit;
          this.pointSelectedUnitZ = '';
          break;
        case 2:
          this.pointSelectedValueX = 0;
          this.pointSelectedValueY = 0;
          this.pointSelectedValueZ = this.selectedPoints.PLAN_Z.value;
          this.pointSelectedUnitX = '';
          this.pointSelectedUnitY = '';
          this.pointSelectedUnitZ = this.selectedPoints.PLAN_Z.unit;
          break;
      }
    }
    // console.log(this.mesAxisXSelected);
    // console.log(this.mesAxisYSelected);
    // console.log(this.mesAxisZSelected);
  }

  changeX() {
    // console.log(this.recordType);
    // console.log(this.radioChecked);
    // console.log(this.mesAxisXSelected);
    if (this.recordType === 'points') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.top.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.top.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.top.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.top.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.top.y = this.mesAxisXSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.point.top.x = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.point.top.x = this.mesAxisXSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.int.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.int.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.int.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.int.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.int.y = this.mesAxisXSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.point.int.x = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.point.int.x = this.mesAxisXSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.bot.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.bot.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.point.bot.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.bot.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.bot.y = this.mesAxisXSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.point.bot.x = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.point.bot.x = this.mesAxisXSelected;
        }
      }
    }
    if (this.recordType === 'axis') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe1.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe1.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe1.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe1.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe1.x = this.mesAxisXSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe1.y = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.axis.axe1.x = this.mesAxisXSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe2.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe2.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe2.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe2.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe2.y = this.mesAxisXSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.axis.axe2.x = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.axis.axe2.x = this.mesAxisXSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe3.x = this.mesAxisXSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe3.x = this.mesAxisXSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.z = this.mesAxisXSelected;
          } else {
            this.selectedPointStorage.axis.axe3.y = this.mesAxisXSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe3.x = this.mesAxisXSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe3.y = this.mesAxisXSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.axis.axe3.x = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.axis.axe3.x = this.mesAxisXSelected;
        }
      }
    }
    if (this.recordType === 'plans') {
      if (this.shape == 1) {
        this.selectedPointStorage.plan.x = this.mesAxisXSelected;
      } else if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.z = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.plan.x = this.mesAxisXSelected;
        }
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.z = this.mesAxisXSelected;
        } else {
          this.selectedPointStorage.plan.y = this.mesAxisXSelected;
        }
      } else if (this.shape == 4 || this.shape == 5) {
        this.selectedPointStorage.plan.x = this.mesAxisXSelected;
      } else if (this.shape == 7 || this.shape == 8) {
        this.selectedPointStorage.plan.y = this.mesAxisXSelected;
      } else if (this.shape == 6){
        this.selectedPointStorage.plan.x = this.mesAxisXSelected;
      } else {
        this.selectedPointStorage.plan.x = this.mesAxisXSelected;
      }
    }
    // console.log(this.selectedPointStorage);
  }

  changeY() {
    // console.log(this.recordType);
    // console.log(this.radioChecked);
    if (this.recordType === 'points') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.top.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.top.x = this.mesAxisYSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.point.top.y = this.mesAxisYSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.int.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.int.x = this.mesAxisYSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.point.int.y = this.mesAxisYSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.point.bot.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.bot.x = this.mesAxisYSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.point.bot.y = this.mesAxisYSelected;
        }
      }
    }
    if (this.recordType === 'axis') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe1.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe1.x = this.mesAxisYSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.axis.axe1.y = this.mesAxisYSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe2.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe2.x = this.mesAxisYSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.axis.axe2.y = this.mesAxisYSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.x = this.mesAxisYSelected;
          } else {
            this.selectedPointStorage.axis.axe3.x = this.mesAxisYSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe3.x = this.mesAxisYSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.axis.axe3.y = this.mesAxisYSelected;
        }
      }
    }
    if (this.recordType === 'plans') {
      if (this.shape == 1) {
        this.selectedPointStorage.plan.y = this.mesAxisYSelected;
      } else if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.y = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.plan.y = this.mesAxisYSelected;
        }
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.x = this.mesAxisYSelected;
        } else {
          this.selectedPointStorage.plan.x = this.mesAxisYSelected;
        }
      } else if (this.shape == 4 || this.shape == 5) {
        this.selectedPointStorage.plan.y = this.mesAxisYSelected;
      } else if (this.shape == 7 || this.shape == 8) {
        this.selectedPointStorage.plan.x = this.mesAxisYSelected;
      } else if (this.shape == 6){
        this.selectedPointStorage.plan.y = this.mesAxisYSelected;
      } else {
        this.selectedPointStorage.plan.y = this.mesAxisYSelected;
      }
    }
  }

  changeZ() {
    // console.log(this.recordType);
    // console.log(this.radioChecked);
    if (this.recordType === 'points') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.top.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.point.top.z = this.mesAxisZSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.int.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.point.int.z = this.mesAxisZSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.point.bot.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
        } else if (this.shape == 6){
          this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.point.bot.z = this.mesAxisZSelected;
        }
      }
    }
    if (this.recordType === 'axis') {
      if (this.radioChecked === 0) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe1.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.axis.axe1.z = this.mesAxisZSelected;
        }
      } else if (this.radioChecked === 1) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe2.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.axis.axe2.z = this.mesAxisZSelected;
        }
      } else if (this.radioChecked == 2) {
        if (this.shape == 1) {
          this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
        } else if (this.shape == 2 || this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.x = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.selectedPointStorage.axis.axe3.y = this.mesAxisZSelected;
          } else {
            this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
          }
        } else if (this.shape == 4 || this.shape == 5) {
          this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
        } else if (this.shape == 7 || this.shape == 8) {
          this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
        } else if (this.shape == 6) {
          this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.axis.axe3.z = this.mesAxisZSelected;
        }
      }
    }
    if (this.recordType === 'plans') {
      if (this.shape == 1) {
        this.selectedPointStorage.plan.z = this.mesAxisZSelected;
      } else if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.x = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.plan.z = this.mesAxisZSelected;
        }
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.selectedPointStorage.plan.y = this.mesAxisZSelected;
        } else {
          this.selectedPointStorage.plan.z = this.mesAxisZSelected;
        }
      } else if (this.shape == 4 || this.shape == 5) {
        this.selectedPointStorage.plan.z = this.mesAxisZSelected;
      } else if (this.shape == 7 || this.shape == 8) {
        this.selectedPointStorage.plan.z = this.mesAxisZSelected;
      } else if (this.shape == 6) {
        this.selectedPointStorage.plan.z = this.mesAxisZSelected;
      } else {
        this.selectedPointStorage.plan.z = this.mesAxisZSelected;
      }
    }
    // console.log(this.mesAxisZSelected);
  }

  saveAll() {
    // console.log(this.mesAxisXData);
    // console.log(this.mesAxisYData);
    // console.log(this.mesAxisZData);
    // console.log(this.selectedPointStorage);
    if (!this.nbSteps) {
      this.toastr.error(this.translate.instant('Enter a value in Number of samples !'), 'Error');
      return;
    } else if (!Number.isInteger(Number(this.nbSteps)) || this.nbSteps < 0) {
      this.toastr.error(this.translate.instant('Not a valid number in Number of samples !'), 'Error');
      return;
    }

    if (this.shape == 1) {
      this.POINT_TOP_X = this.selectedPointStorage.point.top.x;
      this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
      this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
      this.POINT_INT_X = this.selectedPointStorage.point.int.x;
      this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
      this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
      this.POINT_BOT_X = this.selectedPointStorage.point.bot.x;
      this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
      this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
      this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.x;
      this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
      this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
      this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.x;
      this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
      this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
      this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.x;
      this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
      this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
      this.PLAN_X = this.selectedPointStorage.plan.x;
      this.PLAN_Y = this.selectedPointStorage.plan.y;
      this.PLAN_Z = this.selectedPointStorage.plan.z;
    } else if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.POINT_TOP_X = this.selectedPointStorage.point.top.z;
        this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
        this.POINT_TOP_Z = this.selectedPointStorage.point.top.x;
        this.POINT_INT_X = this.selectedPointStorage.point.int.z;
        this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
        this.POINT_INT_Z = this.selectedPointStorage.point.int.x;
        this.POINT_BOT_X = this.selectedPointStorage.point.bot.z;
        this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
        this.POINT_BOT_Z = this.selectedPointStorage.point.bot.x;
        this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.z;
        this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
        this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.x;
        this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.z;
        this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
        this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.x;
        this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.z;
        this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
        this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.x;
        this.PLAN_X = this.selectedPointStorage.plan.z;
        this.PLAN_Y = this.selectedPointStorage.plan.y;
        this.PLAN_Z = this.selectedPointStorage.plan.x;
      } else {
        this.POINT_TOP_X = this.selectedPointStorage.point.top.x;
        this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
        this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
        this.POINT_INT_X = this.selectedPointStorage.point.int.x;
        this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
        this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
        this.POINT_BOT_X = this.selectedPointStorage.point.bot.x;
        this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
        this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
        this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.x;
        this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
        this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
        this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.x;
        this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
        this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
        this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.x;
        this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
        this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
        this.PLAN_X = this.selectedPointStorage.plan.x;
        this.PLAN_Y = this.selectedPointStorage.plan.y;
        this.PLAN_Z = this.selectedPointStorage.plan.z;
      }
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.POINT_TOP_X = this.selectedPointStorage.point.top.z;
        this.POINT_TOP_Y = this.selectedPointStorage.point.top.x;
        this.POINT_TOP_Z = this.selectedPointStorage.point.top.y;
        this.POINT_INT_X = this.selectedPointStorage.point.int.z;
        this.POINT_INT_Y = this.selectedPointStorage.point.int.x;
        this.POINT_INT_Z = this.selectedPointStorage.point.int.y;
        this.POINT_BOT_X = this.selectedPointStorage.point.bot.z;
        this.POINT_BOT_Y = this.selectedPointStorage.point.bot.x;
        this.POINT_BOT_Z = this.selectedPointStorage.point.bot.y;
        this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.z;
        this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.x;
        this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.y;
        this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.z;
        this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.x;
        this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.y;
        this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.z;
        this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.x;
        this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.y;
        this.PLAN_X = this.selectedPointStorage.plan.z;
        this.PLAN_Y = this.selectedPointStorage.plan.x;
        this.PLAN_Z = this.selectedPointStorage.plan.y;
      } else {
        this.POINT_TOP_X = this.selectedPointStorage.point.top.y;
        this.POINT_TOP_Y = this.selectedPointStorage.point.top.x;
        this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
        this.POINT_INT_X = this.selectedPointStorage.point.int.y;
        this.POINT_INT_Y = this.selectedPointStorage.point.int.x;
        this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
        this.POINT_BOT_X = this.selectedPointStorage.point.bot.y;
        this.POINT_BOT_Y = this.selectedPointStorage.point.bot.x;
        this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
        this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.y;
        this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.x;
        this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
        this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.y;
        this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.x;
        this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
        this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.y;
        this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.x;
        this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
        this.PLAN_X = this.selectedPointStorage.axis.axe3.y;
        this.PLAN_Y = this.selectedPointStorage.plan.x;
        this.PLAN_Z = this.selectedPointStorage.plan.z;
      }
    } else if (this.shape == 4 || this.shape == 5) {
      this.POINT_TOP_X = this.selectedPointStorage.point.top.x;
      this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
      this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
      this.POINT_INT_X = this.selectedPointStorage.point.int.x;
      this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
      this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
      this.POINT_BOT_X = this.selectedPointStorage.point.bot.x;
      this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
      this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
      this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.x;
      this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
      this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
      this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.x;
      this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
      this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
      this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.x;
      this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
      this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
      this.PLAN_X = this.selectedPointStorage.plan.x;
      this.PLAN_Y = this.selectedPointStorage.plan.y;
      this.PLAN_Z = this.selectedPointStorage.plan.z;
    } else if (this.shape == 7 || this.shape == 8) {
      this.POINT_TOP_X = this.selectedPointStorage.point.top.y;
      this.POINT_TOP_Y = this.selectedPointStorage.point.top.x;
      this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
      this.POINT_INT_X = this.selectedPointStorage.point.int.y;
      this.POINT_INT_Y = this.selectedPointStorage.point.int.x;
      this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
      this.POINT_BOT_X = this.selectedPointStorage.point.bot.y;
      this.POINT_BOT_Y = this.selectedPointStorage.point.bot.x;
      this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
      this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.y;
      this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.x;
      this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
      this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.y;
      this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.x;
      this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
      this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.y;
      this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.x;
      this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
      this.PLAN_X = this.selectedPointStorage.axis.axe3.y;
      this.PLAN_Y = this.selectedPointStorage.plan.x;
      this.PLAN_Z = this.selectedPointStorage.plan.z;
    } else if (this.shape == 6) {
      this.POINT_TOP_X = this.selectedPointStorage.point.top.x;
      this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
      this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
      this.POINT_INT_X = this.selectedPointStorage.point.int.x;
      this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
      this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
      this.POINT_BOT_X = this.selectedPointStorage.point.bot.x;
      this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
      this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
      this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.x;
      this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
      this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
      this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.x;
      this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
      this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
      this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.x;
      this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
      this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
      this.PLAN_X = this.selectedPointStorage.plan.x;
      this.PLAN_Y = this.selectedPointStorage.plan.y;
      this.PLAN_Z = this.selectedPointStorage.plan.z;
    } else {
      this.POINT_TOP_X = this.selectedPointStorage.point.top.x;
      this.POINT_TOP_Y = this.selectedPointStorage.point.top.y;
      this.POINT_TOP_Z = this.selectedPointStorage.point.top.z;
      this.POINT_INT_X = this.selectedPointStorage.point.int.x;
      this.POINT_INT_Y = this.selectedPointStorage.point.int.y;
      this.POINT_INT_Z = this.selectedPointStorage.point.int.z;
      this.POINT_BOT_X = this.selectedPointStorage.point.bot.x;
      this.POINT_BOT_Y = this.selectedPointStorage.point.bot.y;
      this.POINT_BOT_Z = this.selectedPointStorage.point.bot.z;
      this.AXIS_AXE1_X = this.selectedPointStorage.axis.axe1.x;
      this.AXIS_AXE1_Y = this.selectedPointStorage.axis.axe1.y;
      this.AXIS_AXE1_Z = this.selectedPointStorage.axis.axe1.z;
      this.AXIS_AXE2_X = this.selectedPointStorage.axis.axe2.x;
      this.AXIS_AXE2_Y = this.selectedPointStorage.axis.axe2.y;
      this.AXIS_AXE2_Z = this.selectedPointStorage.axis.axe2.z;
      this.AXIS_AXE3_X = this.selectedPointStorage.axis.axe3.x;
      this.AXIS_AXE3_Y = this.selectedPointStorage.axis.axe3.y;
      this.AXIS_AXE3_Z = this.selectedPointStorage.axis.axe3.z;
      this.PLAN_X = this.selectedPointStorage.plan.x;
      this.PLAN_Y = this.selectedPointStorage.plan.y;
      this.PLAN_Z = this.selectedPointStorage.plan.z;
    }
    const params: Models.LocationAxisParams = {
      ID_STUDY_EQUIPMENTS: this.outputProductChart.ID_STUDY_EQUIPMENTS,
      NB_STEPS: this.nbSteps,
      POINT_TOP_X: this.POINT_TOP_X,
      POINT_TOP_Y: this.POINT_TOP_Y,
      POINT_TOP_Z: this.POINT_TOP_Z,
      POINT_INT_X: this.POINT_INT_X,
      POINT_INT_Y: this.POINT_INT_Y,
      POINT_INT_Z: this.POINT_INT_Z,
      POINT_BOT_X: this.POINT_BOT_X,
      POINT_BOT_Y: this.POINT_BOT_Y,
      POINT_BOT_Z: this.POINT_BOT_Z,
      AXIS_AXE1_X: this.AXIS_AXE1_X,
      AXIS_AXE1_Y: this.AXIS_AXE1_Y,
      AXIS_AXE1_Z: this.AXIS_AXE1_Z,
      AXIS_AXE2_X: this.AXIS_AXE2_X,
      AXIS_AXE2_Y: this.AXIS_AXE2_Y,
      AXIS_AXE2_Z: this.AXIS_AXE2_Z,
      AXIS_AXE3_X: this.AXIS_AXE3_X,
      AXIS_AXE3_Y: this.AXIS_AXE3_Y,
      AXIS_AXE3_Z: this.AXIS_AXE3_Z,
      PLAN_X: this.PLAN_X,
      PLAN_Y: this.PLAN_Y,
      PLAN_Z: this.PLAN_Z,
    };
    // console.log(this.mesAxisXData);
    // console.log(this.mesAxisYData);
    // console.log(this.mesAxisZData);
    // console.log(params);
    this.api.saveLocationAxis({
      id: this.study.ID_STUDY,
      body: params
    }).subscribe(
      response => {
        this.toastr.success(this.translate.instant('Update success'), 'successfully');
       }
    );
  }

  getValueSelected(type, value) {
    if (type == 'x') {
      if (value > 0 && this.mesAxisXData.length > 0) {
        for (let i = 0; i < this.mesAxisXData.length; i++) {
          if (this.mesAxisXData[i].name == value) {
            return this.mesAxisXData[i].value;
          }
        }
      } else {
        return value;
      }
    } else if (type == 'y') {
      if (value > 0 && this.mesAxisYData.length > 0) {
        for (let i = 0; i < this.mesAxisYData.length; i++) {
          if (this.mesAxisYData[i].name == value) {
            return this.mesAxisYData[i].value;
          }
        }
      } else {
        return value;
      }
    } else if (type == 'z') {
      if (value > 0 && this.mesAxisZData.length > 0) {
        for (let i = 0; i < this.mesAxisZData.length; i++) {
          if (this.mesAxisZData[i].name == value) {
            return this.mesAxisZData[i].value;
          }
        }
      } else {
        return value;
      }
    }
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
    this.loadLocationData = false;
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
    this.loadHeatExchangeData = false;
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        // console.log(data);
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
            this.imageHeatExchange = dataChart.imageHeatExchange;
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
                          labelString: this.translate.instant(this.symbol.timeSymbol),
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
                          labelString: this.translate.instant(this.symbol.enthalpySymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
            this.loadHeatExchangeData = true;
          }
        );
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
    this.loadProductSectionData = false;
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        // console.log(data);
        this.imageProductSection = data.imageProductSection;
        this.productSectionDataChart = data.dataChart;
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionValueLength = Object.keys(this.productSectionValue[0]).length + 3;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
        this.loadProductSectionData = true;
      }
    );
  }

  loadTimeBased() {
    // console.log(this.selectedPoints);
    this.activePage = 'timeBased';
    this.stopAnimationContour();
    this.displayLocationPage = false;
    this.displayHeatExchangePage = false;
    this.displayProductSectionPage = false;
    this.displayTimeBasePage = true;
    this.display2dOutlinePage = false;
    this.loadTimeBaseData = false;
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        // console.log(data);
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
            // console.log(dataTimeBased);
            this.imageTimeBased = dataTimeBased.imageTimebased;
            this.timeBasedResult = dataTimeBased.result;
            this.timeBasedCurve = dataTimeBased.curve;
            this.timeBasedLabel = dataTimeBased.label;
            const chartDataObj =  this.timeBasedCurve;
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
    this.displayContourChart = false;
    const params: ApiService.Productchart2DParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedPlan: this.selectedPlan,
      dimension: this.translate.instant('Dimension')
    };
    this.loadProductChartData = false;
    this.displayContourChart = false;
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
    data => {
      // console.log(data);
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
          // console.log(dataPr);
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
    // console.log(this.selectedAxe);

    this.loadProductSectionData = false;
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        // console.log(data);
        this.imageProductSection = data.imageProductSection;
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionValueLength = Object.keys(this.productSectionValue[0]).length + 3;
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
        this.loadProductSectionData = true;
      }
    );
  }

  saveNbStep() {
    if (!this.NB_STEPS) {
      this.toastr.error(this.translate.instant('Enter a value in Curve Number !'), 'Error');
      return;
    } else if (!Number.isInteger(Number(this.NB_STEPS)) || this.NB_STEPS < 0) {
      this.toastr.error(this.translate.instant('Not a valid number in Curve Number !'), 'Error');
      return;
    }
    this.loadProductSectionData = false;
    // console.log(this.NB_STEPS);
    const params = {
      ID_STUDY: this.study.ID_STUDY,
      ID_STUDY_EQUIPMENTS: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      AXE: this.selectedAxe,
      NB_STEPS: this.NB_STEPS
    };
    this.api.saveTempRecordPts(params).subscribe(
      data => {
        // console.log(data);
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionValueLength = Object.keys(this.productSectionValue[0]).length + 3;
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
        this.loadProductSectionData = true;
      },
      (err) => {
        swal('Error', err.error.message, 'error');
        // console.log(err);
        this.loadProductSectionData = true;
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
    // console.log(this.dataArrColor);
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
                labelString: this.translate.instant(this.symbol.temperatureSymbol),
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
                labelString: this.translate.instant(this.symbol.prodchartDimensionSymbol),
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

  refreshStatic() {
    const temperatureStepId = <HTMLElement>document.getElementById('temperatureStep');
    const temperatureMinId = <HTMLElement>document.getElementById('temperatureMin');
    const temperatureMaxId = <HTMLElement>document.getElementById('temperatureMax');
    // console.log(Number.isInteger(this.temperatureStep));
    if (this.shape < 10) {
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
        this.translate.instant('Value out of range in Temperature step' + ' (' + this.minTempStep + ' : '
         + this.maxTempStep + ') !'), 'error');
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
        this.translate.instant('Value out of range in Temperature Min' + ' (' + this.minTemperature + ' : ' + this.maxTemperature + ') !'),
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
    }

    this.loadProductChart = false;
    const params: Models.productChart2DStatic = {
      refreshTemp: 0,
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
    // console.log(params);
    this.api.productChart2DStatic(params).subscribe(
      dataPr => {
        // console.log(dataPr);
        this.temperatureMin = dataPr.chartTempInterval[0];
        this.temperatureMax = dataPr.chartTempInterval[1];
        this.temperatureStep = dataPr.chartTempInterval[2];
        this.contourImage.src = dataPr.imageContour[0];
        this.loadProductChart = true;
        this.displayContourChart = true;
      }
    );
  }

  refreshStaticTemp() {
    const temperatureStepId = <HTMLElement>document.getElementById('temperatureStep');
    const temperatureMinId = <HTMLElement>document.getElementById('temperatureMin');
    const temperatureMaxId = <HTMLElement>document.getElementById('temperatureMax');
    // console.log(Number.isInteger(this.temperatureStep));
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
    const params: Models.productChart2DStatic = {
      refreshTemp: 1,
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
    // console.log(params);
    this.api.productChart2DStatic(params).subscribe(
      dataPr => {
        // console.log(dataPr);
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
    // console.log(Number.isInteger(this.temperatureStep));
    if (this.shape < 10) {
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
    }

    this.displayContourChart = true;
    this.loadProductChart = false;
    for (let i = 0; i < Object.keys(this.timeRecords).length; i++) {
      if (this.timeSelected == this.timeRecords[i]['RECORD_TIME']) {
        if (type == 0) {
          // console.log(this.timeSelected);
          if (i > 0) {
            this.timeSelected = this.timeRecords[i - 1]['RECORD_TIME'];
          } else {
            this.loadProductChart = true;
            return;
          }
        } else if (type == 1) {
          // console.log(this.timeSelected);
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
    const params: Models.productChart2DStatic = {
      refreshTemp: 0,
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
        // console.log(dataPr);
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
    const params: Models.productChart2DStatic = {
      refreshTemp: 0,
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
        // console.log(data);
        this.temperatureMin = data.chartTempInterval[0];
        this.temperatureMax = data.chartTempInterval[1];
        this.temperatureStep = data.chartTempInterval[2];
        this.contourImages = [];
        for (let i = 0; i < data.imageContour.length; i++) {
          const contourImage: HTMLImageElement = new Image();
          contourImage.src = data.imageContour[i];
          this.contourImages.push(contourImage);
        }
        // console.log(this.contourImages);
        this.displayContourChart = false;
        this.loadProductChart = true;
        this.displayAnimationContour = setInterval(() => {
          this.displayNextImage();
        }, this.selectedSpeed * 1000);
      }
    );
  }

  changeSelectedPlan() {
    if (this.shape > 9) {
      this.display2dOutlinePage = true;
      this.displayContourChart = false;
      const params: ApiService.Productchart2DParams = {
        idStudy: this.study.ID_STUDY,
        idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
        selectedPlan: this.selectedPlan,
        dimension: this.translate.instant('Dimension')
      };
      this.loadProductChartData = false;
      this.displayContourChart = false;
      this.api.productchart2D(params).subscribe(
        dataPr => {
          // console.log(dataPr);
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
    }
  }

  getValueContour() {
    this.laddaViewContourValue = true;
    const param: Models.dataContourParam = {
      selectedPlan: this.selectedPlan,
      timeSelected: this.timeSelected
    };
    this.api.readDataContour({
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      body: param
    }).subscribe(
      data => {
        this.contourValue = JSON.parse(data.valueContour);
        // console.log(this.contourValue);
        this.valuesModal.show();
        this.laddaViewContourValue = false;
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
    // console.log(this.percent);
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

  isNumber(n) {
    return typeof n == 'number' && !isNaN(n - n);
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
}
