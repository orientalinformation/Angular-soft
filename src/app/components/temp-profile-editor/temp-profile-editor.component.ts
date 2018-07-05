import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Point } from '../../api/models';
import { isUndefined } from 'util';

@Component({
  selector: 'app-temp-profile-editor',
  templateUrl: './temp-profile-editor.component.html',
  styleUrls: ['./temp-profile-editor.component.scss']
})
export class TempProfileEditorComponent implements OnInit {
  public loaded = false;
  public currentpos = null;
  public elt = null;
  public oTemp;
  public arrondir = 1;
  public tempMax = 100;
  public tempMin = -100;
  public x0 = 30;
  public tempCoeff = 1;
  public svgData = null;
  public nbValid;
  public svgx = 245;
  public yTemp = [];
  public defZero = 0;
  public size = null;
  public tempDiffInit = false;
  public oyTemp = [this.getOInit()];
  public tempInitCoeff = this.tempMax - this.tempMin;
  @Input() lines: Array<Point> = [];
  @Input() xValues: Array<number> = [];
  @Input() drawing: {
    svgXsize?: number,
    svgYsize?: number,
    x0?: number,
    y0?: number,
    xsize?: number,
    ysize?: number,
    getYTopGraduate?: number,
    getYTopLegend?: number,
    getXquarter?: number,
    getXmedium?: number,
    getXThreeQuarter?: number,
    getRightLimit?: number,
    getBottomLimit?: number,
    getYBottomGraduate?: number,
    getYBottomLegend?: number,
    getXArrow?: number,
    getYArrow?: number,
    getXArrowRight?: number,
    getXArrowLeft?: number,
    getTextArrow?: number,
    getYMediumSVG?: number,
    path?: string,
  };
  @Output() change = new EventEmitter<any>();
  @Input() legends: {
    getTempMin?: string,
    getLegendTemperature?: string,
    getQuarterTemp?: string,
    getMediumTemp?: string,
    getThreeQuarterTemp?: string,
    getTempMax?: string,
    getHeight?: string
  };
  public viewBox = '0 0 335 720';

  constructor() {}

  ngOnInit() {
    this.show();
    this.svgData = JSON.parse(localStorage.getItem('svgData'));
    if (this.svgData) {
      this.size = this.svgData.size;
    }
    this.oTemp = [this.getOInit()];
    this.reScaleFromTempY();
  }

  reScaleFromTempY() {
    let tmpCoeff;
    tmpCoeff = ((this.tempMax) - (this.tempMin)) / (this.tempInitCoeff);
    for (let idx = 0; idx < this.size; idx = idx + 1) {
      if (this.yTemp[idx] !== '') {
        this.oyTemp[idx] = String(((this.yTemp[idx]) - (this.tempMin)) / (tmpCoeff));
      } else {
        this.oyTemp[idx] = String(-1e20);
      }
      // document.form1.inputValue[idx].value = yTemp[idx];
      this.oTemp[idx] = this.oyTemp[idx];
    }
  }

  mouseover(event, id) {
    const idCircle = <HTMLElement>document.getElementById('c' + id);
    idCircle.setAttribute('stroke', 'red');
  }

  mouseout(event, id) {
    const idCircle = <HTMLElement>document.getElementById('c' + id);
    idCircle.setAttribute('stroke', 'black');
  }

  cliquer(event, id) {
    this.elt = <HTMLElement>document.getElementById('c' + id);
    this.currentpos = id;
    if (this.legends) {
      const value = this.getAxisXPos(event.offsetX, this.legends);
      const self = this;
      this.change.emit({ index: self.currentpos, value: value });
    }
  }

  relacher(event, id) {
    this.elt = null;
    this.currentpos = null;
  }

  deplacerext(event) {
    if (this.elt != null) {
      this.deplacer(event, this.currentpos);
    }
  }

  deplacer(event, id) {
    if (this.elt != null) {
      this.oTemp[id] = event.offsetX;

      if (this.legends) {
        let tmp = this.roundResult(Number(this.legends.getTempMin) + ((this.oTemp[id] - this.x0) / this.tempCoeff));
        if (tmp > Number(this.legends.getTempMax)) {
          tmp = Number(this.legends.getTempMax);
        }

        if (tmp < Number(this.legends.getTempMin)) {
          tmp = Number(this.legends.getTempMin);
        }

        const value = this.getAxisXPos(event.offsetX, this.legends);
        const self = this;
        this.change.emit({ index: self.currentpos, value: tmp });
        this.yTemp[id] = tmp;
      }
      this.redrawPath();
    }
  }

