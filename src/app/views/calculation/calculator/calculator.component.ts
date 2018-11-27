import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ViewChild, Output } from '@angular/core';
import { ApiService } from '../../../api/services';
import { CalculatorService } from '../../../api/services/calculator.service';
import { ChainingService } from '../../../api/services/chaining.service';
import { OptimumCalculator } from '../../../api/models/optimum-calculator';
import { BrainCalculator } from '../../../api/models/brain-calculator';
import { Study } from '../../../api/models/study';
import { ViewBrainOptim } from '../../../api/models/view-brain-optim';
import { ViewProgressBar, ProgressBar } from '../../../api/models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Units, ModelChaining } from '../../../api/models';
import { isNullOrUndefined } from 'util';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { TranslateService } from '@ngx-translate/core';
// import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('calcModal') calcModal;
  @ViewChild('estimationMode') estimationMode;
  @ViewChild('brainCalculate') brainCalculate;
  @ViewChild('refineModal') refineMode;
  @ViewChild('calculWithoutOpti') calculWithoutOpti;
  @ViewChild('calculWithOpti') calculWithOpti;
  @ViewChild('brainOptimum') brainOptimum;
  @Output() finishCalculate: EventEmitter<any> = new EventEmitter();
  public showSetting = false;
  public calculate: OptimumCalculator;
  public brainCalculator: BrainCalculator;
  public study: Study;
  public brainOptim: ViewBrainOptim;
  public laddaIsCalculating = false;
  public isLoading = false;
  public progressbar: ViewProgressBar;
  public studyEquipment: {
    id?: number,
    optimized?: boolean,
    typeCalculate?: number
  };
  public temperatureSymbol = '';
  public timeSymbol = '';
  public meshesSymbol = '';
  public listUnits: Array<Units>;
  public valueProgressBar: ProgressBar;
  public displayProgressBar;
  public clearParent: ModelChaining;
  public dataProgress = 0;


  constructor(private modalService: BsModalService, private api: ApiService, private router: Router,
      private apicalculator: CalculatorService, private toastr: ToastrService, private translate: TranslateService,
      private apichaining: ChainingService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));
    if (this.listUnits) {
      for (let i = 0; i < this.listUnits.length; i++) {
        if (Number(this.listUnits[i].TYPE_UNIT) === 8) {
          this.temperatureSymbol = this.listUnits[i].SYMBOL;
        }
        if (Number(this.listUnits[i].TYPE_UNIT) === 5) {
          this.timeSymbol = this.listUnits[i].SYMBOL;
        }
        if (Number(this.listUnits[i].TYPE_UNIT) === 20) {
          this.meshesSymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  ngOnDestroy() {
    this.stopTrackingLoop();
  }

  ngAfterViewInit() {
  }

  open() {
    this.isLoading = true;

    const params: CalculatorService.GetOptimumCalculatorParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null
    };

    if (Number(this.study.CALCULATION_MODE) === 1) {
      this.isLoading = false;
      this.estimationMode.show();
      // this.loadProgressBar();
      // this.brainOptimum.show();
    } else if (Number(this.study.CALCULATION_MODE) === 2) {
      this.isLoading = false;
      this.calcModal.show();
    } else if (Number(this.study.CALCULATION_MODE) === 3) {
      this.apicalculator.getOptimumCalculator(params).subscribe(
        data => {
          this.calculate = data;
          if (Number(data.timeStep) === -1) {
            swal('Warning', this.translate.instant('All equipments selected to be calculated have some results.' +
            'Please, go to analytic results output.'), 'error');
            this.router.navigate(['/output/preliminary']);
            this.calcModal.hide();
          }

          this.calcModal.show();
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
      this.loadProgressBar();
    }
  }

  openRefine(idStudyEquipment: number, isOptimized: boolean, type: number) {
    this.isLoading = true;
    const params: ApiService.GetStudyEquipmentCalculationParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: idStudyEquipment,
      checkOptim: isOptimized,
      type: type
    };

    this.api.getStudyEquipmentCalculation(params).subscribe(
      data => {
        // console.log(data);
        this.brainCalculator = data;
        localStorage.setItem('studyEquipment', JSON.stringify({ id: idStudyEquipment, optimized: isOptimized, typeCalculate: type }));
        this.isLoading = false;
        this.refineMode.show();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  openBrain(idStudyEquipment: number) {
    this.isLoading = true;
    const params: ApiService.GetStudyEquipmentCalculationParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: idStudyEquipment,
      checkOptim: null,
      type: null
    };

    this.api.getStudyEquipmentCalculation(params).subscribe(
      data => {
        // console.log(data);
        this.brainCalculator = data;
        localStorage.setItem('studyEquipment', JSON.stringify({ id: idStudyEquipment, optimized: null }));
        this.brainCalculate.show();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  openSetting() {
    const table = <HTMLElement>document.getElementById('optimumSettings');
    this.showSetting = !this.showSetting;
    if (this.showSetting) {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }

  hideSetting() {
    const table = <HTMLElement>document.getElementById('brainSetting');
    this.showSetting = !this.showSetting;
    if (this.showSetting) {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }

  checkCalculationParameters() {
    // interval
    this.startTrackingLoop();

    if (Number(this.calculate.checkOptim) === 1) {
      if (isNullOrUndefined(this.calculate.epsilonTemp) || String(this.calculate.epsilonTemp) === ''
      || isNaN(this.calculate.epsilonTemp)) {
        this.toastr.error(this.translate.instant('Please specify Temperature margin'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.epsilonEnth) || String(this.calculate.epsilonEnth) === ''
      || isNaN(this.calculate.epsilonEnth)) {
        this.toastr.error(this.translate.instant('Please specify Enthalpy error'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.nbOptimIter) || String(this.calculate.nbOptimIter) === ''
      || isNaN(this.calculate.nbOptimIter)) {
        this.toastr.error(this.translate.instant('Please specify Number of iterations'), 'Error');
        return;
      }
    }

    if (Number(this.calculate.sdisableTimeStep) !== 1) {
      if (isNullOrUndefined(this.calculate.timeStep) || String(this.calculate.timeStep) === ''
     || isNaN(this.calculate.timeStep)) {
        this.toastr.error(this.translate.instant('Please specify Time Step'), 'Error');
        return;
      }
    }

    if (Number(this.calculate.sdisablePrecision) !== 1) {
      if (isNullOrUndefined(this.calculate.precision) || String(this.calculate.precision) === ''
       || isNaN(this.calculate.precision)) {
        this.toastr.error(this.translate.instant('Please specify Precision of numerical modelling'), 'Error');
        return;
      }
    }

    if (Number(this.calculate.sdisableNbOptim) !== 1) {
      if (isNullOrUndefined(this.calculate.storagestep) || String(this.calculate.storagestep) === ''
       || isNaN(this.calculate.storagestep)) {
        this.toastr.error(this.translate.instant('Please specify Step'), 'Error');
        return;
      }
    }

    if (Number(this.calculate.sdisableFields) !== 1) {
      if (isNullOrUndefined(this.calculate.maxIter) || String(this.calculate.maxIter) === ''
       || isNaN(this.calculate.maxIter)) {
        this.toastr.error(this.translate.instant('Please specify Max of iterations'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.relaxCoef) || String(this.calculate.relaxCoef) === ''
       || isNaN(this.calculate.relaxCoef)) {
        this.toastr.error(this.translate.instant('Please specify Coef. of relaxation'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.tempPtSurf) || String(this.calculate.tempPtSurf) === ''
       || isNaN(this.calculate.tempPtSurf)) {
        this.toastr.error(this.translate.instant('Please specify Surface'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.tempPtIn) || String(this.calculate.tempPtIn) === ''
       || isNaN(this.calculate.tempPtIn)) {
        this.toastr.error(this.translate.instant('Please specify Internal'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.tempPtBot) || String(this.calculate.tempPtBot) === ''
       || isNaN(this.calculate.tempPtBot)) {
        this.toastr.error(this.translate.instant('Please specify Bottom'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.calculate.tempPtAvg) || String(this.calculate.tempPtAvg) === ''
       || isNaN(this.calculate.tempPtAvg)) {
        this.toastr.error(this.translate.instant('Please specify Average'), 'Error');
        return;
      }
    }

    this.apicalculator.checkCalculationParameters({
      checkOptim: Number(this.calculate.checkOptim),
      epsilonTemp: Number(this.calculate.epsilonTemp),
      epsilonEnth: Number(this.calculate.epsilonEnth),
      nbOptimIter: Number(this.calculate.nbOptimIter),

      timeStep: Number(this.calculate.timeStep),
      precision: Number(this.calculate.precision),
      scheckStorage: Number(this.calculate.scheckStorage),
      sdisableOptim: Number(this.calculate.sdisableOptim),
      storagestep: Number(this.calculate.storagestep),

      hRadioOn: Number(this.calculate.hRadioOn),
      vRadioOn: Number(this.calculate.vRadioOn),

      maxIter: Number(this.calculate.maxIter),
      relaxCoef: Number(this.calculate.relaxCoef),
      tempPtSurf: Number(this.calculate.tempPtSurf),
      tempPtIn: Number(this.calculate.tempPtIn),
      tempPtBot: Number(this.calculate.tempPtBot),
      tempPtAvg: Number(this.calculate.tempPtAvg),
      sdisableFields: Number(this.calculate.sdisableFields),
      sdisableCalculate: Number(this.calculate.sdisableCalculate),
      sdisableNbOptim: Number(this.calculate.sdisableNbOptim),
      sdisableTimeStep: Number(this.calculate.sdisableTimeStep),
      sdisablePrecision: Number(this.calculate.sdisablePrecision),
      sdisableStorage: Number(this.calculate.sdisableStorage),

    }).subscribe(
      (res) => {
        // console.log(res);
        if (res === 1) {
          this.startCalculate();
          this.calcModal.hide();
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        // console.log(err);
      },
      () => {
      }
      );
  }

  startCalculate() {
    this.brainOptimum.show();
    this.laddaIsCalculating = true;
    this.apicalculator.startCalculate({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null,
      checkOptim: Number(this.calculate.checkOptim),
      epsilonTemp: Number(this.calculate.epsilonTemp),
      epsilonEnth: Number(this.calculate.epsilonEnth),
      nbOptimIter: Number(this.calculate.nbOptimIter),
      timeStep: Number(this.calculate.timeStep),
      precision: Number(this.calculate.precision),
      scheckStorage: Number(this.calculate.scheckStorage),
      sdisableOptim: Number(this.calculate.sdisableOptim),
      storagestep: Number(this.calculate.storagestep),
      hRadioOn: Number(this.calculate.hRadioOn),
      vRadioOn: Number(this.calculate.vRadioOn),
      maxIter: Number(this.calculate.maxIter),
      relaxCoef: Number(this.calculate.relaxCoef),
      tempPtSurf: Number(this.calculate.tempPtSurf),
      tempPtIn: Number(this.calculate.tempPtIn),
      tempPtBot: Number(this.calculate.tempPtBot),
      tempPtAvg: Number(this.calculate.tempPtAvg),
      seValue1: Number(this.calculate.seValue1),
      seValue2: Number(this.calculate.seValue2),
      seValue3: Number(this.calculate.seValue3),
      seValue4: Number(this.calculate.seValue4),
      seValue5: Number(this.calculate.seValue5),
      seValue6: Number(this.calculate.seValue6),
      seValue7: Number(this.calculate.seValue7),
      seValue8: Number(this.calculate.seValue8),
      seValue9: Number(this.calculate.seValue9),
      sdisableFields: Number(this.calculate.sdisableFields),
      sdisableCalculate: Number(this.calculate.sdisableCalculate),
      sdisableNbOptim: Number(this.calculate.sdisableNbOptim),
      sdisableTimeStep: Number(this.calculate.sdisableTimeStep),
      sdisablePrecision: Number(this.calculate.sdisablePrecision),
      sdisableStorage: Number(this.calculate.sdisableStorage),

    }).subscribe(
      (res) => {
        // console.log(res);
        this.laddaIsCalculating = false;
        let success = true;
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          if (element !== 0) {
            success = false;
            break;
          }
        }
        if (success) {
          // this.brainOptimum.hide();
          this.router.navigate(['/output/preliminary']);
        } else {
          this.router.navigate(['/calculation/calculation-status']);
        }
      },
      err => {
        if (err.length > 0) {
          this.router.navigate(['/calculation/calculation-status']);
        }
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
      );
  }

  startEstimation() {
    this.laddaIsCalculating = true;
    // if (this.study.OPTION_CRYOPIPELINE) {
    //   swal('Warning', 'This calculate does not have enabled CryoPipeline calculation option', 'error');
    //   this.router.navigate(['/input/objectives']);
    // }

    if (this.study.OPTION_EXHAUSTPIPELINE) {
      swal('Warning', this.translate.instant('This calculate does not have enabled ExhaustPipeline' +
       ' calculation option'), 'error');
      this.router.navigate(['/input/objectives']);
    }

    this.api.startStudyCalculation(this.study.ID_STUDY).subscribe(
      (resp: any[]) => {
        this.laddaIsCalculating = false;
        let success = true;
        for (let i = 0; i < resp.length; i++) {
          const element = resp[i];
          if (element !== 0) {
            success = false;
            break;
          }
        }
        if (success) {
          this.router.navigate(['/output/preliminary']);
        } else {
          this.router.navigate(['/calculation/calculation-status']);
        }
      },
      err => {
        if (err.length > 0) {
          this.router.navigate(['/calculation/calculation-status']);
        }
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
    );
  }

  checkBrainCalculationParameters() {
    if (Number(this.brainCalculator.typeCalculate) !== 3 || Number(this.brainCalculator.sdisableTS) !== 1) {
      for (let i = 0 ; i < this.brainCalculator.dwellingTimes.length; i++ ) {
        if (isNullOrUndefined(this.brainCalculator.dwellingTimes[i].value) || String(this.brainCalculator.dwellingTimes[i].value) === ''
        || isNaN(this.brainCalculator.dwellingTimes[i].value)) {
          this.toastr.error(this.translate.instant('Please specify Residence / Dwell time'), 'Error');
          return;
        }
      }
    }

    if (Number(this.brainCalculator.sdisableTR) !== 1) {
      for (let i = 0 ; i < this.brainCalculator.temperatures.length; i++ ) {
        if (isNullOrUndefined(this.brainCalculator.temperatures[i].value) || String(this.brainCalculator.temperatures[i].value) === ''
        || isNaN(this.brainCalculator.temperatures[i].value)) {
          this.toastr.error(this.translate.instant('Please specify Control temperature'), 'Error');
          return;
        }
      }
    }

    if (Number(this.brainCalculator.typeCalculate) !== 1 || Number(this.brainCalculator.typeCalculate) !== 2
    ||  Number(this.brainCalculator.sdisableTOC) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.toc) || String(this.brainCalculator.toc) === ''
      || isNaN(this.brainCalculator.toc)) {
        this.toastr.error(this.translate.instant('Please specify Loading rate'), 'Error');
        return;
      }
    }

    if (Number(this.brainCalculator.checkOptim) === 1 || Number(this.brainCalculator.sdisableOptim)) {
      if (isNullOrUndefined(this.brainCalculator.epsilonTemp) || String(this.brainCalculator.epsilonTemp) === ''
      || isNaN(this.brainCalculator.epsilonTemp)) {
        this.toastr.error(this.translate.instant('Please specify Temperature margin'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.epsilonEnth) || String(this.brainCalculator.epsilonEnth) === ''
      || isNaN(this.brainCalculator.epsilonEnth)) {
        this.toastr.error(this.translate.instant('Please specify Enthalpy error'), 'Error');
        return;
      }
    }

    if (Number(this.brainCalculator.checkOptim) === 1 || Number(this.brainCalculator.typeCalculate) !== 3
    || Number(this.brainCalculator.sdisableNbOptim) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.nbOptimIter) || String(this.brainCalculator.nbOptimIter) === ''
      || isNaN(this.brainCalculator.nbOptimIter)) {
        this.toastr.error(this.translate.instant('Please specify Number of iterations'), 'Error');
        return;
      }
    }

    if (Number(this.brainCalculator.sdisableTimeStep) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.timeStep) || String(this.brainCalculator.timeStep) === ''
     || isNaN(this.brainCalculator.timeStep)) {
        this.toastr.error(this.translate.instant('Please specify Time Step'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.precision) || String(this.brainCalculator.precision) === ''
        || isNaN(this.brainCalculator.precision)) {
        this.toastr.error(this.translate.instant('Please specify Precision of numerical modelling'), 'Error');
        return;
      }
    }

    if (Number(this.brainCalculator.scheckStorage) === 1 || Number(this.brainCalculator.sdisableStorage) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.storagestep) || String(this.brainCalculator.storagestep) === ''
       || isNaN(this.brainCalculator.storagestep)) {
        this.toastr.error(this.translate.instant('Please specify Step'), 'Error');
        return;
      }
    }

    if (Number(this.brainCalculator.sdisableFields) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.maxIter) || String(this.brainCalculator.maxIter) === ''
       || isNaN(this.brainCalculator.maxIter)) {
        this.toastr.error(this.translate.instant('Please specify Max of iterations'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.relaxCoef) || String(this.brainCalculator.relaxCoef) === ''
       || isNaN(this.brainCalculator.relaxCoef)) {
        this.toastr.error(this.translate.instant('Please specify Coef. of relaxation'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtSurf) || String(this.brainCalculator.tempPtSurf) === ''
       || isNaN(this.brainCalculator.tempPtSurf)) {
        this.toastr.error(this.translate.instant('Please specify Surface'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtIn) || String(this.brainCalculator.tempPtIn) === ''
       || isNaN(this.brainCalculator.tempPtIn)) {
        this.toastr.error(this.translate.instant('Please specify Internal'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtBot) || String(this.brainCalculator.tempPtBot) === ''
       || isNaN(this.brainCalculator.tempPtBot)) {
        this.toastr.error(this.translate.instant('Please specify Bottom'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtAvg) || String(this.brainCalculator.tempPtAvg) === ''
       || isNaN(this.brainCalculator.tempPtAvg)) {
        this.toastr.error(this.translate.instant('Please specify Average'), 'Error');
        return;
      }
    }

    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    this.apicalculator.checkBrainCalculationParameters({
      idStudyEquipment: Number(this.studyEquipment.id),
      typeCalculate: this.studyEquipment.typeCalculate,
      dwellingTimes: this.brainCalculator.dwellingTimes,
      temperatures: this.brainCalculator.temperatures,
      toc: this.brainCalculator.toc,
      checkOptim: Number(this.studyEquipment.optimized),
      epsilonTemp: Number(this.brainCalculator.epsilonTemp),
      epsilonEnth: Number(this.brainCalculator.epsilonEnth),
      nbOptimIter: Number(this.brainCalculator.nbOptimIter),
      timeStep: this.brainCalculator.timeStep,
      precision: this.brainCalculator.precision,
      scheckStorage: this.brainCalculator.scheckStorage,
      storagestep: Number(this.brainCalculator.storagestep),
      hRadioOn: Number(this.brainCalculator.hRadioOn),
      vRadioOn: Number(this.brainCalculator.vRadioOn),
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      sdisableFields: Number(this.brainCalculator.sdisableFields),
      sdisableCalculate: Number(this.brainCalculator.sdisableCalculate),
      sdisableNbOptim: Number(this.brainCalculator.sdisableNbOptim),
      sdisableTimeStep: Number(this.brainCalculator.sdisableTimeStep),
      sdisablePrecision: Number(this.brainCalculator.sdisablePrecision),
      sdisableStorage: Number(this.brainCalculator.sdisableStorage),
      sdisableTS: Number(this.brainCalculator.sdisableTS),
      sdisableTR: Number(this.brainCalculator.sdisableTR),
      sdisableTOC: Number(this.brainCalculator.sdisableTOC),
    }).subscribe(
      (res) => {
        if (res === 1) {
          this.startBrainOptimumCalculate();
          this.finishCalculate.emit(res);
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        console.log(err);
      },
      () => {
        // check chaning recalculated
        if (this.study && this.study.CHAINING_CONTROLS && this.study.HAS_CHILD) {
          this.apichaining.clearParentChaining(this.study.ID_STUDY).subscribe(
            data => {
              this.clearParent = data;
            },
            err => {
              console.log(err);
            },
            () => {
              swal('Warning', this.translate.instant('This study is a parent for other studies (chaining).' +
            'You should open and calculate again these studies: ' + this.clearParent.studyName), 'error');
            }
          );
        }
      }
    );
  }

  startBrainOptimumCalculate() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    // console.log(this.studyEquipment);
    this.laddaIsCalculating = true;
    this.api.startBrainCalculate({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.studyEquipment.id,
      checkOptim: this.studyEquipment.optimized,
      scheckOptim: this.brainCalculator.scheckOptim,
      typeCalculate: this.studyEquipment.typeCalculate,
      dwellingTimes: this.brainCalculator.dwellingTimes,
      temperatures: this.brainCalculator.temperatures,
      toc: this.brainCalculator.toc,
      epsilonEnth: this.brainCalculator.epsilonEnth,
      epsilonTemp: this.brainCalculator.epsilonTemp,
      timeStep: this.brainCalculator.timeStep,
      precision: this.brainCalculator.precision,
      scheckStorage: this.brainCalculator.scheckStorage,
      storagestep: Number(this.brainCalculator.storagestep),
      hRadioOn: Number(this.brainCalculator.hRadioOn),
      vRadioOn: Number(this.brainCalculator.vRadioOn),
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      seValue1: Number(this.brainCalculator.seValue1),
      seValue2: Number(this.brainCalculator.seValue2),
      seValue3: Number(this.brainCalculator.seValue3),
      seValue4: Number(this.brainCalculator.seValue4),
      seValue5: Number(this.brainCalculator.seValue5),
      seValue6: Number(this.brainCalculator.seValue6),
      seValue7: Number(this.brainCalculator.seValue7),
      seValue8: Number(this.brainCalculator.seValue8),
      seValue9: Number(this.brainCalculator.seValue9),
    }).subscribe(
      (response) => {
        this.laddaIsCalculating = false;
        let success = true;

        if (response !== 0) {
          success = false;
        }

        if (success) {
          this.router.navigate(['/output/preliminary']);
          this.refineMode.hide();
          this.finishCalculate.emit(success);
        } else {
          this.router.navigate(['/calculation/calculation-status']);
        }
      },
      err => {
        if (err.length > 0) {
          this.router.navigate(['/calculation/calculation-status']);
        }
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
    );
  }

  checkStartCalculationParameters(check) {

    if (Number(this.brainCalculator.sdisableFields) !== 1) {
      if (isNullOrUndefined(this.brainCalculator.maxIter) || String(this.brainCalculator.maxIter) === ''
       || isNaN(this.brainCalculator.maxIter)) {
        this.toastr.error(this.translate.instant('Please specify Max of iterations'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.relaxCoef) || String(this.brainCalculator.relaxCoef) === ''
       || isNaN(this.brainCalculator.relaxCoef)) {
        this.toastr.error(this.translate.instant('Please specify Coef. of relaxation'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.precision) || String(this.brainCalculator.precision) === ''
        || isNaN(this.brainCalculator.precision)) {
        this.toastr.error(this.translate.instant('Please specify Precision of numerical modelling'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtSurf) || String(this.brainCalculator.tempPtSurf) === ''
       || isNaN(this.brainCalculator.tempPtSurf)) {
        this.toastr.error(this.translate.instant('Please specify Surface'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtIn) || String(this.brainCalculator.tempPtIn) === ''
       || isNaN(this.brainCalculator.tempPtIn)) {
        this.toastr.error(this.translate.instant('Please specify Internal'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtBot) || String(this.brainCalculator.tempPtBot) === ''
       || isNaN(this.brainCalculator.tempPtBot)) {
        this.toastr.error(this.translate.instant('Please specify Bottom'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.tempPtAvg) || String(this.brainCalculator.tempPtAvg) === ''
       || isNaN(this.brainCalculator.tempPtAvg)) {
        this.toastr.error(this.translate.instant('Please specify Average'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.precisionlogstep) || String(this.brainCalculator.precisionlogstep) === ''
      || isNaN(this.brainCalculator.precisionlogstep) || !isInteger(Number(this.brainCalculator.precisionlogstep)) ) {
       this.toastr.error(this.translate.instant('Please specify Precision log step'), 'Error');
       return;
      }

      if (isNullOrUndefined(this.brainCalculator.timeStep) || String(this.brainCalculator.timeStep) === ''
      || isNaN(this.brainCalculator.timeStep)) {
        this.toastr.error(this.translate.instant('Please specify Time Step'), 'Error');
        return;
      }

      if (isNullOrUndefined(this.brainCalculator.storagestep) || String(this.brainCalculator.storagestep) === ''
       || isNaN(this.brainCalculator.storagestep)) {
        this.toastr.error(this.translate.instant('Please specify Storage Step'), 'Error');
        return;
      }
    }

    this.apicalculator.checkStartCalculationParameters({
      dwellingTimes: this.brainCalculator.dwellingTimes,
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      precision: this.brainCalculator.precision,
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      precisionlogstep: Number(this.brainCalculator.precisionlogstep),
      storagestep: Number(this.brainCalculator.storagestep),
      timeStep: this.brainCalculator.timeStep,
      sdisableFields: Number(this.brainCalculator.sdisableFields),
    }).subscribe(
      (res) => {
        if (res === 1) {
          if (check === 1) {
            this.calculWithoutOpti.show();
            this.brainCalculate.hide();
            this.startBrainEstimationCalculate();
          } else if (check === 2) {
            this.calculWithOpti.show();
            this.brainCalculate.hide();
            this.saveCalculOptim();
            this.loadBrainOptim();
          }
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        // console.log(err);
      },
      () => {

      }
    );
  }

  startBrainEstimationCalculate() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    this.laddaIsCalculating = true;
    this.apicalculator.startCalcul({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.studyEquipment.id,
      hRadioOn: Number(this.brainCalculator.hRadioOn),
      vRadioOn: Number(this.brainCalculator.vRadioOn),
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      precision: Number(this.brainCalculator.precision),
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      precisionlogstep: Number(this.brainCalculator.precisionlogstep),
      timeStep: Number(this.brainCalculator.timeStep),
      storagestep: Number(this.brainCalculator.storagestep),
      select1: this.brainCalculator.select1,
      select2: this.brainCalculator.select2,
      select3: this.brainCalculator.select3,
      select4: this.brainCalculator.select4,
      select5: this.brainCalculator.select5,
      select6: this.brainCalculator.select6,
      select7: this.brainCalculator.select7,
      select8: this.brainCalculator.select8,
      select9: this.brainCalculator.select9,
      seValue1: Number(this.brainCalculator.seValue1),
      seValue2: Number(this.brainCalculator.seValue2),
      seValue3: Number(this.brainCalculator.seValue3),
      seValue4: Number(this.brainCalculator.seValue4),
      seValue5: Number(this.brainCalculator.seValue5),
      seValue6: Number(this.brainCalculator.seValue6),
      seValue7: Number(this.brainCalculator.seValue7),
      seValue8: Number(this.brainCalculator.seValue8),
      seValue9: Number(this.brainCalculator.seValue9),
    }).subscribe(
      (response: any[]) => {
        this.laddaIsCalculating = false;
        let success = true;
        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          if (element !== 0) {
            success = false;
            break;
          }
        }

        if (success) {
          this.router.navigate(['/output/preliminary']);
          this.calculWithoutOpti.hide();
          this.finishCalculate.emit(success);
        } else {
          this.router.navigate(['/calculation/calculation-status']);
        }
      },
      err => {
        if (err.length > 0) {
          this.router.navigate(['/calculation/calculation-status']);
        }
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
    );
  }

  saveCalculOptim() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    this.apicalculator.calculOptim({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.studyEquipment.id,
      hRadioOn: Number(this.brainCalculator.hRadioOn),
      vRadioOn: Number(this.brainCalculator.vRadioOn),
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      precision: Number(this.brainCalculator.precision),
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      precisionlogstep: Number(this.brainCalculator.precisionlogstep),
      timeStep: Number(this.brainCalculator.timeStep),
      storagestep: Number(this.brainCalculator.storagestep),
      select1: this.brainCalculator.select1,
      select2: this.brainCalculator.select2,
      select3: this.brainCalculator.select3,
      select4: this.brainCalculator.select4,
      select5: this.brainCalculator.select5,
      select6: this.brainCalculator.select6,
      select7: this.brainCalculator.select7,
      select8: this.brainCalculator.select8,
      select9: this.brainCalculator.select9,
      seValue1: Number(this.brainCalculator.seValue1),
      seValue2: Number(this.brainCalculator.seValue2),
      seValue3: Number(this.brainCalculator.seValue3),
      seValue4: Number(this.brainCalculator.seValue4),
      seValue5: Number(this.brainCalculator.seValue5),
      seValue6: Number(this.brainCalculator.seValue6),
      seValue7: Number(this.brainCalculator.seValue7),
      seValue8: Number(this.brainCalculator.seValue8),
      seValue9: Number(this.brainCalculator.seValue9),
    }).subscribe(
      response => {

      },
      err => {

      },
      () => {
      }
    );
  }

  loadBrainOptim() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    this.apicalculator.getBrainOptim({
      idStudyEquipment: this.studyEquipment.id,
      brainoptim: null
    }).subscribe(
      data => {
        this.brainOptim = data;
        // console.log(data);
      },
      err => {

      },
      () => {
      }
    );
  }

  startBrainCalculOptim() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    this.laddaIsCalculating = true;
    this.apicalculator.startCalculOptim({
      BRAIN_OPTIM: this.brainOptim.BRAIN_OPTIM,
      BRAIN_OPTIM_COSTFIXED: this.brainOptim.BRAIN_OPTIM_COSTFIXED,
      BRAIN_OPTIM_DHPFIXED: this.brainOptim.BRAIN_OPTIM_DHPFIXED,
      BRAIN_OPTIM_TOPFIXED: this.brainOptim.BRAIN_OPTIM_TOPFIXED,
      BRAIN_OPTIM_TRFIXED: this.brainOptim.BRAIN_OPTIM_TRFIXED,
      BRAIN_OPTIM_TSFIXED: this.brainOptim.BRAIN_OPTIM_TSFIXED,
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.studyEquipment.id
    }).subscribe(
      (response: any[]) => {
        this.laddaIsCalculating = false;
        let success = true;
        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          if (element !== 0) {
            success = false;
            break;
          }
        }

        if (success) {
          this.calculWithOpti.hide();
          this.router.navigate(['/output/preliminary']);
          this.finishCalculate.emit(success);
        } else {
          this.router.navigate(['/calculation/calculation-status']);
        }
      },
      err => {
        if (err.length > 0) {
          this.router.navigate(['/calculation/calculation-status']);
        }
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
      }
    );
  }

  // Progress bar
  loadProgressBar() {
    this.apicalculator.getProgressBarStudyEquipment(this.study.ID_STUDY).subscribe(
      data => {
        this.progressbar = data;
      },
      err => {

      },
      () => {
        if (this.progressbar) {
          if (this.progressbar.studyEquipments[this.progressbar.studyEquipments.length - 1].BRAIN_PROCESS === 100) {
            this.stopTrackingLoop();
            this.router.navigate(['/output/preliminary']);
          }
        }
      }
    );
  }

  getTimeTnterval() {
    this.apicalculator.getValueProgressStudyEquipment(this.study.ID_STUDY).subscribe(
      data => {
        this.valueProgressBar = data;
        console.log(data);
      },
      err => {},
      () => {}
    );
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.loadProgressBar();
      // alert('Hello...');
    }, 9000);
  }

  startTrackingLoop() {
    const delay = 1000; // every 1 sec
    const count = 5; // process it 5 times
    this.displayProgressBar = setInterval(() => {
        // run code
        this.loadProgressBar();
    }, 5000);
  }

  stopTrackingLoop() {
    clearInterval(this.displayProgressBar);
    this.displayProgressBar = null;
  }
}
