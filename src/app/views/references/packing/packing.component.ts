import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ReferencedataService } from '../../../api/services/referencedata.service';
import { PackingElmt, ViewPackingElmt, User, Units } from '../../../api/models';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Pipe({ name: 'packingElmtFilter' })
export class PackingElmtFilterPipe implements PipeTransform {
  public transform(values: PackingElmt[], filter: string): any[] {
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
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit, AfterViewInit {
  @ViewChild('modalAddPackingElmt') public modalAddPackingElmt: ModalDirective;
  @ViewChild('modalSaveAs') public modalSaveAs: ModalDirective;
  public filterString = '';
  public isAddPacking = false;
  public isDeletePacking = false;
  public isUpdatePacking = false;
  public isSaveAs = false;
  public isLoading = false;
  public listPackingElmts: ViewPackingElmt;
  public selectPackingElmt: PackingElmt;
  public newPackingElmt: PackingElmt;
  public updatePackingElmt: PackingElmt;
  public userLogon: User;
  public packingSaveAs = {
    newName: '',
    newVersion: 0
  };
  public checkHideInfo = false;
  public checkActivePacking = 0;
  public listUnits: Array<Units>;
  public conductivitySymbol = '';

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService,
    private router: Router, private translate: TranslateService) {
    this.newPackingElmt = new PackingElmt();
    this.updatePackingElmt = new PackingElmt();
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('packingCurr', '');
  }

  ngOnInit() {
    this.isLoading = true;
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));

