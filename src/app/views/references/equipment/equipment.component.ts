import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OnChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { isNumber, isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ReferencedataService } from '../../../api/services/referencedata.service';
import { RefEquipment, ViewEquipment, NewEquipment, EquipmentFamily, EquipCharact } from '../../../api/models';
import { Equipment, EquipGeneration, EquipmentSeries, Ramps, Shelves, Consumptions, FilterEquipment } from '../../../api/models';
import { SaveAsEquipment, ViewHighChart, ViewCurve, EquipGenZone, ViewTempSetPoint, Study, SVGChart } from '../../../api/models';

import * as Highcharts from 'highcharts';
import * as HC_draggablePoints from 'highcharts-draggable-points';
HC_draggablePoints(Highcharts);

import { HighchartsChartComponent } from '../../../components/highcharts-chart/highcharts-chart.component';

@Pipe({ name: 'equipFilter' })
export class EquipmentFilterPipe implements PipeTransform {
  public transform(values: RefEquipment[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter(
      v => v.EQUIP_NAME.toLowerCase().indexOf(
        filter.toLowerCase()) >= 0);
  }
}
@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTempSetpoint') public modalTempSetpoint: ModalDirective;
  @ViewChild('modalReferentialEquip') public modalReferentialEquip: ModalDirective;
  @ViewChild('modalEquipmentProfil') public modalEquipmentProfil: ModalDirective;
  @ViewChild('modalAddEquipment') public modalAddEquipment: ModalDirective;
  @ViewChild('modalSaveAsEquipment') public modalSaveAsEquipment: ModalDirective;
  @ViewChild('tempProfileChart') public tempProfileChart: HighchartsChartComponent;
  @ViewChild('curvesChart') public curvesChart: HighchartsChartComponent;
  @ViewChild('modalFilter') public modalFilter: ModalDirective;

