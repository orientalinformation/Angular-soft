import { Component, OnInit } from '@angular/core';
import { CalculationParametersDef } from '../../../api/models/calculation-parameters-def';
import { ApiService } from '../../../api/services';
import { Units } from '../../../api/models';
import { AfterViewInit } from '@angular/core';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined, isNumber } from 'util';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit, AfterViewInit {
  public calculationparametersdef: CalculationParametersDef;
  public laddaSavingcalculation = false;
  public isLoading = false;
  public listUnits: Array<Units>;
  public temperatureSymbol = '';
  public convectionCoeffSymbol = '';
  public timeSymbol = '';

  constructor(private api: ApiService, private toastr: ToastrService, private translate: TranslateService) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));
    if (this.listUnits) {
      for (let i = 0; i < this.listUnits.length; i++) {
        if (Number(this.listUnits[i].TYPE_UNIT) === 8) {
          this.temperatureSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 14) {
          this.convectionCoeffSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 5) {
          this.timeSymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.getSettingCaculation();
  }

  getSettingCaculation() {
    this.api.getMyCalculationParametersDef().subscribe(
      data => {
        data.VERT_SCAN_DEF = Number(data.VERT_SCAN_DEF);
        data.HORIZ_SCAN_DEF = Number(data.HORIZ_SCAN_DEF);
        data.STUDY_ALPHA_TOP_FIXED_DEF = Number(data.STUDY_ALPHA_TOP_FIXED_DEF);
        data.STUDY_ALPHA_BOTTOM_FIXED_DEF = Number(data.STUDY_ALPHA_BOTTOM_FIXED_DEF);
        data.STUDY_ALPHA_LEFT_FIXED_DEF = Number(data.STUDY_ALPHA_LEFT_FIXED_DEF);
        data.STUDY_ALPHA_RIGHT_FIXED_DEF = Number(data.STUDY_ALPHA_RIGHT_FIXED_DEF);
        data.STUDY_ALPHA_FRONT_FIXED_DEF = Number(data.STUDY_ALPHA_FRONT_FIXED_DEF);
        data.STUDY_ALPHA_REAR_FIXED_DEF = Number(data.STUDY_ALPHA_REAR_FIXED_DEF);
        data.STORAGE_STEP_DEF = Number(data.STORAGE_STEP_DEF);
        data.PRECISION_LOG_STEP_DEF = Number(data.PRECISION_LOG_STEP_DEF);
        this.calculationparametersdef = data;
        this.isLoading = false;
      }
    );
  }

  saveMyCalculationParametersDef() {
    if (isNullOrUndefined(this.calculationparametersdef.MAX_IT_NB_DEF) || String(this.calculationparametersdef.MAX_IT_NB_DEF) === ''
    || isNaN(this.calculationparametersdef.MAX_IT_NB_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Max of iterations'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.RELAX_COEFF_DEF) || String(this.calculationparametersdef.RELAX_COEFF_DEF) === ''
    || isNaN(this.calculationparametersdef.RELAX_COEFF_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Coef. of relaxation'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.PRECISION_REQUEST_DEF)
    || String(this.calculationparametersdef.PRECISION_REQUEST_DEF) === ''
    || isNaN(this.calculationparametersdef.PRECISION_REQUEST_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Precision of numerical modelling'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STOP_TOP_SURF_DEF) || String(this.calculationparametersdef.STOP_TOP_SURF_DEF) === ''
    || isNaN(this.calculationparametersdef.STOP_TOP_SURF_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Surface'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STOP_INT_DEF) || String(this.calculationparametersdef.STOP_INT_DEF) === ''
    || isNaN(this.calculationparametersdef.STOP_INT_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Internal'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STOP_BOTTOM_SURF_DEF)
    || String(this.calculationparametersdef.STOP_BOTTOM_SURF_DEF) === ''
    || isNaN(this.calculationparametersdef.STOP_BOTTOM_SURF_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Bottom'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STOP_AVG_DEF)
    || String(this.calculationparametersdef.STOP_AVG_DEF) === ''
    || isNaN(this.calculationparametersdef.STOP_AVG_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Average'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_TOP_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_TOP_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_TOP_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha top'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_BOTTOM_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_BOTTOM_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_BOTTOM_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha bottom'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_LEFT_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_LEFT_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_LEFT_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha left'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_RIGHT_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_RIGHT_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_RIGHT_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha right'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_FRONT_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_FRONT_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_FRONT_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha front'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STUDY_ALPHA_REAR_DEF)
    || String(this.calculationparametersdef.STUDY_ALPHA_REAR_DEF) === ''
    || isNaN(this.calculationparametersdef.STUDY_ALPHA_REAR_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Alpha rear'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.STORAGE_STEP_DEF)
    || String(this.calculationparametersdef.STORAGE_STEP_DEF) === ''
    || isNaN(this.calculationparametersdef.STORAGE_STEP_DEF) || !isInteger(Number(this.calculationparametersdef.STORAGE_STEP_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Storage step'), 'Error');
      return;
    }

    if (Number(this.calculationparametersdef.STORAGE_STEP_DEF) < 1
    || Number(this.calculationparametersdef.STORAGE_STEP_DEF) > 100000000) {
      this.toastr.error(this.translate.instant('Value out of range in Storage step (1 : 100000000) !'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.PRECISION_LOG_STEP_DEF)
    || String(this.calculationparametersdef.PRECISION_LOG_STEP_DEF) === ''
    || isNaN(this.calculationparametersdef.PRECISION_LOG_STEP_DEF)
    || !isInteger(Number(this.calculationparametersdef.PRECISION_LOG_STEP_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Precision log step'), 'Error');
      return;
    }

    if (Number(this.calculationparametersdef.PRECISION_LOG_STEP_DEF) < 1
    || Number(this.calculationparametersdef.PRECISION_LOG_STEP_DEF) > 100000000) {
      this.toastr.error(this.translate.instant('Value out of range in Precision log step (1 : 100000000) !'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.calculationparametersdef.TIME_STEP_DEF)
    || String(this.calculationparametersdef.TIME_STEP_DEF) === ''
    || isNaN(this.calculationparametersdef.TIME_STEP_DEF)) {
      this.toastr.error(this.translate.instant('Please specify Time Step'), 'Error');
      return;
    }
    this.laddaSavingcalculation = true;
    this.api.saveMyCalculationParametersDef({
      ishorizScanDef: Number(this.calculationparametersdef.HORIZ_SCAN_DEF),

      maxIter: Number(this.calculationparametersdef.MAX_IT_NB_DEF),
      relaxCoef: Number(this.calculationparametersdef.RELAX_COEFF_DEF),
      precision: Number(this.calculationparametersdef.PRECISION_REQUEST_DEF),

      isVertScanDef: Number(this.calculationparametersdef.VERT_SCAN_DEF),

      stopTopSurfDef: Number(this.calculationparametersdef.STOP_TOP_SURF_DEF),
      stopIntDef: Number(this.calculationparametersdef.STOP_INT_DEF),
      stopBottomSurfDef: Number(this.calculationparametersdef.STOP_BOTTOM_SURF_DEF),
      stopAvgDef: Number(this.calculationparametersdef.STOP_AVG_DEF),

      isStudyAlphaTopFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_TOP_FIXED_DEF),
      isStudyAlphaBottomFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_BOTTOM_FIXED_DEF),
      isStudyAlphaLeftFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_LEFT_FIXED_DEF),
      isStudyAlphaRightFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_RIGHT_FIXED_DEF),
      isStudyAlphaFrontFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_FRONT_FIXED_DEF),
      isStudyAlphaRearFixedDef: Number(this.calculationparametersdef.STUDY_ALPHA_REAR_FIXED_DEF),

      studyAlphaTopDef: Number(this.calculationparametersdef.STUDY_ALPHA_TOP_DEF),
      studyAlphaBottomDef: Number(this.calculationparametersdef.STUDY_ALPHA_BOTTOM_DEF),
      studyAlphaLeftDef: Number(this.calculationparametersdef.STUDY_ALPHA_LEFT_DEF),
      studyAlphaRightDef: Number(this.calculationparametersdef.STUDY_ALPHA_RIGHT_DEF),
      studyAlphaFrontDef: Number(this.calculationparametersdef.STUDY_ALPHA_FRONT_DEF),
      studyAlphaRearDef: Number(this.calculationparametersdef.STUDY_ALPHA_REAR_DEF),

      storageStepDef: Number(this.calculationparametersdef.STORAGE_STEP_DEF),
      precisionLogStepDef: Number(this.calculationparametersdef.PRECISION_LOG_STEP_DEF),
      timeStepDef: Number(this.calculationparametersdef.TIME_STEP_DEF)

    }).subscribe(
      res => {
        if (res === 1) {
          this.toastr.success('Save mesh setting completed', 'successfully');
          this.getSettingCaculation();
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        // console.log(err);
      },
      () => {
        this.laddaSavingcalculation = false;
      }
    );
  }

  resetTopValue() {
      this.calculationparametersdef.STUDY_ALPHA_TOP_DEF = 0;
  }

  resetBotvalue() {
      this.calculationparametersdef.STUDY_ALPHA_BOTTOM_DEF = 0;
  }

  resetLeftValue() {
      this.calculationparametersdef.STUDY_ALPHA_LEFT_DEF = 0;
  }

  resetRightValue() {
      this.calculationparametersdef.STUDY_ALPHA_RIGHT_DEF = 0;
  }

  resetFrontValue() {
      this.calculationparametersdef.STUDY_ALPHA_FRONT_DEF = 0;
  }

  resetRearValue() {
      this.calculationparametersdef.STUDY_ALPHA_REAR_DEF = 0;
  }
}
