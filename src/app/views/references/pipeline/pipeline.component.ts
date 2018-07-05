import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ReferencedataService } from '../../../api/services/referencedata.service';
import { ApiService } from '../../../api/services';
import { PipeLineElmt, ViewPipeLineElmt, Translation, Units } from '../../../api/models';
import { User } from '../../../api/models/user';
import { isNullOrUndefined } from 'util';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Pipe({ name: 'pipeLineFilter' })
export class PipeLineFilterPipe implements PipeTransform {
  public transform(values: PipeLineElmt[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter(
      v => v.LABEL.toLowerCase().indexOf(
        filter.toLowerCase()) >= 0);
  }
}
@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit, AfterViewInit {
  @ViewChild('modalAddPipeLine') public modalAddPipeLine: ModalDirective;
  @ViewChild('modalSaveAs') public modalSaveAs: ModalDirective;
  public isAddLine = false;
  public isDeletePipeLine = false;
  public isUpdatePipeLine = false;
  public isSaveAs = false;
  public isLoading = false;
  public pipelineType: number;
  public listPipeLines: ViewPipeLineElmt;
  public filterString = '';
  public selectLine: PipeLineElmt;
  public listLineType: Translation;
  public listEnergies: Translation;
  public newPipeLine: PipeLineElmt;
  public updatePipeLine: PipeLineElmt;
  public userLogon: User;
  public pipeLineSaveAs = {
    newName: ''
  };
  public checkHideInfo = false;
  public checkActiveLine = 0;
  public listUnits: Array<Units>;
  public monetarySymbol = '';
  public monetaryUser: Units;
  public tankCapacitySymbol = '';
  public lineDimensionSymbol = '';
  public lineDepSymbol = '';
  public lineDepSymbol2 = '';
  public lossesSymbol = '';

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService,
    private router: Router, private api: ApiService, private translate: TranslateService) {
    this.pipelineType = 1;
    this.newPipeLine = new PipeLineElmt();
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    this.updatePipeLine = new PipeLineElmt();
    localStorage.setItem('pipelineCurr', '');
  }