  public valTop = 1;
  public valBottom = 1;
  public valLeft = 1;
  public valRight = 1;
  public valFront = 1;
  public valRear = 1;
  public filterEquipment: FilterEquipment;
  public zoneNumber = 1;
  public checkHideInfo = false;
  public checkActiveEquip = 0;
  public disableFilter = false;
  // end HAIDTname, id, studyname
  public activePageEquipment = '';
  public listEquipment: ViewEquipment;
  public listEquipGenerateAll: Array<RefEquipment>;
  public listEquipGenerate: Array<RefEquipment>;
  public listEquipRotate: Array<RefEquipment>;
  public listEquipMeger1: Array<RefEquipment>;
  public listEquipMeger2: Array<RefEquipment>;
  public selectEquipGener: RefEquipment;
  public selectEquipRotate: RefEquipment;
  public selectEquipTranslate: RefEquipment;
  public selectEquipmentMerge1: RefEquipment;
  public selectEquipmentMerge2: RefEquipment;
  public statusEquip = 0;
  public equipGenerate = 0;
  public equipRotate = 0;
  public equipTranslation = 0;
  public equipMerge1 = 0;
  public equipMerge2 = 0;
  public newEquipment: NewEquipment;
  public saveAsEquipment: SaveAsEquipment;
  public filterString = '';
  public selectEquipment: RefEquipment;
  public listEquipFamily: EquipmentFamily;
  public equipGenerationDefault: EquipGeneration;
  public listequipSeries: EquipmentSeries;
  public isLoading = false;
  public laddaIsCalculating = false;
  public rampsArray: Array<Ramps>;
  public newRamp: any = {};
  public shelvesArray: Array<Shelves>;
  public newShelve: any = {};
  public consumptionsArray: Array<Consumptions>;
  public newConsumption: any = {};
  public laddaIsEquipmentCalculating = false;
  public equipCharacts: Array<EquipCharact>;
  public xConvection = [];
  public yConvection = [];
  public xTemperature = [];
  public yTemperature = [];
  public isSelectChart = 0;
  public dataHighChart: ViewHighChart;
  public equipCharact: EquipCharact;
  public Curvescharts = Highcharts;
  public chartTempCurvesOptions = {
    chart: {
      renderTo: 'container',
    },
    title: {
      text: 'Highcharts line curves'
    },
    rangeSelector: {
      selected: 6
    },
    tooltip: {
      yDecimals: 2
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    xAxis: {
      title: {
        text: '(%)'
      },
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    series: [{
      data: [1, 2, 3, 4, 5, 6, 7, 7, 9],
      name: 'Top'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Bottom'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Left'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Right'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Front'
    },
    {
      data: [9, 10, 11, 12, 5, 14, 15, 7, 17],
      name: 'Rear'
    }]
  };
  public chartConvecCurvesOptions = {
    chart: {
      renderTo: 'container',
    },
    title: {
      text: 'Highcharts line curves'
    },
    rangeSelector: {
      selected: 6
    },
    tooltip: {
      yDecimals: 2
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    xAxis: {
      title: {
        text: '(%)'
      },
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    yAxis: {
      title: {
        text: '(Kw/(m².°C)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    series: [{
      data: [1, 2, 3, 4, 5, 6, 7, 7, 9],
      name: 'Top'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Bottom'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Left'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Right'
    },
    {
      data: [5, 6, 7, 8, 8, 10, 11, 3, 13],
      name: 'Front'
    },
    {
      data: [9, 10, 11, 12, 5, 14, 15, 7, 17],
      name: 'Rear'
    }]
  };
  public Highcharts = Highcharts;
  public chartOptions = {
    chart: {
      renderTo: 'container',
      animation: false,
      zoomType: 'x',
    },
    title: {
      text: 'Highcharts draggable points Convection'
    },
    tooltip: {
      // enabled: false
      yDecimals: 2
    },
    xAxis: {
      title: {
        text: '(%)'
      },
      categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    yAxis: {
      title: {
        text: '(Kw/(m².°C)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    column: {
      stacking: 'normal'
    },
    line: {
      cursor: 'ns-resize'
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        cursor: 'pointer',
        allowPointSelect: true,
        point: {
          events: {
            // click: function (Event) {
            //   alert('Name: ' + this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
            // },
            drag: function (e) {
              alert('Name: ' + this.category + ', Value: ' + Highcharts.numberFormat(this.y, 2) + ', Series :' + this.series.name);
            }
          }
        }
      }
    },
    series: [{
      data: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 4, 3, 4, 6, 6, 7, 4, 5],
      draggableY: true,
      dragMinY: 0
    }]
  };
  public dataCurve: ViewCurve;
  public laddaCurve = false;
  public newEquipCharact: EquipCharact;
  public checkData = false;
  public tempSetPoint: ViewTempSetPoint;
  public study: Study;
  public selectedPoint = null;
  public currentpos = -1;
  public profileType = 0;
  public svgchart: {
    idEquip?: number,
    profilType?: number,
    profilFace?: number
  };
  public isLoadingChart = false;
  public disabledConfirm = 0;

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService, private router: Router) {
    this.activePageEquipment = 'load';
    this.newEquipment = new NewEquipment();
    this.saveAsEquipment = new SaveAsEquipment();
    this.equipGenerationDefault = new EquipGeneration();
    this.newEquipCharact = new EquipCharact();

    localStorage.setItem('equipCurr', ''); // add by haidt

  }

  ngOnInit() {
    this.getListEquipmentFamily();
    this.study = JSON.parse(localStorage.getItem('study'));
    this.isLoading = true;
  }

  ngAfterViewInit() {
    this.refrestListEquipment();
  }

  refrestListEquipment() {
    this.isLoading = true;
    this.referencedata.findRefEquipment()
      .subscribe(
      data => {
        this.listEquipment = data;
        this.listEquipGenerateAll = (data.mine).concat(data.others);
        this.listEquipGenerate = [];
        for (let i = 0; i < this.listEquipGenerateAll.length; i++) {
          if (this.listEquipGenerateAll[i].equipGeneration === null) {
            this.listEquipGenerateAll[i].equipGeneration = this.equipGenerationDefault;
          }

          if ( Number(this.listEquipGenerateAll[i].STD) === 1 && Number(this.listEquipGenerateAll[i].EQUIP_RELEASE) !== 5) {
            this.listEquipGenerate.push(this.listEquipGenerateAll[i]);
          }
        }
        this.isLoading = false;
      },
      err => {
        console.log(err);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        if (localStorage.getItem('equipCurr') !== '') {
          const equipCurr = JSON.parse(localStorage.getItem('equipCurr'));
          this.checkActiveEquip = Number(equipCurr.ID_EQUIP);
          this.selectEquipment = equipCurr;
          console.log(this.selectEquipment);
        }
      }
    );
  }

  selectEquipGenerate() {
    for (const equip of this.listEquipGenerate) {
      if (Number(equip.ID_EQUIP) === Number(this.equipGenerate)) {
        this.selectEquipGener = equip;
        console.log(this.selectEquipGener);
        break;
      }
    }
  }

  selectEquipTranslation() {
    if (Number(this.equipTranslation) === 0) {
      this.selectEquipTranslate.equipGeneration.NEW_POS = 0;
      this.selectEquipTranslate.equipGeneration.DWELLING_TIME = 0;
    }
    for (const equip of this.listEquipRotate) {
      if (Number(equip.ID_EQUIP) === Number(this.equipTranslation)) {
        this.selectEquipTranslate = equip;
        break;
      }
    }
  }

  selectEquipMerge1() {
    for (const equip of this.listEquipMeger1) {
      if (Number(equip.ID_EQUIP) === Number(this.equipMerge1)) {
        this.selectEquipmentMerge1 = equip;
        break;
      }
    }
    if (Number(this.equipMerge1) === 0) {
      this.equipMerge2 = 0;
    }
  }

  selectEquipMerge2() {
    for (const equip of this.listEquipMeger1) {
      if (Number(equip.ID_EQUIP) === Number(this.equipMerge2)) {
        this.selectEquipmentMerge2 = equip;
        break;
      }
    }
  }

  chooseGenerate() {
    this.statusEquip = 0;
    this.selectEquipGener = new RefEquipment();
    this.equipGenerate = 0;
  }

  chooseTranslate() {
    this.statusEquip = 1;
    this.getEquipmentRotateTranslation();
    this.selectEquipTranslate = new RefEquipment();
    this.selectEquipTranslate.equipGeneration = new EquipGeneration();
    this.equipTranslation = 0;
  }

  chooseRotate() {
    this.statusEquip = 2;
    this.getEquipmentRotateTranslation();
    this.equipRotate = 0;
  }

  chooseMerge() {
    this.statusEquip = 3;
    this.getEquipmentMerge();
    this.equipMerge1 = 0;
    this.equipMerge2 = 0;
  }

  getEquipmentRotateTranslation() {
    this.listEquipRotate = [];
    for (let i = 0; i < this.listEquipGenerateAll.length; i++) {
      if (this.listEquipGenerateAll[i].equipGeneration === null) {
        this.listEquipGenerateAll[i].equipGeneration = this.equipGenerationDefault;
      }
      if ( Number(this.listEquipGenerateAll[i].STD) !== 1 && Number(this.listEquipGenerateAll[i].EQUIP_RELEASE) !== 5) {
        this.listEquipRotate.push(this.listEquipGenerateAll[i]);
      }
    }
  }

  getEquipmentMerge() {
    this.listEquipMeger1 = [];
    this.listEquipMeger2 = [];
    for (let i = 0; i < this.listEquipGenerateAll.length; i++) {
      if (this.listEquipGenerateAll[i].equipGeneration === null) {
        this.listEquipGenerateAll[i].equipGeneration = this.equipGenerationDefault;
      }
      if (Number(this.listEquipGenerateAll[i].EQUIP_RELEASE) !== 5) {
        this.listEquipMeger1.push(this.listEquipGenerateAll[i]);
        this.listEquipMeger2.push(this.listEquipGenerateAll[i]);
      }
    }
  }

  saveNewEquipment(typeCalculate = 0) {
    if (!this.newEquipment.nameEquipment || this.newEquipment.nameEquipment === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (isNumber(this.newEquipment.nameEquipment)) {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!this.newEquipment.versionEquipment) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.newEquipment.versionEquipment)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    if (Number(this.statusEquip) === 0) {
      if (Number(this.equipGenerate) === 0) {
        swal('Oops..', 'Please choose equipment!', 'warning');
        return;
      }
      if (!this.selectEquipGener.capabilitiesCalc) {
        if (!this.newEquipment.tempSetPoint || String(this.newEquipment.tempSetPoint) === '') {
          swal('Oops..', 'Please specify regulation temperature!', 'warning');
          return;
        }
      }
      if (!this.selectEquipGener.capabilitiesCalc) {
        if (this.newEquipment.dwellingTime || String(this.newEquipment.dwellingTime) === '') {
          swal('Oops..', 'Please specify dwelling time!', 'warning');
          return;
        }
      }
    }
    this.newEquipment.typeEquipment = this.statusEquip;
    this.newEquipment.typeCalculate = typeCalculate;

    if (Number(this.statusEquip) === 0) {
      this.newEquipment.equipmentId1 = this.selectEquipGener.ID_EQUIP;
      if (!this.selectEquipGener.capabilitiesCalc) {
        this.newEquipment.dwellingTime = 0;
      } else {
        this.newEquipment.tempSetPoint = 0;
      }
    } else if (Number(this.statusEquip) === 1) {
      this.newEquipment.equipmentId1 = this.equipTranslation;
    } else if (Number(this.statusEquip) === 2) {
      this.newEquipment.equipmentId1 = this.equipRotate;
    } else if (Number(this.statusEquip) === 3) {
      this.newEquipment.equipmentId1 = this.equipMerge1;
      this.newEquipment.equipmentId2 = this.equipMerge2;
    }

    if (this.filterEquipment) {
      this.newEquipment.equipGenZone = this.filterEquipment.EquipGenZone;
    } else {
      this.newEquipment.equipGenZone = null;
    }
    this.laddaIsCalculating = true;

    this.referencedata.newEquipment(this.newEquipment).subscribe(
      response => {
        console.log(response);
        let success = true;

        if (response === -1) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Please, Enter a value in Equipments !');
          return;
        } else if (response === -3) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Please, Enter a value in Version !');
          return;
        } else if (response === -2) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Select an equipment.!');
          return;
        } else if (response === -4) {
          this.laddaIsCalculating = false;
          success = false;
          this.toastr.error('Create equipment', 'Name and version already in use!');
          return;
        } else if (response === -5) {
          this.laddaIsCalculating = false;
          success = false;
          this.toastr.error('Calculate equipment', 'Run calculate error');
          return;
        } else if (success) {
          localStorage.setItem('equipCurr', JSON.stringify(response));
          this.checkHideInfo = false;
          this.selectEquipment = new RefEquipment();
          this.laddaIsCalculating = false;
          this.toastr.success('Create equipment', 'successfully');
          this.modalAddEquipment.hide();
          this.refrestListEquipment();
          this.newEquipment = new NewEquipment();
          this.equipGenerate = 0;
          this.equipRotate = 0;
          this.equipTranslation = 0;
          this.equipMerge1 = 0;
          this.equipMerge2 = 0;
        } else {
          this.toastr.error('Create equipment', 'ERROR');
        }
      },
      err => {
        console.log(err);
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
    );
  }

  newSaveAsEquipment(equipment) {
    if (!this.saveAsEquipment.nameEquipment || this.saveAsEquipment.nameEquipment === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (isNumber(this.saveAsEquipment.nameEquipment)) {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!this.saveAsEquipment.versionEquipment) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.saveAsEquipment.versionEquipment)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    this.referencedata.saveAsEquipment({
      versionEquipment: this.saveAsEquipment.versionEquipment,
      nameEquipment: this.saveAsEquipment.nameEquipment,
      equipmentId: equipment.ID_EQUIP
    }).subscribe(
      response => {
        console.log(response);
        let success = true;

        if (response === 1) {
          success = true;
        }

        if (response === -4) {
          success = false;
          this.toastr.error('Save as equipment', 'Name and version already in use!');
          return;
        }

        if (success) {
          this.laddaIsCalculating = false;
          this.toastr.success('Save as equipment', 'successfully');
          this.modalSaveAsEquipment.hide();
          this.refrestListEquipment();
          this.saveAsEquipment = new SaveAsEquipment();
        } else {
          this.toastr.error('Save as equipment', 'ERROR');
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  updateEquipment(selectEquipment) {
    this.referencedata.saveEquipment({
      ID_EQUIP: selectEquipment.ID_EQUIP,
      EQUIP_NAME: selectEquipment.EQUIP_NAME,
      EQUIP_VERSION: selectEquipment.EQUIP_VERSION,
      EQUIP_COMMENT: selectEquipment.EQUIP_COMMENT,
      EQUIP_RELEASE: selectEquipment.EQUIP_RELEASE,
      EQP_LENGTH: selectEquipment.EQP_LENGTH,
      EQP_HEIGHT: selectEquipment.EQP_HEIGHT,
      EQP_WIDTH: selectEquipment.EQP_WIDTH,
      NB_TR: selectEquipment.NB_TR,
      NB_TS: selectEquipment.NB_TS,
      NB_VC: selectEquipment.NB_VC,
      MAX_FLOW_RATE: selectEquipment.MAX_FLOW_RATE,
      TMP_REGUL_MIN: selectEquipment.TMP_REGUL_MIN,
      MAX_NOZZLES_BY_RAMP: selectEquipment.MAX_NOZZLES_BY_RAMP,
      MAX_RAMPS: selectEquipment.MAX_RAMPS,
      Ramps: this.rampsArray,
      Shelves: this.shelvesArray,
      Consumptions: this.consumptionsArray,
    }).subscribe(
      response => {
        let success = true;

        if (response === 1) {
          success = true;
        }

        if (success) {
          this.toastr.success('Update equipment', 'successfully');
        } else {
          this.toastr.error('Update equipment', 'ERROR');
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  deleteEquipment(equip) {
    swal({
      title: 'Are you sure?',
      text: 'You won`t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.referencedata.deleteEquipment(equip.ID_EQUIP).subscribe(
          response => {
            if (response === 1) {
              this.refrestListEquipment();
              this.toastr.success('Delete equipment', 'successfully');
              this.selectEquipment = new RefEquipment();
              this.checkHideInfo = true;
            } else {
              swal('Oops..', 'Delete equipment', 'error');
            }
          },
          err => {
            console.log(err);
          },
          () => {

          }
        );
      }
    });
  }

  startEquipmentCalculate(selectEquipment) {
    this.laddaIsEquipmentCalculating = true;
    this.referencedata.startEquipmentCalculate(selectEquipment.ID_EQUIP).subscribe(
      response => {
        this.laddaIsEquipmentCalculating = false;
        let success = true;

        if (response !== 0) {
          success = false;
        }

        if (success) {
          this.getEquipCharacts(selectEquipment.ID_EQUIP);
          this.toastr.success('Run equipment calculate', 'successfully');
        } else {
          this.toastr.error('Run equipment calculate', 'ERROR');
        }
      },
      err => {
        this.laddaIsEquipmentCalculating = false;
      },
      () => {
        this.laddaIsEquipmentCalculating = false;
      }
    );
  }

  getEquipCharacts(idEquip) {
    this.isLoading = true;
    this.referencedata.getEquipmentCharacts(idEquip).subscribe(
      data => {
        this.equipCharacts = data;

        if (this.equipCharacts.length > 0) {
          this.checkData = true;
        } else {
          this.checkData = false;
        }

        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  deleteEquipCharacts(equip) {
    swal({
      title: 'Are you sure?',
      text: 'You won`t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.referencedata.deleteEquipCharacts(equip.ID_EQUIP).subscribe(
          response => {
            console.log(response);
            if (response === 1) {
              this.getEquipCharacts(equip.ID_EQUIP);
              this.toastr.success('Delete all point', 'successfully');
            } else {
              swal('Oops..', 'Delete all point', 'error');
            }
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
      }
    });
  }

  addOnePoint(idEquip) {
    this.referencedata.addEquipCharact({
      ID_EQUIP: idEquip,
      X_POSITION: this.newEquipCharact.X_POSITION
    }).subscribe(
      data => {
        if (data === -1) {
          swal('Oops..', 'Point ready exist!', 'error');
          return;
        }

        if (data === -2) {
          swal('Oops..', 'Can not add more than the max of the point', 'error');
          return;
        }

        this.equipCharacts.push(data);
        this.toastr.success('Add one point', 'successfully');
      },
      err => {

      },
      () => {
        this.newEquipCharact.X_POSITION = null;
      }
    );
  }

  onConvectionCharact(element = 0) {
    if (this.equipCharacts.length > 0) {
      this.yConvection = [];
      this.isSelectChart = 0;
      for (const equipCharact of this.equipCharacts) {
        this.xConvection.push(Number(equipCharact.X_POSITION));
        if (element === 0) {
          this.yConvection.push(Number(equipCharact.ALPHA_TOP));
          this.isSelectChart = 0;
        }

        if (element === 1) {
          this.yConvection.push(Number(equipCharact.ALPHA_BOTTOM));
          this.isSelectChart = 1;
        }

        if (element === 2) {
          this.yConvection.push(Number(equipCharact.ALPHA_LEFT));
          this.isSelectChart = 2;
        }

        if (element === 3) {
          this.yConvection.push(Number(equipCharact.ALPHA_RIGHT));
          this.isSelectChart = 3;
        }

        if (element === 4) {
          this.yConvection.push(Number(equipCharact.ALPHA_FRONT));
          this.isSelectChart = 4;
        }

        if (element === 5) {
          this.yConvection.push(Number(equipCharact.ALPHA_REAR));
          this.isSelectChart = 5;
        }
      }

      this.chartOptions = {
        chart: {
          renderTo: 'container',
          animation: false,
          zoomType: 'x',
        },
        title: {
          text: 'Highcharts draggable points convection'
        },
        tooltip: {
          yDecimals: 2
        },
        xAxis: {
          title: {
            text: '(%)'
          },
          categories: this.xConvection
        },
        yAxis: {
          title: {
            text: 'Convection (Kw/(m².°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        column: {
          stacking: 'normal'
        },
        line: {
          cursor: 'ns-resize'
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            cursor: 'pointer',
            allowPointSelect: true,
            point: {
              events: {
                // click: function (Event) {
                //   alert('Name: ' + this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
                // },
                drag: function (e) {
                  // this.getDataHighChartY(this.y);
                  // alert('Name: ' + this.category + ', Value: ' + Highcharts.numberFormat(this.y, 2) + ', Series :' + this.series.name);
                  this.dataHighChart = new ViewHighChart();
                  console.log(this.dataHighChart);
                  this.dataHighChart.YAxis = this.y;
                }
              }
            }
          }
        },
        series: [{
          data: this.yConvection,
          draggableY: true,
          dragMinY: 0
        }]
      };

      this.modalEquipmentProfil.show();
    }
  }

  getDataHighChartY(data) {
    console.log(data);
  }

  onTemperatureCharact(element = 0) {
    if (this.equipCharacts.length > 0) {
      this.xTemperature = [];
      this.isSelectChart = 0;
      for (const equipCharact of this.equipCharacts) {
        this.yTemperature.push(Number(equipCharact.X_POSITION));
        if (element === 0) {
          this.xTemperature.push(Number(equipCharact.TEMP_TOP));
          this.isSelectChart = 0;
        }

        if (element === 1) {
          this.xTemperature.push(Number(equipCharact.TEMP_BOTTOM));
          this.isSelectChart = 1;
        }

        if (element === 2) {
          this.xTemperature.push(Number(equipCharact.TEMP_LEFT));
          this.isSelectChart = 2;
        }

        if (element === 3) {
          this.xTemperature.push(Number(equipCharact.TEMP_RIGHT));
          this.isSelectChart = 3;
        }

        if (element === 4) {
          this.xTemperature.push(Number(equipCharact.TEMP_FRONT));
          this.isSelectChart = 4;
        }

        if (element === 5) {
          this.xTemperature.push(Number(equipCharact.TEMP_REAR));
          this.isSelectChart = 5;
        }
      }

      this.chartOptions = {
        chart: {
          renderTo: 'container',
          animation: false,
          zoomType: 'x',
        },
        title: {
          text: 'Highcharts draggable points temperature'
        },
        tooltip: {
          yDecimals: 2
        },
        xAxis: {
          title: {
            text: '(%)'
          },
          categories: this.yTemperature
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        column: {
          stacking: 'normal'
        },
        line: {
          cursor: 'ns-resize'
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            cursor: 'pointer',
            allowPointSelect: true,
            point: {
              events: {
                // click: function (Event) {
                //   alert('Name: ' + this.category + ', Value: ' + this.y + ', Series :' + this.series.name);
                // },
                drag: function (e) {
                  alert('Name: ' + this.category + ', Value: ' + Highcharts.numberFormat(this.y, 2) + ', Series :' + this.series.name);
                }
              }
            }
          }
        },
        series: [{
          data: this.xTemperature,
          draggableY: true,
          dragMinY: 0
        }]
      };

      this.modalEquipmentProfil.show();
    }
  }

  onCurvesConvectionChart() {
    const xPosition = [];
    const alphaTop = [];
    const alphaBottom = [];
    const alphaLeft = [];
    const alphaRight = [];
    const alphaFront = [];
    const alphaRear = [];
    const tempTop = [];
    const tempBottom = [];
    const tempLeft = [];
    const tempRight = [];
    const tempFront = [];
    const tempRear = [];
    if (this.equipCharacts.length > 0) {
      for (const charact of this.equipCharacts) {
        xPosition.push(Number(charact.X_POSITION));
        alphaTop.push(Number(charact.ALPHA_TOP));
        alphaBottom.push(Number(charact.ALPHA_BOTTOM));
        alphaLeft.push(Number(charact.ALPHA_LEFT));
        alphaRight.push(Number(charact.ALPHA_RIGHT));
        alphaFront.push(Number(charact.ALPHA_FRONT));
        alphaRear.push(Number(charact.ALPHA_REAR));
        tempTop.push(Number(charact.TEMP_TOP));
        tempBottom.push(Number(charact.TEMP_BOTTOM));
        tempLeft.push(Number(charact.TEMP_LEFT));
        tempRight.push(Number(charact.TEMP_RIGHT));
        tempFront.push(Number(charact.TEMP_FRONT));
        tempRear.push(Number(charact.TEMP_REAR));
      }

      this.chartTempCurvesOptions = {
        chart: {
          renderTo: 'container',
        },
        title: {
          text: 'Highcharts line temperature'
        },
        rangeSelector: {
          selected: 6
        },
        tooltip: {
          yDecimals: 2
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        xAxis: {
          title: {
            text: '(%)'
          },
          categories: xPosition
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        series: [{
          data: tempTop,
          name: 'Top'
        },
        {
          data: tempBottom,
          name: 'Bottom'
        },
        {
          data: tempLeft,
          name: 'Left'
        },
        {
          data: tempRight,
          name: 'Right'
        },
        {
          data: tempFront,
          name: 'Front'
        },
        {
          data: tempRear,
          name: 'Rear'
        }]
      };

      this.chartConvecCurvesOptions = {
        chart: {
          renderTo: 'container',
        },
        title: {
          text: 'Highcharts line convection'
        },
        rangeSelector: {
          selected: 6
        },
        tooltip: {
          yDecimals: 2
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        xAxis: {
          title: {
            text: '(%)'
          },
          categories: xPosition
        },
        yAxis: {
          title: {
            text: '(Kw/(m².°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        series: [{
          data: alphaTop,
          name: 'Top'
        },
        {
          data: alphaBottom,
          name: 'Bottom'
        },
        {
          data: alphaLeft,
          name: 'Left'
        },
        {
          data: alphaRight,
          name: 'Right'
        },
        {
          data: alphaFront,
          name: 'Front'
        },
        {
          data: alphaRear,
          name: 'Rear'
        }]
      };
    }
  }

  getDataHighChart(idEquip, profilType = 0, profilFace = 0) {
    this.isLoadingChart = true;
    this.profileType = profilType;
    localStorage.setItem('svgchart', JSON.stringify({ idEquip: idEquip, profilType: profilType, profilFace: profilFace }));
    this.referencedata.getDataHighChart({
      profilType: profilType,
      profilFace: profilFace,
      IDEQUIP: idEquip,
      minScaleY: null,
      maxScaleY: null,
      typeChart: 0,
      newProfil: '',
    }).subscribe(
      data => {
        this.dataHighChart = data;
        console.log(this.dataHighChart);
        if (profilType === 1) {
          this.onConvectionCharact(profilFace);
        } else {
          this.onTemperatureCharact(profilFace);
        }
        this.isLoadingChart = false;
      },
      err => {
        this.isLoadingChart = false;
      },
      () => {
        this.isLoadingChart = false;
      }
    );
  }

  getEquipCharact(idEquipCharact) {
    this.referencedata.getEquipCharactById(idEquipCharact).subscribe(
      data => {
        this.equipCharact = data;
      },
      err => {

      },
      () => {

      }
    );
  }

  getTempSetPoint(idEquip) {
    this.referencedata.getTempSetPoint(idEquip).subscribe(
      data => {
        this.tempSetPoint = data;
      },
      err => {
      },
      () => {}
    );
  }

  buildForNewTR(idEquip) {
    this.referencedata.buildForNewTR({
      ID_EQUIP: idEquip,
      tr_current: this.tempSetPoint.tr_current,
      tr_new: this.tempSetPoint.tr_new,
      ID_STUDY: (this.study !== null) ? this.study.ID_STUDY : 0,
    }).subscribe(
      response => {
        console.log(response);
        let success = true;

        if (response.CheckKernel !== 0) {
          success = false;
        }

        if (success) {
          this.toastr.success('Update temperature', 'successfully');
        } else {
          this.toastr.error('Update temperature', 'ERROR');
        }
        localStorage.setItem('equipCurr', JSON.stringify(response.RefEquipment));
        this.checkHideInfo = false;
        this.selectEquipment = new RefEquipment();
        this.modalTempSetpoint.hide();
        this.refrestListEquipment();
      },
      err => {},
      () => {}
    );
  }

  deleteEquipCharact(idEquipCharact) {
    this.referencedata.deleteEquipCharact(idEquipCharact).subscribe(
      response => {
        let success = true;

        if (response === 1) {
          success = true;
        }

        if (success) {
          // this.getEquipCharacts(this.selectEquipment);
          this.toastr.success('Delete a point', 'successfully');
        } else {
          this.toastr.error('Delete a point', 'ERROR');
        }
      },
      err => {

      },
      () => {}
    );
  }

  deleteEquipCharactValue(index) {
    this.equipCharacts.splice(index, 1);
  }

  getDataCurve(idEquip) {
    this.referencedata.getDataCurve(idEquip).subscribe(
      data => {
        this.dataCurve = data;
      },
      err => {},
      () => {}
    );
  }

  updateCurves(idEquip) {
    this.laddaCurve = true;
    this.referencedata.redrawCurves({
      ID_EQUIP: idEquip,
      isCapabilities: null,
      LOADINGRATE: this.dataCurve.LOADINGRATE,
      DWELLING_TIME: this.dataCurve.DWELLING_TIME,
      REGUL_TEMP: this.dataCurve.REGUL_TEMP,
      PRODTEMP: this.dataCurve.PRODTEMP
    }).subscribe(
      response => {
        this.laddaCurve = false;
        let success = true;

        if (response === 1) {
          success = true;
        }

        if (success) {
          this.toastr.success('Update data', 'successfully');
        } else {
          this.toastr.error('Update data', 'ERROR');
        }
      },
      err => {
        this.laddaCurve = false;
      },
      () => {
        this.laddaCurve = false;
      }
    );
  }

  updateEquipCharact(idEquipCharact) {
    this.referencedata.updateEquipCharact({
      ID_EQUIPCHARAC: idEquipCharact,
      ALPHA_TOP: this.equipCharact.ALPHA_TOP,
      ALPHA_BOTTOM: this.equipCharact.ALPHA_BOTTOM,
      ALPHA_LEFT: this.equipCharact.ALPHA_LEFT,
      ALPHA_RIGHT: this.equipCharact.ALPHA_RIGHT,
      ALPHA_FRONT: this.equipCharact.ALPHA_FRONT,
      ALPHA_REAR: this.equipCharact.ALPHA_REAR,
      TEMP_TOP: this.equipCharact.TEMP_TOP,
      TEMP_BOTTOM: this.equipCharact.TEMP_BOTTOM,
      TEMP_LEFT: this.equipCharact.TEMP_LEFT,
      TEMP_RIGHT: this.equipCharact.ALPHA_RIGHT,
      TEMP_FRONT: this.equipCharact.TEMP_FRONT,
      TEMP_REAR: this.equipCharact.TEMP_REAR
    }).subscribe(
      response => {
        let success = true;

        if (response === 1) {
          success = true;
        }

        if (success) {
          this.modalReferentialEquip.hide();
          this.getEquipCharacts(this.equipCharact.ID_EQUIP);
          this.toastr.success('Update EquipCharact', 'successfully');
        } else {
          this.toastr.error('Update EquipCharact', 'ERROR');
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  onSelectEquipment(equip) {
    localStorage.setItem('equipCurr', '');
    this.checkActiveEquip = 0;
    this.checkHideInfo = false;
    this.disableFilter = false;

    this.selectEquipment = equip;
    this.getListEquipmentEquipSeries(equip.ID_FAMILY);
    this.getListRamps(equip.ID_EQUIP);
    this.getListShelves(equip.ID_EQUIP);
    this.getListConsumptions(equip.ID_EQUIP);
    this.getEquipCharacts(equip.ID_EQUIP);
  }

  getListEquipmentFamily() {
    this.referencedata.getEquipmentFamily().subscribe(
      response => {
        this.listEquipFamily = response;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  getListEquipmentEquipSeries(idFamily) {
    this.referencedata.getEquipmentSeries(idFamily).subscribe(
      response => {
        this.listequipSeries = response;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  getListRamps(idEquip) {
    this.referencedata.getRamps(idEquip).subscribe(
      data => {
        this.rampsArray = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  addRampValue() {
    if (!this.newRamp.POSITION) {
      swal('Oops..', 'Enter a value in Position ramp !', 'error');
      return;
    }

    if (!isNumber(this.newRamp.POSITION)) {
      swal('Oops..', 'Not a valid number in Position ramp !', 'error');
      return;
    }

    if (this.rampsArray.length >= 2) {
      swal('Oops..', 'Can not add more than the max of the equipment', 'error');
      return;
    }

    this.rampsArray.push(this.newRamp);
    this.newRamp = {};
  }

  deleteRampValue(index) {
    this.rampsArray.splice(index, 1);
  }

  getListShelves(idEquip) {
    this.referencedata.getShelves(idEquip).subscribe(
      data => {
        this.shelvesArray = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  addShelveValue() {
    if (!this.newShelve.SPACE) {
      swal('Oops..', 'Enter a value in Space !', 'error');
      return;
    }

    if (!this.newShelve.NB) {
      swal('Oops..', 'Enter a value in Number !', 'error');
      return;
    }

    if (!isNumber(this.newShelve.SPACE)) {
      swal('Oops..', 'Not a valid number in Space !', 'error');
      return;
    }

    if (!isNumber(this.newShelve.NB)) {
      swal('Oops..', 'Not a valid number in Number !', 'error');
      return;
    }

    this.shelvesArray.push(this.newShelve);
    this.newShelve = {};
  }

  deleteShelveValue(index) {
    this.shelvesArray.splice(index, 1);
  }

  getListConsumptions(idEquip) {
    this.referencedata.getConsumptions(idEquip).subscribe(
      data => {
        this.consumptionsArray = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  addConsumptionValue() {
    if (!this.newConsumption.TEMPERATURE) {
      swal('Oops..', 'Enter a value in Temperature !', 'error');
      return;
    }

    if (!this.newConsumption.CONSUMPTION_PERM) {
      swal('Oops..', 'Enter a value in Consumption of maintains in cold !', 'error');
      return;
    }

    if (!this.newConsumption.CONSUMPTION_GETCOLD) {
      swal('Oops..', 'Enter a value in Consumption of stake in cold !', 'error');
      return;
    }

    if (!isNumber(this.newConsumption.TEMPERATURE)) {
      swal('Oops..', 'Not a valid number in Temperature !', 'error');
      return;
    }

    if (!isNumber(this.newConsumption.CONSUMPTION_PERM)) {
      swal('Oops..', 'Not a valid number in Consumption of maintains in cold !', 'error');
      return;
    }

    if (!isNumber(this.newConsumption.CONSUMPTION_GETCOLD)) {
      swal('Oops..', 'Not a valid number in Consumption of stake in cold !', 'error');
      return;
    }

    this.consumptionsArray.push(this.newConsumption);
    this.newConsumption = {};
  }

  deleteConsumptionValue(index) {
    this.consumptionsArray.splice(index, 1);
  }

  movepoint($event) {
    // var to manage svg
    const focusXZone = 50;	// pixels around the selected points
    const focusYZone = 25;	// pixels around the selected points
    if (this.selectedPoint !== null) {
      const x = Number($event.offsetX);
      const y = Number($event.offsetY);
      const cx = Number(this.selectedPoint.getAttribute('cx'));
      const cy = Number(this.selectedPoint.getAttribute('cy'));

      if (this.dataHighChart) {
        if ((y >= this.dataHighChart.minPixY) && (y <= this.dataHighChart.maxPixY)
          && (y >= cy - focusYZone) && (y <= cy + focusYZone)
          && (x >= cx - focusXZone) && (x <= cx + focusXZone)) {
            this.selectedPoint.setAttribute('cy', y);
            const value = this.getAxisYValue(y);
            const circleValue = <HTMLElement>document.getElementById('circle_value');
            circleValue.setAttribute('value', String(value));

            this.redrawPath();

            this.dataHighChart.valuesTabY[this.currentpos] = value;
          }
        }
    }
  }

  circleover($event, pos) {
    if (this.selectedPoint === null) {
      const idCircle = <HTMLElement>document.getElementById('c' + pos);
      idCircle.setAttribute('fill', '#00FF00');

      const circlePosition = <HTMLElement>document.getElementById('circle_position');
      circlePosition.setAttribute('value', pos);

      const circleValue = <HTMLElement>document.getElementById('circle_value');
      const value = this.getAxisYValue($event.offsetY);

      // if (this.dataHighChart) {
      //   value = this.dataHighChart.valuesTabY[pos];
      // }
      circleValue.setAttribute('value', String(value));
    }
  }

  circleout($event, pos) {
    if (this.selectedPoint === null) {
      const idCircle = <HTMLElement>document.getElementById('c' + pos);
      idCircle.setAttribute('fill', '#D5D5FF');

      const circlePosition = <HTMLElement>document.getElementById('circle_position');
      circlePosition.setAttribute('value', '');

      const circleValue = <HTMLElement>document.getElementById('circle_value');
      circleValue.setAttribute('value', '');
    }
  }

  selectpoint($event, pos) {
    const currentCircle = <HTMLElement>document.getElementById('c' + pos);
    const circlePosition = <HTMLElement>document.getElementById('circle_position');
    const circleValue = <HTMLElement>document.getElementById('circle_value');
    if (this.selectedPoint === null) {
      this.selectedPoint = currentCircle;
      this.currentpos = pos;
      this.selectedPoint.setAttribute('stroke', '#FF0000');
      this.selectedPoint.setAttribute('fill', '#00FF00');
      let value = pos;
      circlePosition.setAttribute('value', pos);

      if (this.dataHighChart) {
        value = this.dataHighChart.valuesTabY[pos];

        this.dataHighChart.selectedPoints[pos] = 1;
      }
      circleValue.setAttribute('value', value);
    } else {
      this.selectedPoint.setAttribute('stroke', '#000000');
      this.selectedPoint.setAttribute('fill', '#D5D5FF');
      this.selectedPoint = null;
      this.currentpos = -1;
      circlePosition.setAttribute('value', '');
      circleValue.setAttribute('value', '');
    }
  }

  getAxisYValue(pos: number) {
    let value = 0;
    if (this.dataHighChart) {
      if (Number(pos) > Number(this.dataHighChart.originY)) {
        value = Number(this.dataHighChart.minValueY);
      } else if (Number(pos) < (Number(this.dataHighChart.originY) - Number(this.dataHighChart.nbpixY))) {
        value = Number(this.dataHighChart.maxValueY);
      } else {
        value = (Number(this.dataHighChart.originY) - Number(pos)) / Number(this.dataHighChart.nbpixY) *
        (Number(this.dataHighChart.MaxiMum) - Number(this.dataHighChart.MiniMum)) + Number(this.dataHighChart.MiniMum);
      }
    }
    value = Math.round(value * 100) / 100;

    return value;
  }

  getAxisYValue1(pos: number) {
    let lfVal = 0.0;

    if (pos > this.dataHighChart.originY) {
      lfVal = this.dataHighChart.MiniMum;
    } else if (pos < this.dataHighChart.originY - this.dataHighChart.axisYLength) {
      lfVal = this.dataHighChart.MaxiMum;
    } else {
      lfVal = (this.dataHighChart.originY - pos) / this.dataHighChart.axisYLength *
        (this.dataHighChart.MaxiMum - this.dataHighChart.MiniMum) + this.dataHighChart.MiniMum;
    }

    return lfVal;
  }

  getAxisYPos(value) {
    let pos = 0;
    if (this.dataHighChart) {
      if (value < this.dataHighChart.MiniMum) {
        value = this.dataHighChart.MiniMum;
      } else if (value > this.dataHighChart.MaxiMum) {
        value = this.dataHighChart.MaxiMum;
      }
      pos = this.dataHighChart.originY - Math.round((value - this.dataHighChart.MaxiMum) /
      (this.dataHighChart.MaxiMum - this.dataHighChart.MiniMum) * this.dataHighChart.nbpixY);
    }
    return pos;
  }

  setpoint() {
    if (this.selectedPoint != null) {
      const circleValue = <HTMLElement>document.getElementById('circle_value');
      const circlePosition = <HTMLElement>document.getElementById('circle_position');
      const value = circleValue.getAttribute('value');
      if (this.dataHighChart) {
        if (Number(value) >= this.dataHighChart.MiniMum) {
          const cy = this.getAxisYPos(value);
          this.selectedPoint.setAttribute('cy', cy);
          this.redrawPath();

          this.selectedPoint.setAttribute('stroke', '#000000');
          this.selectedPoint.setAttribute('fill', '#D5D5FF');
          this.selectedPoint = null;

          circlePosition.setAttribute('value', '');
          circleValue.setAttribute('value', '');
        }
      }
    }
  }

  setpointenter($event) {
    if ($event.which === 13) {
      this.setpoint();
    }
  }

  redrawPath() {
    let idx = 0;
    const linkedpath = <HTMLElement>document.getElementById('profilLine');
    let circle;
    let path = '';
    let cx, cy;
    if (this.dataHighChart) {
      for (idx = 0; idx < this.dataHighChart.nbpoints; idx++) {
        if (this.dataHighChart.selectedPoints[idx] === 1) {
          circle = <HTMLElement>document.getElementById('c' + idx);
          cx = circle.getAttribute('cx');
          cy = circle.getAttribute('cy');

          if (idx === 0) {
            path = 'M ' + cx + ' ' + cy + ' L';
          } else {
            path += ' ' + cx + ' ' + cy;
          }
        }
      }
      linkedpath.setAttribute('d', path);
    }
  }

  refreshScaleChart() {
    this.svgchart = JSON.parse(localStorage.getItem('svgchart'));
    this.referencedata.getDataHighChart({
      profilType: this.svgchart.profilType,
      profilFace: this.svgchart.profilFace,
      IDEQUIP: this.svgchart.idEquip,
      minScaleY: this.dataHighChart.MiniMum,
      maxScaleY: this.dataHighChart.MaxiMum,
      typeChart: 1,
      newProfil: '',
    }).subscribe(
      data => {
        this.dataHighChart = data;
        console.log(data);
        this.toastr.success('Update scale chart', 'successfully');
      },
      err => {
        console.log('err');
      },
      () => {}
    );
  }

  clearSelectedPoints() {
    const rescale = <HTMLElement>document.getElementById('rescale');
    rescale.setAttribute('disabled', 'true');
    const confirm = <HTMLElement>document.getElementById('confirmButton');
    confirm.setAttribute('disabled', 'true');
    let idx = 0;
    let circle;
    this.selectedPoint = null;
    if (this.dataHighChart) {
      this.dataHighChart.selectedPoints[idx] = 1;
      circle = <HTMLElement>document.getElementById('c' + idx);
      circle.setAttribute('cy', this.dataHighChart.posTabY[idx]);

      for (idx = 1; idx < this.dataHighChart.nbpoints - 1; idx++) {
        circle = <HTMLElement>document.getElementById('c' + idx);
        this.dataHighChart.selectedPoints[idx] = 0;
        circle.setAttribute('cy', this.dataHighChart.posTabY[idx]);
      }

      circle = <HTMLElement>document.getElementById('c' + idx);
      this.dataHighChart.selectedPoints[idx] = 1;
      circle.setAttribute('cy', this.dataHighChart.posTabY[idx]);
    }

    const linkedpath = <HTMLElement>document.getElementById('profilLine');
    linkedpath.setAttribute('d', '');
  }

  saveEquipProfile() {
    let idx = 0;
    let profil_string = '';
    let value = '';
    if (this.dataHighChart) {
      if (this.dataHighChart.nbpoints > 0) {
        for (idx = 0; idx < this.dataHighChart.nbpoints; idx++) {
          if (this.dataHighChart.selectedPoints[idx] === 1) {
            profil_string += this.dataHighChart.valuesTabY[idx];
          }
          profil_string += '_';
        }
        value = profil_string;
      }
    }
    return value;
  }

  submitGenerate() {
    this.svgchart = JSON.parse(localStorage.getItem('svgchart'));
    const point = this.saveEquipProfile();
    this.referencedata.getDataHighChart({
      profilType: this.svgchart.profilType,
      profilFace: this.svgchart.profilFace,
      IDEQUIP: this.svgchart.idEquip,
      minScaleY: this.dataHighChart.MiniMum,
      maxScaleY: this.dataHighChart.MaxiMum,
      typeChart: 2,
      newProfil: point,
    }).subscribe(
      data => {
        this.dataHighChart = data;
        this.toastr.success('Generate data chart', 'successfully');
        this.disabledConfirm = 1;
      },
      err => {

      },
      () => {

      }
    );
  }

  submitProfil() {
    this.svgchart = JSON.parse(localStorage.getItem('svgchart'));
    const point = this.saveEquipProfile();
    this.referencedata.saveSelectedProfile({
      profilType: this.svgchart.profilType,
      profilFace: this.svgchart.profilFace,
      ID_EQUIP: this.svgchart.idEquip,
      minScaleY: this.dataHighChart.MiniMum,
      maxScaleY: this.dataHighChart.MaxiMum,
      typeChart: 3,
      newProfil: point,
      checkTop: this.dataHighChart.checkTop,
      checkButton: this.dataHighChart.checkButton,
      checkFront: this.dataHighChart.checkFront,
      checkLeft: this.dataHighChart.checkLeft,
      checkRear: this.dataHighChart.checkRear,
      checkRight: this.dataHighChart.checkRight
    }).subscribe(
      response => {
        if (response === 1) {
          this.toastr.success('Update chart point', 'successfully');
        }
      },
      err => {

      },
      () => {}
    );
  }

  // display page
  openLoadEquipment() {
    this.hideAllPageEquipment();
    const loadE = <HTMLElement>document.getElementById('page-load-equipment');
    loadE.style.display = 'block';
    this.activePageEquipment = 'load';
  }

  openGenerateEquipment() {
    this.hideAllPageEquipment();
    const genE = <HTMLElement>document.getElementById('page-generated-equipment');
    genE.style.display = 'block';
    this.activePageEquipment = 'gen';
  }

  openCurvesEquipment() {
    this.hideAllPageEquipment();
    this.onCurvesConvectionChart();
    const curE = <HTMLElement>document.getElementById('page-curves-equipment');
    curE.style.display = 'block';
    this.activePageEquipment = 'curves';
  }

  hideAllPageEquipment() {
    const loadE = <HTMLElement>document.getElementById('page-load-equipment');
    const genE = <HTMLElement>document.getElementById('page-generated-equipment');
    const curE = <HTMLElement>document.getElementById('page-curves-equipment');
    loadE.style.display = 'none';
    genE.style.display = 'none';
    curE.style.display = 'none';
  }

  // HAIDT
  onSelectFilter() {
    if (!this.newEquipment.nameEquipment || this.newEquipment.nameEquipment === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (isNumber(this.newEquipment.nameEquipment)) {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!this.newEquipment.versionEquipment) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.newEquipment.versionEquipment)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    if (Number(this.statusEquip) === 0) {
      if (Number(this.equipGenerate) === 0) {
        swal('Oops..', 'Please choose equipment!', 'warning');
        return;
      }
      if (!this.selectEquipGener.capabilitiesCalc) {
        if (!this.newEquipment.tempSetPoint || String(this.newEquipment.tempSetPoint) === '') {
          swal('Oops..', 'Please specify regulation temperature!', 'warning');
          return;
        }
      }
      if (!this.selectEquipGener.capabilitiesCalc) {
        if (this.newEquipment.dwellingTime || String(this.newEquipment.dwellingTime) === '') {
          swal('Oops..', 'Please specify dwelling time!', 'warning');
          return;
        }
      }
      this.getEquipmentFilter(this.equipGenerate);
    }

    if (Number(this.statusEquip) === 1) {
      if (Number(this.equipTranslation) === 0) {
        swal('Oops..', 'Please choose equipment!', 'warning');
        return;
      }
      if (!this.newEquipment.newPos || String(this.newEquipment.newPos) === '') {
        swal('Oops..', 'Please specify new position	!', 'warning');
        return;
      }
      if (!this.newEquipment.dwellingTime || String(this.newEquipment.dwellingTime) === '') {
        swal('Oops..', 'Please specify dwelling time!', 'warning');
        return;
      }
      this.getEquipmentFilter(this.equipTranslation);
    }

    if (Number(this.statusEquip) === 2) {
      if (Number(this.equipRotate) === 0) {
        swal('Oops..', 'Please choose equipment!', 'warning');
        return;
      }
      this.getEquipmentFilter(this.equipRotate);
    }
  }

  getEquipmentFilter(id) {
    this.referencedata.getEquipmentFilter(id).subscribe(
      data => {
        console.log(data);
        this.filterEquipment = data;

        if (this.filterEquipment) {
          this.modalFilter.show();
        }
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  confirmFilter() {
    this.modalFilter.hide();
  }

  counter(i: number) {
    const list = [];
    for (let x = 0; x < i; x++) {
      list.push(x);
    }
    return list;
  }

  onFilterLoad(equip) {
    console.log(equip);
    if (Number(equip.ID_EQUIPGENERATION) !== 0) {
      this.getEquipmentFilter(equip.ID_EQUIP);
    }
    this.disableFilter = true;
  }
  // end HAIDT
}
