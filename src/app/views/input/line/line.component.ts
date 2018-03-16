import { Component, OnInit, AfterContentChecked, AfterViewInit } from '@angular/core';
import { Study, ViewProduct, PipeLineElmt } from '../../../api/models';
import { ApiService } from '../../../api/services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Symbol } from '../../../api/models/symbol';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, AfterContentChecked, AfterViewInit {
  public study: Study;
  public productShape: number;
  public productView: ViewProduct;
  public lineEmlt: PipeLineElmt;
  public laddaSavingLine = false;
  public dataResultExist;
  public dataResult;
  public insulationTypeSelected: number;
  public diameterSelected: number;
  public insulatedLineSelected: number;
  public storageTankSelected: number;
  public elbowsSelected: number;
  public insulatedvalSelected: number;
  public noninsulatedlineSelect: number;
  public noninsulatedvalvesSelect: number;
  public teeSelect: number;
  public insulatedvalValue: number;
  public insulatedLineValue: number;
  public non_insulated_valValue: number;
  public non_insulated_lineValue: number;
  public teeValue: number;
  public elbowsValue: number;
  public diameterParamShow: Array<any> = [];
  public diameterParams: Array<any> = [];
  public storageTankParam: Array<any> = [];
  public insulationParam: Array<any> = [];
  public insulationParamShow: Array<any> = [];
  public idPipeLineEmlt: Array<any> = [];
  public storageTankValue: Array<any> = [];
  public height: number;
  public pressuer: number;
  public insulllenght: number;
  public insulvalnumber: number;
  public elbowsnumber: number;
  public teenumber: number;
  public gastemp: number;
  public noninsullenght: number;
  public noninsulatevallenght: number;
  public insulatedLine: string;
  public elbows: string;
  public insulatedval: string;
  public insulationType: string;
  public noninsulatedline: string;
  public noninsulatedvalves: string;
  public tee: string;
  public insulationName;
  public statusInLenght: boolean;
  public statusInval: boolean;
  public statusTee: boolean;
  public statusElbow: boolean;
  public statusNonInL: boolean;
  public statusNonInval: boolean;
  public statusInsulatedLine: boolean;
  public statusInsulatedVal: boolean;
  public isLoading: boolean;
  public symbol: any;
  constructor(private api: ApiService, private router: Router, private translate: TranslateService,
    private toastr: ToastrService) { }
  ngOnInit() {
    this.insulationTypeSelected = 5;
    this.insulatedLineSelected = 0;
    this.storageTankSelected = 0;
    this.elbowsSelected = 0;
    this.insulatedvalSelected = 0;
    this.noninsulatedlineSelect = 0;
    this.noninsulatedvalvesSelect = 0;
    this.diameterSelected = 0;
    this.teeSelect = 0;
    this.isLoading = true;
    this.loadDisabled();
    // console.log(this.insulllenght);
  }
  loadDisabled() {
    this.statusInval = true;
    this.statusNonInL = true;
    this.statusNonInval = true;
    this.statusTee = true;
    this.statusElbow = true;
    this.statusInLenght = true;
    this.insulllenght = 0;
    this.insulvalnumber = 0;
    this.teenumber = 0;
    this.elbowsnumber = 0;
    this.noninsullenght = 0;
    this.noninsulatevallenght = 0;
  }
  ngAfterContentChecked() {
    this.study = JSON.parse(localStorage.getItem('study'));
    if (!this.study.OPTION_CRYOPIPELINE) {
      swal('Oops..', 'This study does not have enabled CryoPipeline calculation option', 'error');
      this.router.navigate(['/input/objectives']);
    }

    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = JSON.parse(localStorage.getItem('productView'));
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      swal('Oops..', 'Please define product along with elements first', 'error');
      this.router.navigate(['/input/product']);
    }
  }
  ngAfterViewInit() {
    this.refeshView();
  }
  refeshView() {
    this.api.loadPipeline(this.study.ID_STUDY).subscribe(
      data => {
        this.dataResultExist = data.dataResultExist;
        this.dataResult = data.dataResult;
        if (this.dataResultExist != '') {
          this.diameterSelected = this.dataResultExist.diameter;
          this.insulationTypeSelected = this.insulationType = this.dataResultExist.insulationType;
          this.diameterParamShow = this.dataResultExist.diameterParam;
          this.storageTankParam = this.dataResultExist.storageTankParam;
          this.height = this.dataResultExist.height;
          if (this.insulationTypeSelected == 0) {
            this.statusInsulatedLine = true;
            this.statusInsulatedVal = true;
            this.insulatedLineSelected = 0;
            this.insulatedvalSelected = 0;
          } else {
            this.statusInsulatedLine = false;
            this.statusInsulatedVal = false;
          }
          if (this.dataResultExist.pressuer != null) {
            this.pressuer = this.dataResultExist.pressuer;
          } else {
            this.pressuer = 0;
          }
          this.insulllenght = this.dataResultExist.insulllenght;
          this.insulvalnumber = this.dataResultExist.insulvallenght;
          this.elbowsnumber = this.dataResultExist.elbowsnumber;
          this.teenumber = this.dataResultExist.teenumber;
          this.gastemp = this.dataResultExist.gastemp;
          this.noninsullenght = this.dataResultExist.noninsullenght;
          this.noninsulatevallenght = this.dataResultExist.noninsulatevallenght;
          this.insulationParam = this.dataResultExist.insulationParam;
          this.idPipeLineEmlt = this.dataResultExist.idPipeELMT;
          this.insulatedvalValue = this.dataResultExist.insulatedlinevalValue;
          this.insulatedLineValue = this.dataResultExist.insulationLineValue;
          this.non_insulated_valValue = this.dataResultExist.non_insulated_valValue;
          this.non_insulated_lineValue = this.dataResultExist.non_insulated_lineValue;
          this.teeValue = this.dataResultExist.teeValue;
          this.elbowsValue = this.dataResultExist.elbowsValue;
          this.storageTankValue = this.dataResultExist.storageTankValue;
          for (let ii = 0; ii < this.idPipeLineEmlt.length; ii++) {
            if (this.idPipeLineEmlt[ii] == this.insulatedvalValue) {
              this.insulatedvalSelected = this.dataResultExist.insulatedlinevalValue;
            } else if (this.idPipeLineEmlt[ii] == this.insulatedLineValue) {
              this.insulatedLineSelected = this.dataResultExist.insulationLineValue;
            } else if (this.idPipeLineEmlt[ii] == this.non_insulated_valValue) {
              this.noninsulatedvalvesSelect = this.dataResultExist.non_insulated_valValue;
            } else if (this.idPipeLineEmlt[ii] == this.non_insulated_lineValue) {
              this.noninsulatedlineSelect = this.dataResultExist.non_insulated_lineValue;
            } else if (this.idPipeLineEmlt[ii] == this.teeValue) {
              this.teeSelect = this.dataResultExist.teeValue;
            } else if (this.idPipeLineEmlt[ii] == this.elbowsValue) {
              this.elbowsSelected = this.dataResultExist.elbowsValue;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.storageTank) {
              this.storageTankSelected = this.dataResultExist.storageTank;
            }
          }
          if (this.dataResultExist.insulatedline == null) {
            this.insulatedLine = this.dataResultExist.insulationLineSub;
          } else {
            this.insulatedLine = this.dataResultExist.insulatedline;
          }
          if (this.dataResultExist.insulatedlineval == null) {
            this.insulatedval = this.dataResultExist.insulatedlinevalSub;
          } else {
            this.insulatedval = this.dataResultExist.insulatedlineval;
          }
          if (this.dataResultExist.non_insulated_valves == null) {
            this.noninsulatedvalves = this.dataResultExist.non_insulated_valveSub;
          } else {
            this.noninsulatedvalves = this.dataResultExist.non_insulated_valves;
          }
          if (this.dataResultExist.non_insulated_line == null) {
            this.noninsulatedline = this.dataResultExist.non_insulated_lineSub;
          } else {
            this.noninsulatedline = this.dataResultExist.non_insulated_line;
          }
          if (this.dataResultExist.tee == null) {
            this.tee = this.dataResultExist.teeSub;
          } else {
            this.tee = this.dataResultExist.tee;
          }
          if (this.dataResultExist.elbows == null) {
            this.elbows = this.dataResultExist.elbowsSub;
          } else {
            this.elbows = this.dataResultExist.elbows;
          }
          for (let i = 0; i < this.insulationParam.length; i++) {
            if (i == 0) {
              this.insulationName = this.translate.instant('Not Insulated');
            } else if (i == 1) {
              this.insulationName = this.translate.instant('Polyrethane');
            } else if (i == 2) {
              this.insulationName = this.translate.instant('Super Insulation');
            } else if (i == 3) {
              if (this.dataResultExist.insulatedlineval != null) {
                this.insulationName = this.translate.instant('Armaflex');
              }
            }
            this.insulationParamShow.push({
              value: i,
              name: this.insulationName
            });
          }
          if (this.insulllenght != 0) {
            this.statusInLenght = false;
          } else {
            this.statusInLenght = true;
          }
          if (this.insulvalnumber != 0) {
            this.statusInval = false;
          } else {
            this.statusInval = true;
          }
          if (this.teenumber != 0) {
            this.statusTee = false;
          } else {
            this.statusTee = true;
          }
          if (this.elbowsnumber != 0) {
            this.statusElbow = false;
          } else {
            this.statusElbow = true;
          }
          if (this.noninsulatevallenght != 0) {
            this.statusNonInval = false;
          } else {
            this.statusNonInval = true;
          }
          if (this.noninsullenght != 0) {
            this.statusNonInL = false;
          } else {
            this.statusNonInL = true;
          }
        } else {
          for (let i = 0; i < this.dataResult.length; i++) {
            if (i == 0) {
              this.insulationName = this.translate.instant('Not Insulated');
            } else if (i == 1) {
              this.insulationName = this.translate.instant('Polyrethane');
            } else if (i == 2) {
              this.insulationName = this.translate.instant('Super Insulation');
            } else if (i == 3) {
              if (this.dataResultExist.insulatedlineval == null) {
                this.insulationName = this.translate.instant('Armaflex');
              }
            }
            this.insulationParamShow.push({
              value: i,
              name: this.insulationName
            });
          }
        }
        this.isLoading = false;
      }
    );
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        this.symbol = data;
      }
    );
  }

  loadInsulationType() {
    this.insulatedLineSelected = 0;
    this.insulatedvalSelected = 0;
    this.diameterSelected = 0;
    this.noninsulatedlineSelect = 0;
    this.noninsulatedvalvesSelect = 0;
    this.teeSelect = 0;
    this.elbowsSelected = 0;
    this.diameterParams = [];
    this.storageTankValue = [];
    this.storageTankParam = [];
    if (this.insulationTypeSelected == 0) {
      this.statusInsulatedLine = true;
      this.statusInsulatedVal = true;
      this.insulatedLineSelected = 0;
      this.insulatedvalSelected = 0;
    } else {
      this.statusInsulatedLine = false;
      this.statusInsulatedVal = false;
    }
    for (let dimter = 0; dimter < this.dataResult[this.insulationTypeSelected].length; dimter++) {
      this.diameterParams.push(
        this.dataResult[this.insulationTypeSelected][dimter].diameter
      );
    }
    this.diameterParamShow = this.diameterParams;
    console.log(this.diameterParamShow);
    this.loadDiameter();
    this.loadDisabled();
  }
  loadDiameter() {
    this.storageTankValue = [];
    for (let j = 0; j < this.diameterParamShow.length; j++) {
      if (this.diameterSelected == this.dataResult[this.insulationTypeSelected][j].diameter) {
        this.insulatedLine = this.dataResult[this.insulationTypeSelected][j].insulatedline;
        this.elbows = this.dataResult[this.insulationTypeSelected][j].elbows;
        this.insulatedval = this.dataResult[this.insulationTypeSelected][j].insulatedlineval;
        this.insulationType = this.dataResult[this.insulationTypeSelected][j].insulationType;
        this.noninsulatedline = this.dataResult[this.insulationTypeSelected][j].non_insulated_line;
        this.noninsulatedvalves = this.dataResult[this.insulationTypeSelected][j].non_insulated_valves;
        this.tee = this.dataResult[this.insulationTypeSelected][j].tee;
        this.storageTankValue = this.dataResult[this.insulationTypeSelected][j].storageTankValue;
        this.storageTankParam = this.dataResult[this.insulationTypeSelected][j].storageTankParam;
        this.insulatedLineValue = this.dataResult[this.insulationTypeSelected][j].insulationlineValue;
        if (this.insulatedLineValue == this.insulatedLineSelected) {
          this.insulllenght = this.dataResultExist.insulllenght;
          this.statusInLenght = false;
        } else {
          this.insulllenght = this.dataResult[this.insulationTypeSelected][j].insulllenght;
          this.statusInLenght = true;
        }
        this.insulatedvalValue = this.dataResult[this.insulationTypeSelected][j].insulatedlinevalValue;
        if (this.insulatedvalValue == this.insulatedvalSelected) {
          this.insulvalnumber = this.dataResultExist.insulvallenght;
          this.statusInval = false;
        } else {
          this.insulvalnumber = this.dataResult[this.insulationTypeSelected][j].insulvallenght;
          this.statusInval = true;
        }
        this.non_insulated_valValue = this.dataResult[this.insulationTypeSelected][j].non_insulated_valValue;
        if (this.non_insulated_valValue == this.noninsulatedvalvesSelect) {
          this.noninsulatevallenght = this.dataResultExist.noninsulatevallenght;
          this.statusNonInval = false;
        } else {
          this.noninsulatevallenght = this.dataResult[this.insulationTypeSelected][j].noninsulatevallenght;
          this.statusNonInval = true;
        }
        this.non_insulated_lineValue = this.dataResult[this.insulationTypeSelected][j].non_insulated_lineValue;
        if (this.non_insulated_lineValue == this.noninsulatedlineSelect) {
          this.noninsullenght = this.dataResultExist.noninsullenght;
          this.statusNonInL = false;
        } else {
          this.noninsullenght = this.dataResult[this.insulationTypeSelected][j].noninsullenght;
          this.statusNonInL = true;
        }
        this.teeValue = this.dataResult[this.insulationTypeSelected][j].teeValue;
        if (this.teeValue == this.teeSelect) {
          this.teenumber = this.dataResultExist.teenumber;
          this.statusTee = false;
        } else {
          this.teenumber = this.dataResult[this.insulationTypeSelected][j].teenumber;
          this.statusTee = true;
        }
        this.elbowsValue = this.dataResult[this.insulationTypeSelected][j].elbowsValue;
        if (this.elbowsValue == this.elbowsSelected) {
          this.elbowsnumber = this.dataResultExist.elbowsnumber;
          this.statusElbow = false;
        } else {
          this.elbowsnumber = this.dataResult[this.insulationTypeSelected][j].elbowsnumber;
          this.statusElbow = true;
        }
        this.height = this.dataResult[this.insulationTypeSelected][j].height;
        this.pressuer = this.dataResult[this.insulationTypeSelected][j].pressuer;
        this.gastemp = this.dataResult[this.insulationTypeSelected][j].gastemp;
      } else if (this.diameterSelected == 0) {
        this.insulatedLine = '';
        this.insulatedval = '';
        this.elbows = '';
        this.insulatedval = '';
        this.noninsulatedline = '';
        this.noninsulatedvalves = '';
        this.tee = '';
        this.loadDisabled();
      }
      this.storageTankValue = this.dataResult[this.insulationTypeSelected][j].storageTankValue;
      this.storageTankParam = this.dataResult[this.insulationTypeSelected][j].storageTankParam;
    }
    this.pressuer = this.dataResultExist.pressuer;
  }

  changeInsulatedLine() {
    if (this.insulatedLineSelected != 0) {
      this.statusInLenght = false;
    } else {
      this.statusInLenght = true;
      this.insulllenght = 0.0;
    }
  }

  changeInsulatedVal() {
    if (this.insulatedvalSelected != 0) {
      this.statusInval = false;
    } else {
      this.statusInval = true;
      this.insulvalnumber = 0;
    }
  }

  changeTee() {
    if (this.teeSelect != 0) {
      this.statusTee = false;
    } else {
      this.statusTee = true;
      this.teenumber = 0;
    }
  }

  changeElbows() {
    if (this.elbowsSelected != 0) {
      this.statusElbow = false;
    } else {
      this.statusElbow = true;
      this.elbowsnumber = 0;
    }
  }

  changeNonInLine() {
    if (this.noninsulatedlineSelect != 0) {
      this.statusNonInL = false;
    } else {
      this.statusNonInL = true;
      this.noninsullenght = 0;
    }
  }

  changeNonInLineval() {
    if (this.noninsulatedvalvesSelect != 0) {
      this.statusNonInval = false;
    } else {
      this.statusNonInval = true;
      this.noninsulatevallenght = 0;
    }
  }

  saveLine() {
    const params = {
      ID_STUDY: this.study.ID_STUDY,
      INSULLINE_LENGHT: this.insulllenght,
      NOINSULLINE_LENGHT: this.noninsullenght,
      INSUL_VALVES: this.insulvalnumber,
      NOINSUL_VALVES: this.noninsulatevallenght,
      ELBOWS: this.elbowsnumber,
      TEES: this.teenumber,
      HEIGHT: this.height,
      PRESSURE: this.pressuer,
      INSULATED_LINE: this.insulatedLineSelected,
      INSULATED_VALVES: this.insulatedvalSelected,
      NON_INSULATED_LINE: this.noninsulatedlineSelect,
      NON_INSULATED_VALVES: this.noninsulatedvalvesSelect,
      TEESVALUE: this.teeSelect,
      ELBOWSVALUE: this.elbowsSelected,
      STORAGE_TANK: this.storageTankSelected,
      GAS_TEMP: this.gastemp,
    };
    this.laddaSavingLine = true;
    this.api.savePipelines(params).subscribe(
      data => {
        if (this.insulllenght == 0) {
          this.insulatedLineSelected = 0;
          this.statusInLenght = true;
        } else if (this.noninsullenght == 0) {
          this.noninsulatedlineSelect = 0;
          this.statusNonInL = true;
        } else if (this.insulvalnumber == 0) {
          this.insulatedvalSelected = 0
          this.statusInval = true;
        } else if (this.noninsulatevallenght == 0) {
          this.noninsulatedvalvesSelect = 0
          this.statusNonInL = true;
        } else if (this.elbowsnumber == 0) {
          this.elbowsSelected = 0;
          this.statusElbow = true;
        } else if (this.teenumber == 0) {
          this.teeSelect = 0;
          this.statusTee = true;
        }
        this.toastr.success('Save line completed!', 'Success');
      },
      (err) => {
        swal('Error', err.error.message, 'error');
        console.log(err.error);
        this.laddaSavingLine = false;
      },
      () => {
        this.laddaSavingLine = false;
      });
    // swal('Warning', 'This feature is under developmente!', 'warning');
  }
}
