import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../../api/services';
import { OptimumCalculator } from '../../../api/models/optimum-calculator';
import { BrainCalculator } from '../../../api/models/brain-calculator';
import { Study } from '../../../api/models/study';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, AfterViewInit {
  @ViewChild('calcModal') calcModal;
  @ViewChild('estimationMode') estimationMode;
  @ViewChild('brainCalculate') brainCalculate;
  @ViewChild('refineModal') refineMode;
  public showSetting = false;
  public calculate: OptimumCalculator;
  public brainCalculator: BrainCalculator;
  public study: Study;
  public laddaIsCalculating = false;
  public isLoading = false;
  public studyEquipment: {
    id?: number,
    optimized?: boolean
  };

  constructor(private modalService: BsModalService, private api: ApiService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.isLoading = true;
  }

  ngAfterViewInit() {
  }

  open() {
    this.isLoading = true;

    const params: ApiService.GetOptimumCalculatorParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null
    };

    if (this.study.CALCULATION_MODE == 1) {
      this.isLoading = false;
      this.estimationMode.show();
    } else if (this.study.CALCULATION_MODE == 2) {
      this.isLoading = false;
      this.calcModal.show();
    } else if (this.study.CALCULATION_MODE == 3) {
      this.api.getOptimumCalculator(params).subscribe(
        data => {
          this.calculate = data;
          if (Number(data.timeStep) == -1) {
            swal('Oops..', 'All equipments selected to be calculated have some results. Please, go to analytic results output.', 'error');
            this.router.navigate(['/output/preliminary']);
          }
          console.log(data);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );

      this.calcModal.show();
    }
  }

  openRefine(idStudyEquipment: number, isOptimized: boolean) {
    this.isLoading = true;
    const params: ApiService.GetStudyEquipmentCalculationParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: idStudyEquipment,
      checkOptim: isOptimized,
    };

    this.api.getStudyEquipmentCalculation(params).subscribe(
      data => {
        this.brainCalculator = data;
        console.log(data);
        localStorage.setItem('studyEquipment', JSON.stringify({ id: idStudyEquipment, optimized: isOptimized }));
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
    this.refineMode.show();
  }

  openBrain(idStudyEquipment: number) {
    this.isLoading = true;
    const params: ApiService.GetStudyEquipmentCalculationParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: idStudyEquipment,
      checkOptim: null,
    };

    this.api.getStudyEquipmentCalculation(params).subscribe(
      data => {
        this.brainCalculator = data;
        console.log(data);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
    this.brainCalculate.show();
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

  startCalculate() {
    this.laddaIsCalculating = true;
    this.api.startCalculate({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null,
      scheckOptim: Number(this.calculate.scheckOptim),
      epsilonTemp: Number(this.calculate.epsilonTemp),
      epsilonEnth: Number(this.calculate.epsilonEnth),
      nbOptimIter: Number(this.calculate.nbOptimIter),
      timeStep: Number(this.calculate.timeStep),
      precision: Number(this.calculate.precision),
      scheckStorage: Number(this.calculate.scheckStorage),
      storagestep: Number(this.calculate.storagestep),
      hRadioOn: Number(this.calculate.hRadioOn),
      vRadioOn: Number(this.calculate.vRadioOn),
      maxIter: Number(this.calculate.maxIter),
      relaxCoef: Number(this.calculate.relaxCoef),
      tempPtSurf: Number(this.calculate.tempPtSurf),
      tempPtIn: Number(this.calculate.tempPtIn),
      tempPtBot: Number(this.calculate.tempPtBot),
      tempPtAvg: Number(this.calculate.tempPtAvg),
      select1: Number(this.calculate.select1),
      select2: Number(this.calculate.select2),
      select3: Number(this.calculate.select3),
      select4: Number(this.calculate.select4),
      select5: Number(this.calculate.select5),
      select6: Number(this.calculate.select6),
      select7: Number(this.calculate.select7),
      select8: Number(this.calculate.select8),
      select9: Number(this.calculate.select9),

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
    if (this.study.OPTION_CRYOPIPELINE) {
      swal('Oops..', 'This calculate does not have enabled CryoPipeline calculation option', 'error');
      this.router.navigate(['/input/objectives']);
    }

    if (this.study.OPTION_EXHAUSTPIPELINE) {
      swal('Oops..', 'This calculate does not have enabled ExhaustPipeline calculation option', 'error');
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

  startBrainOptimumCalculate() {
    this.studyEquipment = JSON.parse(localStorage.getItem('studyEquipment'));
    console.log(this.studyEquipment);
    this.laddaIsCalculating = true;
    this.api.startBrainCalculate({
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.studyEquipment.id,
      checkOptim: this.studyEquipment.optimized,
      dwellingTimes: this.brainCalculator.dwellingTimes,
      temperatures: this.brainCalculator.temperatures,
      toc: this.brainCalculator.toc,
      timeStep: this.brainCalculator.timeStep,
      precision: this.brainCalculator.precision,
      scheckStorage: this.brainCalculator.scheckStorage,
      storagestep: this.brainCalculator.storagestep,
      hRadioOn: Number(this.brainCalculator.hRadioOn),
      vRadioOn: Number(this.brainCalculator.vRadioOn),
      maxIter: Number(this.brainCalculator.maxIter),
      relaxCoef: Number(this.brainCalculator.relaxCoef),
      tempPtSurf: Number(this.brainCalculator.tempPtSurf),
      tempPtIn: Number(this.brainCalculator.tempPtIn),
      tempPtBot: Number(this.brainCalculator.tempPtBot),
      tempPtAvg: Number(this.brainCalculator.tempPtAvg),
      select1: Number(this.brainCalculator.select1),
      select2: Number(this.brainCalculator.select2),
      select3: Number(this.brainCalculator.select3),
      select4: Number(this.brainCalculator.select4),
      select5: Number(this.brainCalculator.select5),
      select6: Number(this.brainCalculator.select6),
      select7: Number(this.brainCalculator.select7),
      select8: Number(this.brainCalculator.select8),
      select9: Number(this.brainCalculator.select9),
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
          this.refineMode.hide();
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
}
