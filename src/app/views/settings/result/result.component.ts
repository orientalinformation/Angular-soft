import { Component, OnInit } from '@angular/core';
import { TempRecordPtsDef } from '../../../api/models/temp-record-pts-def';
import { ApiService } from '../../../api/services';
import { AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit {
  public temprecordptsdef: TempRecordPtsDef;
  public laddaSavingResult = false;
  public isLoading = false;

  constructor(private api: ApiService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit() {
    this.isLoading = true;
  }

  ngAfterViewInit() {
    this.isLoading = true;
    this.api.getMyTempRecordPtsDef().subscribe(
      data => {
        data.AXIS1_PT_TOP_SURF_DEF = Number(data.AXIS1_PT_TOP_SURF_DEF);
        data.AXIS2_PT_TOP_SURF_DEF = Number(data.AXIS2_PT_TOP_SURF_DEF);
        data.AXIS3_PT_TOP_SURF_DEF = Number(data.AXIS3_PT_TOP_SURF_DEF);

        data.AXIS1_PT_INT_PT_DEF = Number(data.AXIS1_PT_INT_PT_DEF);
        data.AXIS2_PT_INT_PT_DEF = Number(data.AXIS2_PT_INT_PT_DEF);
        data.AXIS3_PT_INT_PT_DEF = Number(data.AXIS3_PT_INT_PT_DEF);

        data.AXIS1_PT_BOT_SURF_DEF = Number(data.AXIS1_PT_BOT_SURF_DEF);
        data.AXIS2_PT_BOT_SURF_DEF = Number(data.AXIS2_PT_BOT_SURF_DEF);
        data.AXIS3_PT_BOT_SURF_DEF = Number(data.AXIS3_PT_BOT_SURF_DEF);

        data.AXIS2_PL_1_3_DEF = Number(data.AXIS2_PL_1_3_DEF);
        data.AXIS3_PL_1_2_DEF = Number(data.AXIS3_PL_1_2_DEF);
        data.AXIS1_PL_2_3_DEF = Number(data.AXIS1_PL_2_3_DEF);

        data.AXIS2_AX_1_DEF = Number(data.AXIS2_AX_1_DEF);
        data.AXIS3_AX_1_DEF = Number(data.AXIS3_AX_1_DEF);

        data.AXIS1_AX_2_DEF = Number(data.AXIS1_AX_2_DEF);
        data.AXIS3_AX_2_DEF = Number(data.AXIS3_AX_2_DEF);

        data.AXIS1_AX_3_DEF = Number(data.AXIS1_AX_3_DEF);
        data.AXIS2_AX_3_DEF = Number(data.AXIS2_AX_3_DEF);

        this.temprecordptsdef = data;
        this.isLoading = false;
      }
    );
  }

  saveMyTempRecordPtsDef() {
    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_PT_TOP_SURF_DEF)
    || String(this.temprecordptsdef.AXIS1_PT_TOP_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_PT_TOP_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_PT_TOP_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Top- X'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_PT_TOP_SURF_DEF)
    || String(this.temprecordptsdef.AXIS2_PT_TOP_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_PT_TOP_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_PT_TOP_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Top- Y '), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_PT_TOP_SURF_DEF)
    || String(this.temprecordptsdef.AXIS3_PT_TOP_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_PT_TOP_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_PT_TOP_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Top- Z '), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_PT_INT_PT_DEF)
    || String(this.temprecordptsdef.AXIS1_PT_INT_PT_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_PT_INT_PT_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_PT_INT_PT_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Inside- X'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_PT_INT_PT_DEF)
    || String(this.temprecordptsdef.AXIS2_PT_INT_PT_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_PT_INT_PT_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_PT_INT_PT_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Inside- Y'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_PT_INT_PT_DEF)
    || String(this.temprecordptsdef.AXIS3_PT_INT_PT_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_PT_INT_PT_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_PT_INT_PT_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Inside- Z'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_PT_BOT_SURF_DEF)
    || String(this.temprecordptsdef.AXIS1_PT_BOT_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_PT_BOT_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_PT_BOT_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Bottom- X'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_PT_BOT_SURF_DEF)
    || String(this.temprecordptsdef.AXIS2_PT_BOT_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_PT_BOT_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_PT_BOT_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Bottom- Y'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_PT_BOT_SURF_DEF)
    || String(this.temprecordptsdef.AXIS3_PT_BOT_SURF_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_PT_BOT_SURF_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_PT_BOT_SURF_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Bottom- Z'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_PL_1_2_DEF)
    || String(this.temprecordptsdef.AXIS3_PL_1_2_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_PL_1_2_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_PL_1_2_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Plan 12- Y'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_PL_1_3_DEF)
    || String(this.temprecordptsdef.AXIS2_PL_1_3_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_PL_1_3_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_PL_1_3_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Plan 13- Z'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_PL_2_3_DEF)
    || String(this.temprecordptsdef.AXIS1_PL_2_3_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_PL_2_3_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_PL_2_3_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Plan 23- X'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_AX_1_DEF)
    || String(this.temprecordptsdef.AXIS2_AX_1_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_AX_1_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_AX_1_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 1- Y'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_AX_1_DEF)
    || String(this.temprecordptsdef.AXIS3_AX_1_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_AX_1_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_AX_1_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 1- Z'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_AX_2_DEF)
    || String(this.temprecordptsdef.AXIS1_AX_2_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_AX_2_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_AX_2_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 2- X '), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS3_AX_2_DEF)
    || String(this.temprecordptsdef.AXIS3_AX_2_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS3_AX_2_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS3_AX_2_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 2- Z '), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS1_AX_3_DEF)
    || String(this.temprecordptsdef.AXIS1_AX_3_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS1_AX_3_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS1_AX_3_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 3- X'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.temprecordptsdef.AXIS2_AX_3_DEF)
    || String(this.temprecordptsdef.AXIS2_AX_3_DEF) === ''
    || isNaN(this.temprecordptsdef.AXIS2_AX_3_DEF)
    || !isInteger(Number(this.temprecordptsdef.AXIS2_AX_3_DEF))) {
      this.toastr.error(this.translate.instant('Please specify Axis 3- Y'), 'Error');
      return;
    }

    this.laddaSavingResult = true;
    this.api.saveMyTempRecordPtsDef({
      axis1TopSurf: Number(this.temprecordptsdef.AXIS1_PT_TOP_SURF_DEF),
      axis2TopSurf: Number(this.temprecordptsdef.AXIS2_PT_TOP_SURF_DEF),
      axis3TopSurf: Number(this.temprecordptsdef.AXIS3_PT_TOP_SURF_DEF),
      axis1IntPt: Number(this.temprecordptsdef.AXIS1_PT_INT_PT_DEF),
      axis2IntPt: Number(this.temprecordptsdef.AXIS2_PT_INT_PT_DEF),
      axis3IntPt: Number(this.temprecordptsdef.AXIS3_PT_INT_PT_DEF),
      axis1BotSurf: Number(this.temprecordptsdef.AXIS1_PT_BOT_SURF_DEF),
      axis2BotSurf: Number(this.temprecordptsdef.AXIS2_PT_BOT_SURF_DEF),
      axis3BotSurf: Number(this.temprecordptsdef.AXIS3_PT_BOT_SURF_DEF),
      axis3PL12: Number(this.temprecordptsdef.AXIS3_PL_1_2_DEF),
      axis2PL13: Number(this.temprecordptsdef.AXIS2_PL_1_3_DEF),
      axis1PL23: Number(this.temprecordptsdef.AXIS1_PL_2_3_DEF),
      axis2Axe1: Number(this.temprecordptsdef.AXIS2_AX_1_DEF),
      axis3Axe1: Number(this.temprecordptsdef.AXIS3_AX_1_DEF),
      axis1Axe2: Number(this.temprecordptsdef.AXIS1_AX_2_DEF),
      axis3Axe2: Number(this.temprecordptsdef.AXIS3_AX_2_DEF),
      axis1Axe3: Number(this.temprecordptsdef.AXIS1_AX_3_DEF),
      axis2Axe3: Number(this.temprecordptsdef.AXIS2_AX_3_DEF)
    }).subscribe(
      res => {
        if (res === 1) {
          this.toastr.success(this.translate.instant('Save result setting completed'), 'successfully');
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        this.laddaSavingResult = false;
      },
      () => {
        this.laddaSavingResult = false;
      }
    );
  }
}
