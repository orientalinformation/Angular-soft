import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../../api/services';
import { OptimumCalculator } from '../../../api/models/optimum-calculator';
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
  public showSetting = false;
  public calculate: OptimumCalculator;
  public study: Study;
  public laddaIsCalculating = false;

  constructor(private modalService: BsModalService, private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.study = JSON.parse(localStorage.getItem('study'));
    // const params: ApiService.GetOptimumCalculatorParams = {
    //   idStudy: this.study.ID_STUDY,
    //   idStudyEquipment: null
    // };
    // this.api.getOptimumCalculator(params).subscribe(
    //   data => {
    //     this.calculate = data;
    //     console.log(data);
    //   }
    // );
  }

  open() {
    this.study = JSON.parse(localStorage.getItem('study'));
    const params: ApiService.GetOptimumCalculatorParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null
    };

    // this.estimationMode.show();
    console.log(this.study.CALCULATION_MODE);

    if (this.study.CALCULATION_MODE == 1) {
      this.estimationMode.show();
    } else if (this.study.CALCULATION_MODE == 2) {
      this.brainCalculate.show();
    } else if (this.study.CALCULATION_MODE == 3) {
      this.calcModal.show();
    }

    this.api.getOptimumCalculator(params).subscribe(
      data => {
        this.calculate = data;
        console.log(data);
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
      response => {
        this.laddaIsCalculating = false;
        console.log(response);
      },
      err => {
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
      resp => {
        this.laddaIsCalculating = false;
        console.log(resp);
        if (resp == 0) {
          this.router.navigate(['/output/preliminary']);
        }
      },
      err => {

      }
    );
  }

  openRefine() {
    // TODO
  }

  openBrain() {
    //
  }
}
