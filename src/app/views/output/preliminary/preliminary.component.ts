import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OnChanges } from '@angular/core';

import { ViewChild } from '@angular/core';
import { CalculatorComponent } from '../../calculation/calculator/calculator.component';
import { StudyEquipment } from '../../../api/models/study-equipment';
import { Study } from '../../../api/models/study';
import { User } from '../../../api/models/user';
import { ApiService } from '../../../api/services';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import 'chart.piecelabel.js';

@Component({
  selector: 'app-preliminary',
  templateUrl: './preliminary.component.html',
  styleUrls: ['./preliminary.component.scss']
})
export class PreliminaryComponent implements OnInit, AfterViewInit {
  @ViewChild('comsumptionPieModal') public comsumptionPieModal: ModalDirective;

  public study;
  public user;
  public ecoEnable;
  public symbol;
  public resultAna;
  public headBalanceResults;
  public headBalanceMaxResults;
  public commonResults;
  public economicResults;
  public headBalanceResultsTr;
  public headBalanceResultsTr01;
  public headBalanceResultsTr02;

  public chartPieData = {
    name: '',
    percentProduct: 0,
    percentEquipmentPerm: 0,
    percentEquipmentDown: 0,
    percentLine: 0
  };

  public pieOptions;
  public pieLabels;
  public pieData;
  public pieChartType = 'pie';

  public pieColours: Array<any> = [
    { 
      backgroundColor: ['#0000FF', '#00BFBF', '#00FFFF', '#33CC33'],
    }
  ];

  @ViewChild('calculator') calculator: CalculatorComponent;
  constructor(private api: ApiService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }
  openPageHeat() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'block';
    pageCon.style.display = 'none';
    pageEco.style.display = 'none';
  }
  openPageCon() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'none';
    pageEco.style.display = 'none';
    pageCon.style.display = 'block';
  }
  openPageEco() {
    const page = <HTMLElement>document.getElementById('pageHeat');
    const pageCon = <HTMLElement>document.getElementById('pageConsumption');
    const pageEco = <HTMLElement>document.getElementById('pageEconomics');
    page.style.display = 'none';
    pageEco.style.display = 'block';
    pageCon.style.display = 'none';
  }
  openHeadBalacePage() {
    const headBalancePage = <HTMLElement>document.getElementById('headBalacePage');
    const headBalanceMaxPage = <HTMLElement>document.getElementById('headBalaceMaxPage');
    headBalancePage.style.display = 'block';
    headBalanceMaxPage.style.display = 'none';
  }
  openHeadBalaceMaxPage() {
    const headBalancePage = <HTMLElement>document.getElementById('headBalacePage');
    const headBalanceMaxPage = <HTMLElement>document.getElementById('headBalaceMaxPage');
    headBalancePage.style.display = 'none';
    headBalanceMaxPage.style.display = 'block';
  }
  openTrPage() {
    const trPage = <HTMLElement>document.getElementById('trPage');
    const trPage01 = <HTMLElement>document.getElementById('trPage01');
    const trPage02 = <HTMLElement>document.getElementById('trPage02');
    trPage.style.display = 'block';
    trPage01.style.display = 'none';
    trPage02.style.display = 'none';
  }
  openTrPage01() {
    const trPage = <HTMLElement>document.getElementById('trPage');
    const trPage01 = <HTMLElement>document.getElementById('trPage01');
    const trPage02 = <HTMLElement>document.getElementById('trPage02');
    trPage.style.display = 'none';
    trPage01.style.display = 'block';
    trPage02.style.display = 'none';
  }
  openTrPage02() {
    const trPage = <HTMLElement>document.getElementById('trPage');
    const trPage01 = <HTMLElement>document.getElementById('trPage01');
    const trPage02 = <HTMLElement>document.getElementById('trPage02');
    trPage.style.display = 'none';
    trPage01.style.display = 'none';
    trPage02.style.display = 'block';
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getSymbol(this.study.ID_STUDY).subscribe(
        data => {
          this.symbol = data;
        }
      );

      this.api.getProInfoStudy(this.study.ID_STUDY).subscribe(
        data => {
          this.resultAna = data;
        }
      );

      this.api.getProductById(this.study.ID_PROD).subscribe(
        data => {
          // console.log(data);
        }
      );

      if (this.study.CALCULATION_MODE == 1) {
        let params: ApiService.GetEstimationHeadBalanceParams = {
          idStudy: this.study.ID_STUDY,
          tr: 0
        };
        let params01: ApiService.GetEstimationHeadBalanceParams = {
          idStudy: this.study.ID_STUDY,
          tr: 1
        };
        let params02: ApiService.GetEstimationHeadBalanceParams = {
          idStudy: this.study.ID_STUDY,
          tr: 2
        };

        this.api.getEstimationHeadBalance(params).subscribe(
          data => {
            this.headBalanceResultsTr = data;
          }
        );
        this.api.getEstimationHeadBalance(params01).subscribe(
          data => {
            this.headBalanceResultsTr01 = data;
          }
        );
        this.api.getEstimationHeadBalance(params02).subscribe(
          data => {
            this.headBalanceResultsTr02 = data;
          }
        );
      } else {
        this.api.getOptimumHeadBalance(this.study.ID_STUDY).subscribe(
          data => {
            // console.log('get studies response:');
            console.log(data);
            this.headBalanceResults = data;
          },
          err => {
            console.log(err);
          }
        );

        this.api.getOptimumHeadBalanceMax(this.study.ID_STUDY).subscribe(
          data => {
            this.headBalanceMaxResults = data;
          },
          err => {
            console.log(err);
          }
        );
      }

      this.api.getAnalyticalConsumption(this.study.ID_STUDY).subscribe(
        data => {
          this.commonResults = data;
        }
      );

      this.api.getAnalyticalEconomic(this.study.ID_STUDY).subscribe(
        data => {
          this.economicResults = data;
        }
      );

    }
  }

  oncomsumptionPie(element) {
    this.chartPieData.name = element.equipName;
    this.chartPieData.percentProduct = element.percentProduct;
    this.chartPieData.percentEquipmentPerm = element.percentEquipmentPerm;
    this.chartPieData.percentEquipmentDown = element.percentEquipmentDown;
    this.chartPieData.percentLine = element.percentLine;

    this.pieOptions = {
      responsive: true,
      pieceLabel: {
          render: 'percentage',
          fontSize: 13,
          fontStyle: 'bold',
          fontColor: ['#fff', '#000', '#000', '#fff'],
          fontFamily: '"Lucida Console", Monaco, monospace',
      }
    };

    this.pieLabels = ['Product', 'Equipment(permanent)', 'Equipment(cooldonw)'];

    if (element.percentLine > 0) {
      this.pieLabels.push('Line');
    }

    this.pieData = [
      {
        data: [element.percentProduct, element.percentEquipmentPerm, element.percentEquipmentDown, element.percentLine]
      }
    ];

    this.comsumptionPieModal.show();
  }

}
