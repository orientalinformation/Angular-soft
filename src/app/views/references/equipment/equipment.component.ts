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
import { RefEquipment, ViewEquipment, NewEquipment, EquipmentFamily } from '../../../api/models';
import { Equipment, EquipGeneration, EquipmentSeries, Ramps, Shelves, Consumptions } from '../../../api/models';
import { SaveAsEquipment } from '../../../api/models';

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
  @ViewChild('modalEquipmentProfil2') public modalEquipmentProfil2: ModalDirective;
  @ViewChild('modalAddEquipment') public modalAddEquipment: ModalDirective;
  @ViewChild('modalSaveAsEquipment') public modalSaveAsEquipment: ModalDirective;

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

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService, private router: Router) {
    this.activePageEquipment = 'load';
    this.newEquipment = new NewEquipment();
    this.saveAsEquipment = new SaveAsEquipment();
    this.equipGenerationDefault = new EquipGeneration();
  }

  ngOnInit() {
    this.getListEquipmentFamily();
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
    this.laddaIsCalculating = true;
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

    this.referencedata.newEquipment(this.newEquipment).subscribe(
      response => {
        console.log(response);
        let success = true;

        if (response === -1) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Please, Enter a value in Equipments !');
          return;
        }

        if (response === -3) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Please, Enter a value in Version !');
          return;
        }

        if (response === -2) {
          success = false;
          this.laddaIsCalculating = false;
          this.toastr.error('Create equipment', 'Select an equipment.!');
          return;
        }

        if (response === -4) {
          this.laddaIsCalculating = false;
          success = false;
          this.toastr.error('Create equipment', 'Name and version already in use!');
          return;
        }

        if (response === -5) {
          this.laddaIsCalculating = false;
          success = false;
          this.toastr.error('Calculate equipment', 'Run calculate error');
          return;
        }

        if (response === 1) {
          success = true;
        }

        if (success) {
          this.laddaIsCalculating = false;
          this.toastr.success('Create equipment', 'successfully');
          this.modalAddEquipment.hide();
          this.refrestListEquipment();
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
    this.referencedata.saveAsEquipment({
      versionEquipment: this.saveAsEquipment.versionEquipment,
      nameEquipment: this.saveAsEquipment.nameEquipment,
      equipmentId: equipment.ID_EQUIP
    }).subscribe(
      response => {
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
            console.log(response);
            if (response === 1) {
              this.toastr.success('Delete equipment', 'successfully');
            } else {
              swal('Oops..', 'Delete equipment', 'error');
            }
          },
          err => {
            console.log(err);
          },
          () => {
            this.refrestListEquipment();
          }
        );
      }
    });
  }

  

  onSelectEquipment(equip) {
    console.log(equip);
    this.selectEquipment = equip;
    this.getListEquipmentEquipSeries(equip.ID_FAMILY);
    this.getListRamps(equip.ID_EQUIP);
    this.getListShelves(equip.ID_EQUIP);
    this.getListConsumptions(equip.ID_EQUIP);
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
}
