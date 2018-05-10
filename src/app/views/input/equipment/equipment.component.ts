import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TextService } from '../../../shared/text.service';
import { TranslateService } from '@ngx-translate/core';
import * as Models from '../../../api/models';

import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Symbol } from '../../../api/models/symbol';
import { ChainingComponent } from '../chaining/chaining.component';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  public transform(values: Models.Equipment[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter(v => v.EQUIP_NAME.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }
}

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, AfterContentInit {
  @ViewChild('addEquipModal') public addEquipModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('inputModal') public inputModal: ModalDirective;
  @ViewChild('chainingControls') chainingControls: ChainingComponent;

  public isUpdatePrice = false;
  public isUpdateInterval = false;
  public  showTable = false;
  public study: Models.Study;
  public equipmentsView: Models.ViewStudyEquipment[];
  public laddaDeletingStudyEquip: boolean[];
  public laddaListingEquipments = false;
  public laddaLoadingLayout = false;
  public laddaAddingEquipment = false;
  public laddaUpdateLayout = false;
  public equipments: Models.Equipment[];
  public editLayoutForm: {
    stdEquipId?: number,
    widthInterval?: number,
    lengthInterval?: number,
    orientation?: number
  };

  constructor(private api: ApiService, private text: TextService, private translate: TranslateService,
    private toastr: ToastrService, private router: Router, private auth: AuthenticationService) { }
  public selectedAddingEquipment: Models.Equipment;
  public filterString = '';
  public unitData: Models.UnitDataEquipment;
  public unitDataRes = {
    price: 0,
    intervalL: 0,
    intervalW: 0
  };
  public symbol: Symbol;
  public equipment;
  public energies;
  public manufacturers;
  public series;
  public origins;
  public processes;
  public models;
  public sizes;
  public loadInterval = false;
  public energySelected = -1;
  public manufacturerSelected = '';
  public seriesSelected = -1;
  public originSelected = -1;
  public processSelected = -1;
  public modelSelected = -1;
  public sizeSelected = '';
  public minmaxEquipment: Models.ViewMinMaxEquipment;
  public operatingSetting: Models.ViewOperatingSetting;
  public alphaTop = 0.00;
  public alphaBottom = 0.00;
  public alphaLeft = 0.00;
  public alphaRight = 0.00;
  public alphaFront = 0.00;
  public alphaRear = 0.00;
  public alphaTopFix = false;
  public alphaBottomFix = false;
  public alphaLeftFix = false;
  public alphaRightFix = false;
  public alphaFrontFix = false;
  public alphaRearFix = false;
  public calculationParameter: Models.CalculationParameter;
  public tsValue: Array<number> = [];
  public trValue: Array<number> = [];
  public vcValue: Array<number> = [];
  public eid = 0;
  public isLoadingView = true;
  public disabledTr = false;

  ngOnInit() {
    this.study = null;
  }

  deleteStudyEquipment(equip: Models.StudyEquipment, index: number) {
    this.laddaDeletingStudyEquip[index] = true;
    this.api.removeStudyEquipment({
      id: this.study.ID_STUDY,
      idEquip: equip.ID_STUDY_EQUIPMENTS
    }).subscribe(
      (resp) => {
        this.refreshView();
      },
      (err) => {
        this.laddaDeletingStudyEquip[index] = false;
        swal('Error', 'Failed to remove equipment, please check your internet connection and' +
          ' try again, contact administrators if error is persist.', 'warning');

        console.log(err);
      },
      () => {
        this.laddaDeletingStudyEquip[index] = false;

      }
    );
  }

  recalculateEquipment() {
    this.api.reCalculate(this.study.ID_STUDY).subscribe(
      res => {
        this.toastr.success('Recalculate success', 'successfully');
        this.refreshView();
      }
    );
  }

  refreshView() {
    this.isLoadingView = true;
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
          (equips: Models.ViewStudyEquipment[]) => {
            console.log(equips);
            this.laddaDeletingStudyEquip = new Array<boolean>(equips.length);
            this.laddaDeletingStudyEquip.fill(false);
            this.equipmentsView = equips;
            if (equips.length > 0) {
              localStorage.setItem('equip', JSON.stringify(equips));
            } else {
              localStorage.setItem('equip', '');
            }
            this.isLoadingView = false;
            console.log(this.equipmentsView);
          },
          (err) => {
            console.log(err);
          },
          () => {
          }
        );
        this.api.getMinMaxEquipment(this.study.ID_STUDY).subscribe(
          mm => {
            this.minmaxEquipment = mm;
          }
        );
      }
    );
  }

  ngAfterContentInit() {
    this.study = JSON.parse(localStorage.getItem('study'));

    this.refreshView();
    this.getUnitData();
  }

  onAddEquip() {
    if (!this.selectedAddingEquipment) {
      swal('Error', 'Please select an equipment!', 'error');
      return;
    }

    this.laddaAddingEquipment = true;
    this.api.addEquipment({
      id: this.study.ID_STUDY,
      idEquip: this.selectedAddingEquipment.ID_EQUIP
    }).subscribe(
      resp => {
        this.refreshView();
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      },
      err => {
        console.log(err);
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      },
      () => {
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      }
    );
  }

  onShowAddEquip() {
    this.energySelected = -1;
    this.manufacturerSelected = '';
    this.seriesSelected = -1;
    this.originSelected = -1;
    this.processSelected = -1;
    this.seriesSelected = -1;
    this.sizeSelected = '';
    if (!this.equipments || this.equipments.length === 0) {
      this.laddaListingEquipments = true;
      this.api.getEquipments({}).subscribe(
        (resp: Models.Equipment[]) => {
          this.equipments = resp;
          this.laddaListingEquipments = false;
          this.addEquipModal.show();
        },
        err => {
          this.laddaListingEquipments = false;
          console.log(err);
        },
        () => {
          this.laddaListingEquipments = false;
        }
      );
      this.api.getSelectionCriteriaFilter({}).subscribe(
        data => {
          this.energies = data.energies;
          this.manufacturers = data.manufacturer;
          this.series = data.series;
          this.origins = data.origines;
          this.processes = data.processes;
          this.models = data.model;
          this.sizes = data.size;
        }
      );
    } else {
      this.addEquipModal.show();
    }
  }

  select_energy() {
    this.manufacturerSelected = '';
    this.seriesSelected = -1;
    this.originSelected = -1;
    this.processSelected = -1;
    this.modelSelected = -1;
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_manufacturer() {
    this.seriesSelected = -1;
    this.originSelected = -1;
    this.processSelected = -1;
    this.modelSelected = -1;
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_family() {
    this.originSelected = -1;
    this.processSelected = -1;
    this.modelSelected = -1;
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_origin() {
    this.processSelected = -1;
    this.modelSelected = -1;
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_process_type() {
    this.modelSelected = -1;
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_model() {
    this.sizeSelected = '';
    this.loadFilter();
    this.loadEquipment();
  }

  select_size() {
    this.loadEquipment();
  }

  loadFilter() {
    const params: ApiService.GetSelectionCriteriaFilterParams = {
      energy: this.energySelected,
      manufacturer: this.manufacturerSelected,
      sery: this.seriesSelected,
      origin: this.originSelected,
      process: this.processSelected,
      model: this.modelSelected
    };
    this.api.getSelectionCriteriaFilter(params).subscribe(
      data => {
        this.energies = data.energies;
        this.manufacturers = data.manufacturer;
        this.series = data.series;
        this.origins = data.origines;
        this.processes = data.processes;
        this.models = data.model;
        this.sizes = data.size;
      }
    );
  }

  loadEquipment() {
    console.log(this.energySelected);
    const params: ApiService.GetEquipmentsParams = {
      idStudy: this.study.ID_STUDY,
      energy: this.energySelected,
      manufacturer: this.manufacturerSelected,
      sery: this.seriesSelected,
      origin: this.originSelected,
      process: this.processSelected,
      model: this.modelSelected,
      size: this.sizeSelected
    };
    this.api.getEquipments(params).subscribe(
      (resp: Models.Equipment[]) => {
        console.log(resp);
        this.equipments = resp;
      }
    );
  }

  onSelectAddingEquipment(equip: Models.Equipment) {
    this.selectedAddingEquipment = equip;
  }

  showPageGas() {
    this.showTable = !this.showTable;
    const table = <HTMLElement> document.getElementById('tableGas');
    if (this.showTable) {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }

  getUnitData() {
    this.api.getUnitData(this.study.ID_STUDY).subscribe(
      resp => {
        console.log(resp);
        this.unitData = resp;
        this.unitDataRes.price = resp.Price;
        this.unitDataRes.intervalL = resp.IntervalLength;
        this.unitDataRes.intervalW = resp.IntervalWidth;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  refreshPrice() {
    this.unitData.Price = this.unitDataRes.price;
  }

  refreshIntervalLW() {
    this.unitData.IntervalLength = this.unitDataRes.intervalL;
    this.unitData.IntervalWidth = this.unitDataRes.intervalW;
  }

  savePrice() {
    // console.log(this.unitData);
    if (!isNumber(this.unitData.Price)) {
      swal('Oops..', 'Please specify Price !', 'warning');
      return;
    }
    this.isUpdatePrice = true;
    this.api.updatePrice({
      id: this.study.ID_STUDY,
      price: this.unitData.Price }).subscribe(
      resp => {
        if (resp === 1) {
          this.toastr.success('Update price', 'successfully');
          this.router.navigate(['/input/equipment']);
          this.getUnitData();
          this.isUpdatePrice = false;
        } else {
          swal('Oops..', 'Update price error!', 'error');
        }
      },
      err => {
        console.log(err);
        this.isUpdatePrice = false;
      },
      () => {
        this.isUpdatePrice = false;
      }
    );
  }

  saveInterval() {
    if (!this.unitData.IntervalLength) {
      this.toastr.error(this.translate.instant('Enter a value in specify Lenght !'), 'Error');
      return;
    } else if (!this.isNumberic(this.unitData.IntervalLength)) {
      this.toastr.error(this.translate.instant('Not a valid number in specify Lenght !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.unitData.IntervalLength, this.minmaxEquipment.mmLInterval.LIMIT_MIN,
      this.minmaxEquipment.mmLInterval.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in specify Lenght') +
        ' (' + this.minmaxEquipment.mmLInterval.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmLInterval.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.unitData.IntervalWidth) {
      this.toastr.error(this.translate.instant('Enter a value in specify Width !'), 'Error');
      return;
    } else if (!this.isNumberic(this.unitData.IntervalWidth)) {
      this.toastr.error(this.translate.instant('Not a valid number in specify Width !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.unitData.IntervalWidth, this.minmaxEquipment.mmWInterval.LIMIT_MIN,
      this.minmaxEquipment.mmWInterval.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in specify Width') +
        ' (' + this.minmaxEquipment.mmWInterval.LIMIT_MIN + ' : ' + this.minmaxEquipment.mmWInterval.LIMIT_MAX + ') !', 'Error');
        return;
    }
    this.isUpdateInterval = true;
    this.loadInterval = true;
    this.api.updateInterval({
      id: this.study.ID_STUDY,
      lenght: this.unitData.IntervalLength,
      width: this.unitData.IntervalWidth
    }).subscribe(
      resp => {
        if (resp === 1) {
          this.toastr.success('Update interval Lenght Width', 'successfully');
          this.router.navigate(['/input/equipment']);
          this.getUnitData();
          this.refreshView();
          this.isUpdateInterval = false;
          this.loadInterval = false;

          // Recalculate equipment parameter

        } else {
          swal('Oops..', 'Update interval Lenght Width error!', 'error');
        }
      },
      err => {
        console.log(err);
        this.isUpdateInterval = false;
      },
      () => {
        this.isUpdateInterval = false;
      }
    );
  }

  equipEditConfig(equip: Models.ViewStudyEquipment, index: number) {
    console.log(equip);
    this.api.getOperatingSetting(equip.ID_STUDY_EQUIPMENTS).subscribe(
      data => {
        console.log(data);
        this.operatingSetting = data;
        this.calculationParameter = data.studyEquipment.calculation_parameters[0];
        this.alphaTopFix = this.calculationParameter.STUDY_ALPHA_TOP_FIXED;
        this.alphaBottomFix = this.calculationParameter.STUDY_ALPHA_BOTTOM_FIXED;
        this.alphaLeftFix = this.calculationParameter.STUDY_ALPHA_LEFT_FIXED;
        this.alphaRightFix = this.calculationParameter.STUDY_ALPHA_RIGHT_FIXED;
        this.alphaFrontFix = this.calculationParameter.STUDY_ALPHA_FRONT_FIXED;
        this.alphaRearFix = this.calculationParameter.STUDY_ALPHA_REAR_FIXED;
        this.alphaTop = data.studyEquipment.alpha[0];
        this.alphaBottom = data.studyEquipment.alpha[1];
        this.alphaLeft = data.studyEquipment.alpha[2];
        this.alphaRight = data.studyEquipment.alpha[3];
        this.alphaFront = data.studyEquipment.alpha[4];
        this.alphaRear = data.studyEquipment.alpha[5];
        this.disabledTr = !(this.getCapability(data.studyEquipment.CAPABILITIES, 1));
        for (let i = 0; i < this.operatingSetting.studyEquipment.ts.length; i++) {
          this.tsValue[i] = this.operatingSetting.studyEquipment.ts[i];
        }
        for (let i = 0; i < this.operatingSetting.studyEquipment.tr.length; i++) {
          this.trValue[i] = this.operatingSetting.studyEquipment.tr[i];
        }
        for (let i = 0; i < this.operatingSetting.studyEquipment.vc.length; i++) {
          this.vcValue[i] = this.operatingSetting.studyEquipment.vc[i];
        }
        console.log(this.calculationParameter.STUDY_ALPHA_TOP_FIXED);
      }
    );
    this.inputModal.show();
  }

  saveConfig() {
    console.log(this.operatingSetting.studyEquipment);
    for (let i = 0; i < this.operatingSetting.studyEquipment.ts.length; i++) {
      const value = this.tsValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Residence / Dwell !'), 'Error');
        break;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Residence / Dwell !'), 'Error');
        break;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Residence / Dwell') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTs.LIMIT_MAX + ') !', 'Error');
          break;
      }
    }
    for (let i = 0; i < this.operatingSetting.studyEquipment.tr.length; i++) {
      const value = this.trValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Control temperature !'), 'Error');
        break;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Control temperature !'), 'Error');
        break;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Control temperature ') +
          ' (' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxTr.LIMIT_MAX + ') !', 'Error');
          break;
      }
    }
    for (let i = 0; i < this.operatingSetting.studyEquipment.vc.length; i++) {
      const value = this.vcValue[i];
      if (!value) {
        this.toastr.error(this.translate.instant('Enter a value in Convection Setting !'), 'Error');
        break;
      } else if (!this.isNumberic(value)) {
        this.toastr.error(this.translate.instant('Not a valid number in Convection Setting !'), 'Error');
        break;
      } else if (!this.isInRangeOutput(value, this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MIN,
        this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Convection Setting ') +
          ' (' + this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MIN +
          ' : ' + this.operatingSetting.studyEquipment.minMaxVc.LIMIT_MAX + ') !', 'Error');
          break;
      }
    }
    if (this.alphaTopFix) {
      this.validate(this.alphaTop, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Top');
    }
    if (this.alphaBottomFix) {
      this.validate(this.alphaBottom, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Bottom');
    }
    if (this.alphaLeftFix) {
      this.validate(this.alphaLeft, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Left');
    }
    if (this.alphaRightFix) {
      this.validate(this.alphaRight, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Right');
    }
    if (this.alphaFrontFix) {
      this.validate(this.alphaFront, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Front');
    }
    if (this.alphaRearFix) {
      this.validate(this.alphaRear, this.operatingSetting.studyEquipment.minMaxAlpha, 'Alpha Rear');
    }
    this.validate(this.operatingSetting.studyEquipment.TExt, this.operatingSetting.studyEquipment.minMaxText, 'Gas temperature');
    const params: Models.OperatingSettingParam = {
      eid: this.eid,
      tr: this.trValue,
      ts: this.tsValue,
      vc: this.vcValue,
      TExt: this.operatingSetting.studyEquipment.TExt,
      calculation_parameter: {
        STUDY_ALPHA_TOP: this.alphaTop,
        STUDY_ALPHA_BOTTOM: this.alphaBottom,
        STUDY_ALPHA_LEFT: this.alphaLeft,
        STUDY_ALPHA_RIGHT: this.alphaRight,
        STUDY_ALPHA_FRONT: this.alphaFront,
        STUDY_ALPHA_REAR: this.alphaRear,
        STUDY_ALPHA_TOP_FIXED: this.alphaTopFix,
        STUDY_ALPHA_BOTTOM_FIXED: this.alphaBottomFix,
        STUDY_ALPHA_LEFT_FIXED: this.alphaLeftFix,
        STUDY_ALPHA_RIGHT_FIXED: this.alphaRightFix,
        STUDY_ALPHA_FRONT_FIXED: this.alphaFrontFix,
        STUDY_ALPHA_REAR_FIXED: this.alphaRearFix
      }
    };
    this.api.saveEquipmentData({
      id: this.operatingSetting.studyEquipment.ID_STUDY_EQUIPMENTS,
      body: params
    }).subscribe(
      data => {
        console.log(data);
        this.inputModal.hide();
      }
    );
  }

  equipEditLayout(equip: Models.ViewStudyEquipment, index: number) {
    this.eid = index;
    this.equipment = equip;
    this.editLayoutForm = {
      stdEquipId: equip.ID_STUDY_EQUIPMENTS,
      orientation: equip.ORIENTATION
    };
    this.editLayoutForm.lengthInterval = equip.layoutGen.LENGTH_INTERVAL;
    if (equip.layoutGen.LENGTH_INTERVAL < 0) {
      this.editLayoutForm.lengthInterval = this.unitData.IntervalLength;
    }
    this.editLayoutForm.widthInterval = equip.layoutGen.WIDTH_INTERVAL;
    if (equip.layoutGen.WIDTH_INTERVAL < 0) {
      this.editLayoutForm.widthInterval = this.unitData.IntervalWidth;
    }
    console.log(equip);
    this.api.getStudyEquipmentLayoutById(equip.ID_STUDY_EQUIPMENTS).subscribe(
      data => {
        this.editModal.show();
        setTimeout(function() {
          console.log(data);
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
    this.laddaUpdateLayout = true;
    this.api.updateStudyEquipmentLayout({
      id: this.editLayoutForm.stdEquipId,
      body: {
        lengthInterval: this.editLayoutForm.lengthInterval,
        widthInterval: this.editLayoutForm.widthInterval,
        orientation: this.editLayoutForm.orientation,
        studyClean: true
      }
    }).subscribe(
      (resp) => {
        this.api.getStudyEquipmentLayoutById(this.editLayoutForm.stdEquipId).subscribe(
          data => {
            const img = <HTMLImageElement>document.getElementById('stdEqpLayoutImg');
            img.src = data;
          }
        );
        this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
          (equips: Models.ViewStudyEquipment[]) => {
            this.laddaDeletingStudyEquip = new Array<boolean>(equips.length);
            this.laddaDeletingStudyEquip.fill(false);
            this.equipmentsView = equips;
            console.log(this.equipmentsView);
            for (let i = 0; i < Object.keys(this.equipmentsView).length; i++) {
              if (this.equipmentsView[i].ID_STUDY_EQUIPMENTS === this.editLayoutForm.stdEquipId) {
                this.equipment = this.equipmentsView[i];
              }
            }
            console.log(this.equipment);
            this.laddaUpdateLayout = false;
            this.toastr.success(this.translate.instant('Update Success'), 'successfully');
          },
          (err) => {
            console.log(err);
          },
          () => {
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

  onChainingControlsLoaded() {
    this.chainingControls.showEquipment();
  }

  studyModifiable() {
    if (typeof this.study === 'undefined' && this.study == null ) { return false; }
    const owned = this.auth.user().ID_USER === this.study.ID_USER;
    return owned && ((!this.study.CHAINING_CONTROLS) || (!this.study.HAS_CHILD));
  }

  closeEditModal() {
    this.editModal.hide();
    this.refreshView();
  }

  validate(value: Number, minmax: Models.MinMax, name) {
    if (!value) {
      this.toastr.error(this.translate.instant('Enter a value in') + ' ' + this.translate.instant(name) + ' !', 'Error');
      return;
    } else if (!this.isNumberic(value)) {
      this.toastr.error(this.translate.instant('Not a valid number in') + ' ' + this.translate.instant(name) + ' !', 'Error');
      return;
    } else if (!this.isInRangeOutput(value, minmax.LIMIT_MIN, minmax.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in') + ' ' + this.translate.instant(name) +
        ' (' + minmax.LIMIT_MIN + ' : ' + minmax.LIMIT_MAX + ') !', 'Error');
        return;
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

  getCapability(capabilities, capMask) {
    /* tslint:disable */
    if ((Number(capabilities) & Number(capMask)) !== 0) {
        return true;
    } else {
        return false;
    }
  }
}
