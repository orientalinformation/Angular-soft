import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../../api/services';
import { OptimumCalculator } from '../../../api/models/optimum-calculator';
import { Study } from '../../../api/models/study';

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
  public calculate: OptimumCalculator[];
  public study: Study;

  constructor(private modalService: BsModalService, private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    const params: ApiService.GetOptimumCalculatorParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null
    };
    this.api.getOptimumCalculator(params).subscribe(
      data => {
        this.calculate = data;
        console.log(data);
      }
    );
  }

  open() {
    this.study = JSON.parse(localStorage.getItem('study'));
    const params: ApiService.GetOptimumCalculatorParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: null
    };

    if (this.study.CALCULATION_MODE === 1) {
      this.estimationMode.show();
    } else if (this.study.CALCULATION_MODE === 2) {
      this.brainCalculate.show();
    } else {
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
}
