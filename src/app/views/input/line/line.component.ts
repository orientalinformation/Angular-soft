import { Component, OnInit, AfterContentChecked, AfterViewInit } from '@angular/core';
import { Study, ViewProduct, PipeLineElmt, User, ViewStudyEquipment } from '../../../api/models';
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
  public studyEquip: ViewStudyEquipment;
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
  public insulatedvalValue: Array<any> = [];
  public insulatedLineValue: Array<any> = [];
  public non_insulated_valValue: Array<any> = [];
  public non_insulated_lineValue: Array<any> = [];
  public teeValue: Array<any> = [];
  public elbowsValue: Array<any> = [];
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
  public insulatedLine: Array<any> = [];
  public elbows: Array<any> = [];
  public insulatedval: Array<any> = [];
  public insulationType: Array<any> = [];
  public noninsulatedline: Array<any> = [];
  public noninsulatedvalves: Array<any> = [];
  public tee: Array<any> = [];
  public insulationName;
  public statusInLenght: boolean;
  public statusInval: boolean;
  public statusTee: boolean;
  public statusElbow: boolean;
  public statusNonInL: boolean;
  public statusNonInval: boolean;
  public statusInsulatedLine: boolean;
  public statusInsulatedVal: boolean;
  public statusInsulation: boolean;
  public statusDiameter: boolean;
  public statusHeight: boolean;
  public statusPressure: boolean;
  public statusStank: boolean;
  public statusNonInsuVal: boolean;
  public statusNonInsuLine: boolean;
  public statusElbChoose: boolean;
  public statusTeeChoose: boolean;
  public statusEven: boolean;
  public isLoading: boolean;
  public userLogon: User;
  public symbol: any;
  public checkequip: any;
  public angular: any;
  constructor(private api: ApiService, private router: Router, private translate: TranslateService,
    private toastr: ToastrService) {
      this.userLogon = JSON.parse(localStorage.getItem('user'));
    }
  ngOnInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.insulationTypeSelected = 5;
    this.insulatedLineSelected = 0;
    this.storageTankSelected = 0;
    this.elbowsSelected = 0;
    this.insulatedvalSelected = 0;
    this.noninsulatedlineSelect = 0;
    this.noninsulatedvalvesSelect = 0;
    this.diameterSelected = 0;
    this.teeSelect = 0;
    this.height = 0.00;
    this.pressuer = 0.00;
    this.gastemp = 0;
    this.isLoading = true;
    this.loadDisabled();
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
    if (!this.study.OPTION_CRYOPIPELINE) {
      swal('Warning', this.translate.instant('This study does not have enabled CryoPipeline calculation option'), 'error');
      this.router.navigate(['/input/objectives']);
    }

    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = JSON.parse(localStorage.getItem('productView'));
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      swal('Warning', this.translate.instant('Please define product along with elements first'), 'error');
      this.router.navigate(['/input/product']);
    }
    this.checkequip = localStorage.getItem('equip');
    if (this.checkequip == '') {
      swal('Warning', this.translate.instant('Please define equipment along with elements first'), 'error');
      this.router.navigate(['/input/equipment']);
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
          if (this.insulationTypeSelected == 0) {
              if (this.insulatedvalValue != this.dataResultExist.insulval) {
                  this.insulvalnumber = 0;
              }
              if (this.teeValue != this.dataResultExist.teeval) {
                  this.dataResultExist.teeval = 0;
                  this.teenumber = 0;
              }
              if (this.elbowsValue != this.dataResultExist.elbowval) {
                  this.dataResultExist.elbowval = 0;
                  this.elbowsnumber = 0;
              }
              // if (this.storageTankValue != this.dataResultExist.storageTank) {
              //   this.storageTankSelected = this.dataResultExist.storageTank = 0;
              // }
          }
            for (let ii = 0; ii < this.idPipeLineEmlt.length; ii++) {
              if (this.idPipeLineEmlt[ii] == this.dataResultExist.insulval) {
                this.insulatedvalSelected = this.dataResultExist.insulval;
              } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.insul) {
              this.insulatedLineSelected = this.dataResultExist.insul;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.noninsulval) {
              this.noninsulatedvalvesSelect = this.dataResultExist.noninsulval;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.noninsul) {
              this.noninsulatedlineSelect  = this.dataResultExist.noninsul;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.teeval) {
              this.teeSelect = this.dataResultExist.teeval;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.elbowval) {
              this.elbowsSelected = this.dataResultExist.elbowval;
            } else if (this.idPipeLineEmlt[ii] == this.dataResultExist.storageTank) {
              this.storageTankSelected = this.dataResultExist.storageTank;
            }
          }
            this.insulatedLine = this.dataResultExist.insulationLineSub;
            this.insulatedval = this.dataResultExist.insulatedlinevalSub;
            this.noninsulatedvalves = this.dataResultExist.non_insulated_valveSub;
            this.noninsulatedline = this.dataResultExist.non_insulated_lineSub;
            this.tee = this.dataResultExist.teeSub;
            this.elbows = this.dataResultExist.elbowsSub;
          for (let i = 0; i < this.insulationParam.length; i++) {
            if (i == 0) {
              this.insulationName = this.translate.instant('Not Insulated');
            } else if (i == 1) {
              this.insulationName = this.translate.instant('Polyrethane');
            } else if (i == 2) {
              this.insulationName = this.translate.instant('Super Insulation');
            } else if (i == 3) {
              if (this.dataResultExist.idcooling == 3) {
                this.insulationName = this.translate.instant('Armaflex');
              }
            }
            this.insulationParamShow.push({
              value: i,
              name: this.insulationName
            });
          }
          if ((this.study.ID_USER != this.userLogon.ID_USER)) {
            this.checkUser();
          } else {
            if (this.insulationTypeSelected == 0) {
              this.statusInsulatedLine = true;
              this.statusInsulatedVal = true;
              this.insulatedLineSelected = 0;
              this.insulatedvalSelected = 0;
            } else {
              this.statusInsulatedLine = false;
              this.statusInsulatedVal = false;
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
          }
        } else {
          this.checkUser();
          this.loadDisabled();
          for (let i = 0; i < this.dataResult.length; i++) {
            if (i == 0) {
              this.insulationName = this.translate.instant('Not Insulated');
            } else if (i == 1) {
              this.insulationName = this.translate.instant('Polyrethane');
            } else if (i == 2) {
              this.insulationName = this.translate.instant('Super Insulation');
            } else if (i == 3) {
              if (this.dataResult[i][i].idcooling == 3) {
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
        // console.log(data);
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
    this.storageTankSelected = 0;
    this.loadDisabled();
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
    // console.log(this.diameterParamShow);
  }
  loadDiameter() {
    this.storageTankValue = [];
    for (let j = 0; j < this.diameterParamShow.length; j++) {
      if (this.diameterSelected == this.dataResult[this.insulationTypeSelected][j].diameter) {
        this.insulationType = this.dataResult[this.insulationTypeSelected][j].insulationType;

        if (this.dataResult[this.insulationTypeSelected][j].insulatedline != []) {
          this.insulatedLine = this.dataResult[this.insulationTypeSelected][j].insulatedline;
          this.insulatedLineValue = this.dataResult[this.insulationTypeSelected][j].insulationlineValue;
          this.insulatedLineSelected = 0;
        } else {
          this.insulatedLine = [];
        }
        if (this.dataResult[this.insulationTypeSelected][j].insulatedlineval != []) {
            this.insulatedval = this.dataResult[this.insulationTypeSelected][j].insulatedlineval;
            this.insulatedvalValue = this.dataResult[this.insulationTypeSelected][j].insulatedlinevalValue;
            this.insulatedvalSelected = 0;
        } else {
          this.insulatedval = [];
        }
        if (this.dataResult[this.insulationTypeSelected][j].elbows != []) {
            this.elbows = this.dataResult[this.insulationTypeSelected][j].elbows;
            this.elbowsValue = this.dataResult[this.insulationTypeSelected][j].elbowsValue;
            this.elbowsSelected = 0;
        } else {
          this.elbows = [];
        }
        if (this.dataResult[this.insulationTypeSelected][j].non_insulated_line != []) {
            this.noninsulatedline = this.dataResult[this.insulationTypeSelected][j].non_insulated_line;
            this.non_insulated_lineValue = this.dataResult[this.insulationTypeSelected][j].non_insulated_lineValue;
            this.noninsulatedlineSelect = 0;
        } else {
          this.noninsulatedline = [];
        }
        if (this.dataResult[this.insulationTypeSelected][j].non_insulated_valves != []) {
          this.noninsulatedvalves = this.dataResult[this.insulationTypeSelected][j].non_insulated_valves;
          this.non_insulated_valValue = this.dataResult[this.insulationTypeSelected][j].non_insulated_valValue;
          this.noninsulatedvalvesSelect = 0;
        } else {
          this.noninsulatedvalves = [];
        }
        if (this.dataResult[this.insulationTypeSelected][j].tee != []) {
          this.tee = this.dataResult[this.insulationTypeSelected][j].tee;
          this.teeValue = this.dataResult[this.insulationTypeSelected][j].teeValue;
          this.teeSelect = 0;
        } else {
          this.tee = [];
        }

        if (this.diameterSelected == this.dataResultExist.diameter && this.insulationType == this.dataResultExist.insulationType) {
          this.refeshView();
        } else {
          this.loadDisabled();
          this.insulatedLineSelected = 0;
          this.elbowsSelected = 0;
          this.noninsulatedvalvesSelect = 0;
          this.noninsulatedlineSelect = 0;
          this.teeSelect = 0;
          this.height = this.dataResult[this.insulationTypeSelected][j].height;
          this.pressuer = this.dataResult[this.insulationTypeSelected][j].pressuer;
          this.gastemp = this.dataResult[this.insulationTypeSelected][j].gastemp;
        }

      }
      if (this.diameterSelected == 0) {
          this.insulatedLineSelected = 0;
          this.insulatedvalSelected = 0;
          this.elbowsSelected = 0;
          this.noninsulatedvalvesSelect = 0;
          this.noninsulatedlineSelect = 0;
          this.teeSelect = 0;
          this.loadDisabled();
      }
      this.storageTankValue = this.dataResult[this.insulationTypeSelected][j].storageTankValue;
      this.storageTankParam = this.dataResult[this.insulationTypeSelected][j].storageTankParam;
    }
    if (this.dataResultExist != '') {
      this.height = this.dataResultExist.height;
      this.pressuer = this.dataResultExist.pressuer;
    } else {
      this.height = 0;
      this.pressuer = 0;
    }
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
    // console.log(this.dataResultExist.teeval + '---' + this.teeSelect);
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
        }
        if (this.noninsullenght == 0) {
          this.noninsulatedlineSelect = 0;
          this.statusNonInL = true;
        }
        if (this.insulvalnumber == 0) {
          this.insulatedvalSelected = 0;
          this.statusInval = true;

        }
        if (this.noninsulatevallenght == 0) {
          this.noninsulatedvalvesSelect = 0;
          this.statusNonInval = true;
        }
        if (this.elbowsnumber == 0) {
          this.elbowsSelected = 0;
          this.statusElbow = true;
        }
        if (this.teenumber == 0) {
          this.teeSelect = 0;
          this.statusTee = true;
        }
        if (this.diameterParamShow.length == null) {
          this.diameterSelected = 0;
        }
        this.insulationParamShow = [];
        this.refeshView();
        this.toastr.success(this.translate.instant('Save line completed!'), 'Success');
      },
      (err) => {
        this.laddaSavingLine = false;
        this.toastr.error(this.translate.instant(err.error), 'error');
        // console.log(err);
      },
      () => {
        this.laddaSavingLine = false;
      });
  }

  checkUser() {
    if (this.study.ID_USER != this.userLogon.ID_USER) {
      this.statusInsulation = true;
      this.statusInval = true;
      this.statusNonInL = true;
      this.statusNonInval = true;
      this.statusTee = true;
      this.statusElbow = true;
      this.statusInLenght = true;
      this.statusInsulatedLine = true;
      this.statusInsulatedVal = true;
      this.statusDiameter = true;
      this.statusHeight = true;
      this.statusPressure = true;
      this.statusStank = true;
      this.statusNonInsuVal = true;
      this.statusNonInsuLine = true;
      this.statusElbChoose = true;
      this.statusTeeChoose = true;
      this.statusEven = true;
    } else {
      this.statusInsulation = false;
      this.statusNonInL = false;
      this.statusNonInval = false;
      this.statusTee = false;
      this.statusElbow = false;
      this.statusInLenght = false;
      this.statusInsulatedLine = false;
      this.statusInsulatedVal = false;
      this.statusDiameter = false;
      this.statusHeight = false;
      this.statusPressure = false;
      this.statusStank = false;
      this.statusNonInsuVal = false;
      this.statusNonInsuLine = false;
      this.statusElbChoose = false;
      this.statusTeeChoose = false;
      this.statusEven = false;
    }
  }
}