  relacherext(event) {
    this.reScale();
    this.elt = null;
  }

  getAxisXPos(pos: number, legends) {
    let value = null;
    const width = 245;
    const marginWidth = 30;
    const mid = (width / 2) ;
    value = Math.round(((pos - mid - marginWidth) / mid) * 100);
    if (value > 100) {
      value = 100;
    }

    if (value < -100) {
      value = -100;
    }

    if (Number(legends.getTempMax) === Number(373.2)) {
      value = (Number(value) + 273.15);
    } else if (Number(legends.getTempMax) === Number(212)) {
      value = ((Number(value) * 1.8) + 32);
    }

    return value;
  }

  reScale() {
    if (this.legends) {
      this.tempCoeff = (this.svgx / (Number(this.legends.getTempMax) - Number(this.legends.getTempMin)));

      for (let idx = 0; idx < this.svgData.size; idx++) {
        let value;
        value = this.xValues[idx];
        // error code here value null
        this.oTemp[idx] = (((Number(value) - Number(this.legends.getTempMin)) * this.tempCoeff)) + this.x0;
      }
    }
    // Error some code here
    this.redrawPath();
  }

  roundResult(value) {
    return Math.round(value * Math.pow(10, this.arrondir)) / Math.pow(10, this.arrondir);
  }

  redrawPath() {
    this.svgData = JSON.parse(localStorage.getItem('svgData'));
    if (this.svgData) {
      let idx = 0;
      let gradobj;
      let gradobjCercle;
      gradobj = <HTMLElement>document.getElementById('testPath');
      this.nbValid = this.svgData.size;
      let nbPoints = 0;
      let pathStr;
      for (idx = 0; idx < this.svgData.size; idx++) {
        if (this.oTemp[idx] !== '-1e20') {
          gradobjCercle = <HTMLElement>document.getElementById('c' + idx);
          const x = this.oTemp[idx];
          const y = gradobjCercle.getAttribute('cy');

          if (nbPoints === 0) {
            pathStr = 'M' + x + ',' + y + ' L';
          } else {
            pathStr = pathStr + x + ',' + y + ' ';
          }

          nbPoints = nbPoints + 1;

          const cx = (this.oTemp[idx]);
          if (!isNaN(cx)) {
            gradobjCercle.setAttribute('cx', cx);
          }
        } else {
          gradobjCercle = <HTMLElement>document.getElementById('c' + idx);
          gradobjCercle.setAttribute('cx', ((this.svgx / 2) + this.x0));
          this.nbValid--;
        }
      }

      if (this.nbValid > 1) {
        gradobj.setAttribute('d', pathStr);
      } else {
        gradobj.setAttribute('d', '');
      }
    }
  }

  show() {
    this.loaded = true;
  }

  clearAll() {
    // console.log('clear', this.size);
    this.svgData = JSON.parse(localStorage.getItem('svgData'));
    if (this.svgData) {
      this.oTemp = [this.getOInit()];
      this.tempDiffInit = false;
      for (let idx = 0; idx < this.size; idx = idx + 1) {
        const idTempPoint = <HTMLElement>document.getElementById('tempPoint' + idx);
        if ((idx === 0) || (idx === this.size - 1)) {
          idTempPoint.setAttribute('value', String(this.defZero));
        } else {
          idTempPoint.setAttribute('value', '');
        }
        const value = idTempPoint.getAttribute('value');
        this.yTemp[idx] = value;
      }
    }
    // this.redrawPath();
    const gradobj = <HTMLElement>document.getElementById('testPath');
    gradobj.setAttribute('d', '');
  }

  generatePoints() {
    // console.log('Generate point');
    // console.log(this.size);
  }

  getOInit() {
    let tmp = '';
    for (let i = 0; i < Number(this.size); i++) {
      if (i > 0) {
        tmp = tmp + ' , ';
      }
      tmp = tmp + '-1e20';
    }
    return tmp;
  }
}