    if (this.listUnits) {

      for (let i = 0; i < this.listUnits.length; i++) {


        if (Number(this.listUnits[i].TYPE_UNIT) === 10) {
          this.conductivitySymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.refrestListPackingElmt();
  }

  onSelectPackingElmt(packingElmt) {
    localStorage.setItem('packingCurr', '');
    this.checkActivePacking = 0;
    this.selectPackingElmt = packingElmt;

    this.updatePackingElmt.LABEL = packingElmt.LABEL;
    this.updatePackingElmt.PACKING_VERSION = packingElmt.PACKING_VERSION;
    this.updatePackingElmt.PACKINGCOND = packingElmt.PACKINGCOND;
    this.updatePackingElmt.PACKING_COMMENT = packingElmt.PACKING_COMMENT;
    this.updatePackingElmt.PACKING_RELEASE = packingElmt.PACKING_RELEASE;
    this.checkHideInfo = false;
  }

  refrestListPackingElmt() {
    this.isLoading = true;
    this.referencedata.findRefPackingElmt()
      .subscribe(
      data => {
        this.listPackingElmts = data;
        this.isLoading = false;
      },
      err => {
        // console.log(err);
      },
      () => {
        if (localStorage.getItem('packingCurr') !== '') {
          const packingCurr = JSON.parse(localStorage.getItem('packingCurr'));
          this.checkActivePacking = Number(packingCurr.ID_PACKING_ELMT);
          this.updatePackingElmt = packingCurr;
          this.selectPackingElmt = packingCurr;
        }
      }
    );
  }

  newPacking() {
    this.isAddPacking = true;
    this.referencedata.newPacking(this.newPackingElmt).subscribe(
      response => {
        let success = true;
        if (response === undefined) {
          success = false;
        }

        if (response === 0) {
          this.toastr.error(this.translate.instant('Name and version already in use'), 'Error');
        } else {
          if (success) {
            localStorage.setItem('packingCurr', JSON.stringify(response));
            this.checkHideInfo = false;
            this.modalAddPackingElmt.hide();
            this.toastr.success(this.translate.instant('Create user'), 'successfully');
            this.router.navigate(['/references/packing']);
            this.refrestListPackingElmt();
            this.newPackingElmt = new PackingElmt();
          } else {
            this.toastr.error(this.translate.instant('Create packing error'), 'Error');
          }
        }

        this.isAddPacking = false;
      },
      err => {
        this.isAddPacking = false;
      },
      () => {
        this.isAddPacking = false;
      }
    );
  }

  deletePacking(packing) {
    this.isDeletePacking = true;
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
        this.referencedata.deletePacking(packing.ID_PACKING_ELMT)
        .subscribe(
        data => {
          if (data === 1) {
            this.toastr.success(this.translate.instant('Delete packing'), 'successfully');
            this.refrestListPackingElmt();
            this.updatePackingElmt = new PackingElmt();
            this.selectPackingElmt = new PackingElmt();
            this.checkHideInfo = true;
          } else {
            this.toastr.success(this.translate.instant('Delete packing'), 'Error');
          }
          this.isDeletePacking = false;
        },
        err => {
          // console.log(err);
          this.isDeletePacking = false;
        },
        () => {
          this.isDeletePacking = false;
        }
        );
      }
    });
  }

  updatePacking () {
    this.isUpdatePacking = true;
    this.referencedata.updatePacking({
      ID_PACKING_ELMT: this.selectPackingElmt.ID_PACKING_ELMT,
      LABEL: this.updatePackingElmt.LABEL,
      PACKING_VERSION: this.updatePackingElmt.PACKING_VERSION,
      PACKINGCOND: this.updatePackingElmt.PACKINGCOND,
      PACKING_COMMENT: this.updatePackingElmt.PACKING_COMMENT,
      PACKING_RELEASE: this.updatePackingElmt.PACKING_RELEASE
    }).subscribe(
      response => {
        let success = true;

        if (response === undefined) {
          success = false;
        }

        if (response === -1) {
          this.toastr.error(this.translate.instant('Not found packaging!'), 'Error');
        } else if (response === 0) {
          this.toastr.error(this.translate.instant('Name and version already in use!'), 'Error');
        } else {
          if (success) {
            localStorage.setItem('packingCurr', JSON.stringify(response));
            this.refrestListPackingElmt();
            this.toastr.success(this.translate.instant('Update packaging'), 'successfully');
            this.router.navigate(['/references/packing']);
          } else {
            this.toastr.error(this.translate.instant('Update packaging error !'), 'Error');
          }
        }
        this.isUpdatePacking = false;
      },
      err => {
        this.isUpdatePacking = false;
      },
      () => {
        this.isUpdatePacking = false;
      }
    );
  }

  saveAsPacking (oldPacking) {
    if (!this.packingSaveAs.newName || this.packingSaveAs.newName === undefined) {
      this.toastr.error(this.translate.instant('Please specify name!'), 'Error');
      return;
    }
    if (typeof this.packingSaveAs.newName === 'number') {
      this.toastr.error(this.translate.instant('Not a valid string in Name'), 'Error');
      return;
    }
    if (String(this.packingSaveAs.newVersion) === '') {
      this.toastr.error(this.translate.instant('Please specify version'), 'Error');
      return;
    }
    if (isNaN(this.packingSaveAs.newVersion)) {
      this.toastr.error(this.translate.instant('Not a valid number in Version'), 'Error');
      return;
    }
    this.isSaveAs = true;
    this.referencedata.saveAsPacking({
      ID_PACKING_ELMT: oldPacking.ID_PACKING_ELMT,
      LABEL: this.packingSaveAs.newName,
      PACKING_VERSION: this.packingSaveAs.newVersion
    })
      .subscribe(
        response => {
          let success = true;

          if (response === undefined) {
            success = false;
          }

          if (response === 0) {
            this.toastr.error(this.translate.instant('Name and version already in use'), 'Error');
          } else {
            if (success) {
              localStorage.setItem('packingCurr', JSON.stringify(response));
              this.modalSaveAs.hide();
              this.refrestListPackingElmt();
              this.toastr.success(this.translate.instant('Save as success !'), 'successfully');
              this.router.navigate(['/references/packing']);
              this.updatePackingElmt = new PackingElmt();
              this.packingSaveAs = {
                newName: '',
                newVersion: 0
              };
            } else {
              this.toastr.error(this.translate.instant('Save as packaging error'), 'Error');
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

  checkDataPacking(packing, check) {

    if (isNullOrUndefined(packing.LABEL) || String(packing.LABEL) === ''
    || isNumber(packing.LABEL)) {
      this.toastr.error(this.translate.instant('Please specify Name	'), 'Error');
      return;
    }

    if (isNullOrUndefined(packing.PACKING_VERSION) || String(packing.PACKING_VERSION) === ''
    || isNaN(packing.PACKING_VERSION)) {
      this.toastr.error(this.translate.instant('Please specify Version	'), 'Error');
      return;
    }

    if (isNullOrUndefined(packing.PACKINGCOND) || String(packing.PACKINGCOND) === ''
    || isNaN(packing.PACKINGCOND) || !packing.PACKINGCOND) {
      this.toastr.error(this.translate.instant('Please specify Lambda thermal conductivity 	'), 'Error');
      return;
    }

    if (!packing.PACKING_RELEASE) {
      this.toastr.error(this.translate.instant('Please choose status'), 'Error');
      return;
    }
    if (!packing.PACKING_COMMENT) {
      packing.PACKING_COMMENT = '';
    }
    this.referencedata.checkPacking({
      ID_PACKING_ELMT: packing.ID_PACKING_ELMT,
      LABEL: packing.LABEL,
      PACKING_VERSION: packing.PACKING_VERSION,
      PACKINGCOND: packing.PACKINGCOND,
      PACKING_COMMENT: packing.PACKING_COMMENT,
      PACKING_RELEASE: packing.PACKING_RELEASE
    }).subscribe(
      (res) => {
        if (res === 1) {
          if (check === 0) {
            this.newPacking();
          }
          if (check === 1) {
            this.updatePacking();
          }
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        // console.log(err);
      },
      () => {
      }
    );
  }
}
