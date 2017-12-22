import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';
import { CalculatorComponent } from '../../calculation/calculator/calculator.component';

@Component({
  selector: 'app-sizing',
  templateUrl: './sizing.component.html',
  styleUrls: ['./sizing.component.scss']
})
export class SizingComponent implements OnInit {
  @ViewChild('calculator') calculator: CalculatorComponent;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2011', '2012', '2013', '2014', '2015', '2016', '2017'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public lineChartData: Array<any> = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    // {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = ['0', '50', '100', '150', '200', '250', '300'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    { 
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
    
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor() { }

  ngOnInit() {
  }
  openSize(){
    const  size=<HTMLElement>document.getElementById('sizing');
    const  tem=<HTMLElement>document.getElementById('temPer');
    size.style.display='block';
    tem.style.display='none';
  }
  openTem(){
    const  size=<HTMLElement>document.getElementById('sizing');
    const  tem=<HTMLElement>document.getElementById('temPer');
    size.style.display='none';
    tem.style.display='block';
  }

}
