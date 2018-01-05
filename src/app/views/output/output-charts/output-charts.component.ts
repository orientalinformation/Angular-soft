import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-output-charts',
  templateUrl: './output-charts.component.html',
  styleUrls: ['./output-charts.component.scss']
})
export class OutputChartsComponent implements OnInit, AfterViewInit {

  constructor(private api: ApiService, private translate: TranslateService) { }

  public study;
  public symbol;
  public activePage = '';

  public outputProductChart;
  public headExchangeResult;
  public headExchangeCurve;

  public heatExchangeChartData;
  public heatExchangeChartOptions;
  public heatExchangeChartLegend = true;
  public heatExchangeChartType= 'line';
  public heatExchangeColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)'], }
  ];

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

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getSymbol(this.study.ID_STUDY).subscribe(
        data => {
          this.symbol = data;
          this.activePage = 'location';
        }
      );
    }
  }

  loadLocation() {
    this.activePage = 'location';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('location');
    const timeBasedPage = <HTMLElement>document.getElementById('location');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'block';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
  }

  loadheadExchage() {
    this.activePage = 'heatExchange';
    const showLoader = <HTMLElement>document.getElementById('showLoader');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'block';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        this.outputProductChart = data[0];
        const params: ApiService.HeatExchangeParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.heatExchange(params).subscribe(
          dataChart => {
            showLoader.style.display = 'none';
            console.log(dataChart);
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
                  display: true,
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
                          labelString: this.translate.instant(this.symbol.enthalpySymbol),
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
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
          }
        );
      }
    );
  }

  loadProductSection() {
    this.activePage = 'productSection';
    const showLoader = <HTMLElement>document.getElementById('showLoader');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'block';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
  }

  loadTimeBased() {
    this.activePage = 'timeBased';
    const showLoader = <HTMLElement>document.getElementById('showLoaderTimeBased');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'block';
    outlines2dPage.style.display = 'none';
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        this.outputProductChart = data[0];
        const params: ApiService.TimeBasedParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.timeBased(params).subscribe(
          dataTimeBased => {
            console.log(dataTimeBased);
            showLoader.style.display = 'none';
            this.timeBasedResult = dataTimeBased.result;
            this.timeBasedCurve = dataTimeBased.curve;
            this.timeBasedLabel = dataTimeBased.label;
            const chartDataObj =  this.timeBasedCurve;
            const chartData = [
              {data: JSON.parse(JSON.stringify(chartDataObj.top)), label: this.translate.instant('Top(' + this.timeBasedLabel.top + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.int)),
                      label: this.translate.instant('Internal(' + this.timeBasedLabel.int + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.bot)), label: this.translate.instant('Bottom(' + this.timeBasedLabel.bot + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.average)),
                      label: this.translate.instant('Average temperature'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2}
            ];
            this.timeBasedChartData =  chartData;
            console.log(this.timeBasedChartData);
            this.timeBasedChartOptions = {
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
                          labelString: this.translate.instant(this.symbol.temperatureSymbol),
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
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
          }
        );
      }
    );
  }

  loadOutlines2d() {
    this.activePage = 'outlines2d';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'block';
  }

}