  ngOnInit() {
    this.refrestListLineElmt();
    this.getListLineType();
    this.getListEnergies();

    this.isLoading = true;
    this.newPipeLine.ELT_TYPE = 2;
    this.newPipeLine.ID_COOLING_FAMILY = 2;
    this.newPipeLine.INSULATION_TYPE = 2;
    this.newPipeLine.LINE_RELEASE = 1;

    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));
    this.monetaryUser = JSON.parse(localStorage.getItem('MoneratyUser'));

    if (this.monetaryUser) {
      this.monetarySymbol = this.monetaryUser.SYMBOL;
    }

    if (this.listUnits) {

      for (let i = 0; i < this.listUnits.length; i++) {

        if (this.newPipeLine.ID_COOLING_FAMILY === 3) {
          if (Number(this.listUnits[i].TYPE_UNIT) === 25) {
            this.tankCapacitySymbol = this.listUnits[i].SYMBOL;
          }
        } else {
          if (Number(this.listUnits[i].TYPE_UNIT) === 18) {
            this.tankCapacitySymbol = this.listUnits[i].SYMBOL;
          }
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 17) {
          this.lineDimensionSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 11) {
          this.lineDepSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 26) {
          this.lineDepSymbol2 = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 12) {
          this.lossesSymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  ngAfterViewInit() {
  }

  refrestListLineElmt() {
    this.isLoading = true;
    this.referencedata.findRefPipeline()
      .subscribe(
      data => {
        for (let i = 0; i < data.mine.length ; i++) {
          // data.mine[i].ELMT_PRICE = Number(data.mine[i].ELMT_PRICE);
          // data.mine[i].ELT_LOSSES_1 = Number(data.mine[i].ELT_LOSSES_1);
          // data.mine[i].ELT_LOSSES_2 = Number(data.mine[i].ELT_LOSSES_2);
          data.mine[i].ID_COOLING_FAMILY = Number(data.mine[i].ID_COOLING_FAMILY);
        }
        for (let i = 0; i < data.others.length ; i++) {
          // data.others[i].ELMT_PRICE = Number(data.others[i].ELMT_PRICE);
          // data.others[i].ELT_LOSSES_1 = Number(data.others[i].ELT_LOSSES_1);
          // data.others[i].ELT_LOSSES_2 = Number(data.others[i].ELT_LOSSES_2);
          data.others[i].ID_COOLING_FAMILY = Number(data.others[i].ID_COOLING_FAMILY);
        }
        this.listPipeLines = data;
        this.isLoading = false;
      },
      err => {
        // console.log(err);
      },
      () => {
          if (localStorage.getItem('pipelineCurr') !== '') {
            const lineCurr = JSON.parse(localStorage.getItem('pipelineCurr'));
            if (lineCurr) {
              this.checkActiveLine = Number(lineCurr.ID_PIPELINE_ELMT);
              this.updatePipeLine = lineCurr;
              this.selectLine = lineCurr;
            }
          }
      }
    );
  }

  getListLineType() {
    this.api.getListLineType()
      .subscribe(
      data => {
        this.listLineType = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  getListEnergies() {
    this.api.getListEnergies()
      .subscribe(
      data => {
        this.listEnergies = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  onSelectPipeLine(line) {
    localStorage.setItem('pipelineCurr', '');
    this.checkActiveLine = 0;
    this.selectLine = line;
    this.updatePipeLine.LABEL = line.LABEL;
    this.updatePipeLine.LINE_VERSION = line.LINE_VERSION;
    this.updatePipeLine.LINE_COMMENT = line.LINE_COMMENT;
    this.updatePipeLine.MANUFACTURER = line.MANUFACTURER;
    this.updatePipeLine.ELT_TYPE = line.ELT_TYPE;
    this.updatePipeLine.ID_COOLING_FAMILY = line.ID_COOLING_FAMILY;
    this.updatePipeLine.INSULATION_TYPE = line.INSULATION_TYPE;
    this.updatePipeLine.ELMT_PRICE = line.ELMT_PRICE;
    this.updatePipeLine.ELT_SIZE = line.ELT_SIZE;
    this.updatePipeLine.ELT_LOSSES_1 = line.ELT_LOSSES_1;
    this.updatePipeLine.ELT_LOSSES_2 = line.ELT_LOSSES_2;
    this.updatePipeLine.LINE_RELEASE = Number(line.LINE_RELEASE);
    this.checkHideInfo = false;

    // console.log(this.updatePipeLine);
    // console.log(this.selectLine);
  }

  checkPipeline(pipeLine, check) {
    if (isNullOrUndefined(pipeLine.LABEL) || String(pipeLine.LABEL) === ''
    || isNumber(pipeLine.LABEL)) {
      this.toastr.error(this.translate.instant('Please specify Name	'), 'Error');
      return;
    }

    if (isNullOrUndefined(pipeLine.LINE_VERSION) || String(pipeLine.LINE_VERSION) === ''
    || isNaN(pipeLine.LINE_VERSION)) {
      this.toastr.error(this.translate.instant('Please specify Version	'), 'Error');
      return;
    }

    if (isNullOrUndefined(pipeLine.ELMT_PRICE) || String(pipeLine.ELMT_PRICE) === ''
    || isNaN(pipeLine.ELMT_PRICE) || pipeLine.ELMT_PRICE < 0) {
      this.toastr.error(this.translate.instant('Please specify Price'), 'Error');
      return;
    }

    if (isNullOrUndefined(pipeLine.ELT_SIZE) || String(pipeLine.ELT_SIZE) === ''
    || isNaN(pipeLine.ELT_SIZE) || pipeLine.ELT_SIZE < 0) {
      this.toastr.error(this.translate.instant('Please specify Size'), 'Error');
      return;
    }

    if (!pipeLine.LINE_RELEASE) {
      this.toastr.error(this.translate.instant('Please choose Status'), 'Error');
      return;
    }

    if (pipeLine.ELT_LOSSES_1 === undefined || !pipeLine.ELT_LOSSES_1) {
      pipeLine.ELT_LOSSES_1 = 0;
    }

    if (pipeLine.ELT_LOSSES_2 === undefined || !pipeLine.ELT_LOSSES_2) {
      pipeLine.ELT_LOSSES_2 = 0;
    }

    if (pipeLine.MANUFACTURER === undefined || !pipeLine.MANUFACTURER) {
      pipeLine.MANUFACTURER = '';
    }

    if (!pipeLine.LINE_COMMENT) {
      pipeLine.LINE_COMMENT = '';
    }

    if (Number(pipeLine.ELT_TYPE) === 1 || Number(pipeLine.ELT_TYPE) === 2) {

      if (Number(pipeLine.ELT_TYPE) === 2) {

        if (isNaN(pipeLine.ELT_LOSSES_1)) {
          this.toastr.error(this.translate.instant('Please specify Rate of evaporation'), 'Error');
          return;
        }
      } else {

        if (Number(pipeLine.ELT_TYPE) === 3 || Number(pipeLine.ELT_TYPE) === 4 || Number(pipeLine.ELT_TYPE) === 5
        || (Number(pipeLine.ELT_TYPE) === 2 && Number(pipeLine.ID_COOLING_FAMILY) === 3)) {
        } else {

          if (isNaN(pipeLine.ELT_LOSSES_1) || pipeLine.ELT_LOSSES_1 < 0) {
            this.toastr.error(this.translate.instant('Please specify Losses in get cold'), 'Error');
            return;
          }
        }

        if (Number(pipeLine.ELT_TYPE) === 1) {

          if (Number(pipeLine.ELT_TYPE) !== 2 && Number(pipeLine.ELT_TYPE) !== 3 && Number(pipeLine.ELT_TYPE) !== 4
          && Number(pipeLine.ELT_TYPE) !== 5) {
            if (isNaN(pipeLine.ELT_LOSSES_2) || pipeLine.ELT_LOSSES_2 < 0) {
              this.toastr.error(this.translate.instant('Please specify Permanent losses'), 'Error');
              return;
            }
          }
        }
      }
    }
    // if (isNullOrUndefined(pipeLine.ELT_LOSSES_1) || String(pipeLine.ELT_LOSSES_1) === ''
    // || isNaN(pipeLine.ELT_LOSSES_1) || pipeLine.ELT_LOSSES_1 < 0) {
    //   this.toastr.error('Please specify Losses 1', 'Error');
    //   return;
    // }
    // if (isNullOrUndefined(pipeLine.ELT_LOSSES_2) || String(pipeLine.ELT_LOSSES_2) === ''
    // || isNaN(pipeLine.ELT_LOSSES_2) || pipeLine.ELT_LOSSES_2 < 0) {
    //   this.toastr.error('Please specify Losses 2', 'Error');
    //   return;
    // }
    this.referencedata.checkPipeline({
      LABEL: pipeLine.LABEL,
      LINE_VERSION: pipeLine.LINE_VERSION,
      LINE_COMMENT: pipeLine.LINE_COMMENT,
      MANUFACTURER: pipeLine.MANUFACTURER,
      ELT_TYPE: pipeLine.ELT_TYPE,
      ID_COOLING_FAMILY: pipeLine.ID_COOLING_FAMILY,
      INSULATION_TYPE: pipeLine.INSULATION_TYPE,
      ELMT_PRICE: pipeLine.ELMT_PRICE,
      ELT_SIZE: pipeLine.ELT_SIZE,
      ELT_LOSSES_1: pipeLine.ELT_LOSSES_1,
      ELT_LOSSES_2: pipeLine.ELT_LOSSES_2,
      LINE_RELEASE: pipeLine.LINE_RELEASE
    }).subscribe(
      (res) => {
        if (res === 1) {
          if (check === 0) {
            this.savePipeLine();
          }

          if (check === 1) {
            this.updatePipeLineElmt();
          }
        } else {
          this.toastr.error(res.Message, 'Error');
        }
      },
      err => {
        // console.log(err);
      },
      () => {
      }
    );
  }

  savePipeLine() {
    if (this.newPipeLine.ELT_LOSSES_1 === undefined || !this.newPipeLine.ELT_LOSSES_1) {
      this.newPipeLine.ELT_LOSSES_1 = 0;
    }

    if (this.newPipeLine.ELT_LOSSES_2 === undefined || !this.newPipeLine.ELT_LOSSES_2) {
      this.newPipeLine.ELT_LOSSES_2 = 0;
    }

    if (this.newPipeLine.MANUFACTURER === undefined || !this.newPipeLine.MANUFACTURER) {
      this.newPipeLine.MANUFACTURER = '';
    }

    if (!this.newPipeLine.LINE_COMMENT) {
      this.newPipeLine.LINE_COMMENT = '';
    }

    this.isAddLine = true;
    this.referencedata.newPipeLine(this.newPipeLine).subscribe(
      response => {
        let success = true;

        if (response === undefined) {
          success = false;
        }

        if (response === 0) {
          this.toastr.error(this.translate.instant('Name and version already in use'), 'Error');
        } else {
          if (success) {
            localStorage.setItem('pipelineCurr', JSON.stringify(response));
            this.modalAddPipeLine.hide();
            this.toastr.success('Create pipe line', 'successfully');
            this.router.navigate(['/references/pipeline']);
            this.refrestListLineElmt();
            this.ngOnInit();
            this.checkHideInfo = false;
            this.newPipeLine = new PipeLineElmt();

          } else {
            this.toastr.error(this.translate.instant('Create pipeline error!'), 'Error');
          }
        }
        this.isAddLine = false;
      },
      err => {
        this.isAddLine = false;
        // console.log(err);
      },
      () => {
        this.isAddLine = false;
      }
    );
  }

  deletePipeLine(pipeLineElmt) {
    this.isDeletePipeLine = true;
    swal({
      title: this.translate.instant('Are you sure?'),
      text: this.translate.instant('You won`t be able to revert this!'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('Yes, delete it!')
    }).then((result) => {
      if (result.value) {
        swal(
          this.translate.instant('Deleted!'),
          this.translate.instant('Your file has been deleted.'),
          'success'
        );
        this.referencedata.deletePipeLine(pipeLineElmt.ID_PIPELINE_ELMT)
        .subscribe(
        data => {
          if (data === 1) {
            this.toastr.success(this.translate.instant('Delete pipe line'), 'successfully');
            this.updatePipeLine = new PipeLineElmt();
            this.checkHideInfo = true;
          } else {
            this.toastr.error(this.translate.instant('Delete pipe line error!'), 'Error');
          }
          this.isDeletePipeLine = false;
        },
        err => {
          // console.log(err);
          this.isDeletePipeLine = false;
        },
        () => {
          this.refrestListLineElmt();
          this.isDeletePipeLine = false;
          this.selectLine = new PipeLineElmt();
        }
        );
      }
    });
  }

  updatePipeLineElmt() {

    if (this.updatePipeLine.ELT_LOSSES_1 === undefined || !this.updatePipeLine.ELT_LOSSES_1) {
      this.updatePipeLine.ELT_LOSSES_1 = 0;
    }

    if (this.updatePipeLine.ELT_LOSSES_2 === undefined || !this.updatePipeLine.ELT_LOSSES_2) {
      this.updatePipeLine.ELT_LOSSES_2 = 0;
    }

    if (this.updatePipeLine.MANUFACTURER === undefined || !this.updatePipeLine.MANUFACTURER) {
      this.updatePipeLine.MANUFACTURER = '';
    }

    if (!this.updatePipeLine.LINE_COMMENT) {
      this.updatePipeLine.LINE_COMMENT = '';
    }

    this.isUpdatePipeLine = true;
    this.referencedata.updatePipeLine({
      ID_PIPELINE_ELMT: this.selectLine.ID_PIPELINE_ELMT,
      LABEL: this.updatePipeLine.LABEL,
      LINE_VERSION: this.updatePipeLine.LINE_VERSION,
      LINE_COMMENT: this.updatePipeLine.LINE_COMMENT,
      MANUFACTURER: this.updatePipeLine.MANUFACTURER,
      ELT_TYPE: this.updatePipeLine.ELT_TYPE,
      ID_COOLING_FAMILY: this.updatePipeLine.ID_COOLING_FAMILY,
      INSULATION_TYPE: this.updatePipeLine.INSULATION_TYPE,
      ELMT_PRICE: this.updatePipeLine.ELMT_PRICE,
      ELT_SIZE: this.updatePipeLine.ELT_SIZE,
      ELT_LOSSES_1: this.updatePipeLine.ELT_LOSSES_1,
      ELT_LOSSES_2: this.updatePipeLine.ELT_LOSSES_2,
      LINE_RELEASE: this.updatePipeLine.LINE_RELEASE
    }).subscribe(
      response => {
        let success = true;
        if (response === undefined) {
          success = false;
        }

        if (response === 0) {
          this.toastr.error(this.translate.instant('Name and version already in use!'), 'Error');
        } else {
          if (success) {
            localStorage.setItem('pipelineCurr', JSON.stringify(response));
            this.modalAddPipeLine.hide();
            this.toastr.success(this.translate.instant('Update pipe line'), 'successfully');
            this.router.navigate(['/references/pipeline']);
            this.refrestListLineElmt();
          } else {
            this.toastr.error(this.translate.instant('Update pipeline error!'), 'Error');
          }
        }
        this.isUpdatePipeLine = false;
      },
      err => {
        this.isUpdatePipeLine = false;
        // console.log(err);
      },
      () => {
        this.isUpdatePipeLine = false;
      }
    );
  }

  saveAsPipeLine(oldPipeLine) {
    if (!this.pipeLineSaveAs.newName || this.pipeLineSaveAs.newName === undefined) {
      this.toastr.error(this.translate.instant('Please specify name!'), 'Error');
      return;
    }

    if (typeof this.pipeLineSaveAs.newName === 'number') {
      this.toastr.error(this.translate.instant('Not a valid string in Name !'), 'Error');
      return;
    }

    this.isSaveAs = true;
    this.referencedata.saveAsPipeLine({
      ID_PIPELINE_ELMT: oldPipeLine.ID_PIPELINE_ELMT,
      LABEL: this.pipeLineSaveAs.newName
    })
      .subscribe(
        response => {
        let success = true;
        if (response === undefined) {
          success = false;
        }

        if (response === 0) {
          this.toastr.error(this.translate.instant('Name and version already in use!'), 'Error');
        } else {
          if (success) {
            localStorage.setItem('pipelineCurr', JSON.stringify(response));
            this.modalSaveAs.hide();
            this.toastr.success(this.translate.instant('Save as success !'), 'successfully');
            this.router.navigate(['/references/pipeline']);
            this.refrestListLineElmt();
            this.pipeLineSaveAs = {
              newName: ''
            };
          } else {
            this.toastr.error(this.translate.instant('Save as pipe line error!'), 'Error');
          }
        }
        this.isSaveAs = false;
      },
      err => {
        // console.log(err);
        this.isSaveAs = false;
      },
      () => {
        this.isSaveAs = false;
      }
    );
  }
}
