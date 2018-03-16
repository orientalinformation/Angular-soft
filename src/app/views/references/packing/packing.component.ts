import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ReferencedataService } from '../../../api/services/referencedata.service';
import { PackingElmt, ViewPackingElmt, User } from '../../../api/models';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

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

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService, private router: Router) {
    this.newPackingElmt = new PackingElmt();
    this.updatePackingElmt = new PackingElmt();
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('packingCurr', '');
  }

  ngOnInit() {
    this.isLoading = true;
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
        console.log(err);
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
    if (!this.newPackingElmt.LABEL || this.newPackingElmt.LABEL === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (typeof this.newPackingElmt.LABEL === 'number') {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!this.newPackingElmt.PACKING_VERSION) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.newPackingElmt.PACKING_VERSION)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    if (!this.newPackingElmt.PACKINGCOND) {
      swal('Oops..', 'Please specify Lambda thermal conductivity!', 'warning');
      return;
    }
    if (isNaN(this.newPackingElmt.PACKINGCOND)) {
      swal('Oops..', 'Not a valid number in Lambda thermal conductivity !', 'warning');
      return;
    }
    if (!this.newPackingElmt.PACKING_RELEASE) {
      swal('Oops..', 'Please choose status !', 'warning');
      return;
    }
    if (!this.newPackingElmt.PACKING_COMMENT) {
      this.newPackingElmt.PACKING_COMMENT = '';
    }
    this.isAddPacking = true;
    this.referencedata.newPacking(this.newPackingElmt).subscribe(
      response => {
        let success = true;
        if (response === undefined) {
          success = false;
        }

        if (response === 0) {
          swal('Oops..', 'Name and version already in use!', 'error');
        } else {
          if (success) {
            localStorage.setItem('packingCurr', JSON.stringify(response));
            this.checkHideInfo = false;
            this.modalAddPackingElmt.hide();
            this.toastr.success('Create user', 'successfully');
            this.router.navigate(['/references/packing']);
            this.refrestListPackingElmt();
            this.newPackingElmt = new PackingElmt();
          } else {
            swal('Oops..', 'Create packing error!', 'error');
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
      title: 'Are you sure?',
      text: 'You won`t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
        this.referencedata.deletePacking(packing.ID_PACKING_ELMT)
        .subscribe(
        data => {
          if (data === 1) {
            this.toastr.success('Delete packing', 'successfully');
            this.refrestListPackingElmt();
            this.updatePackingElmt = new PackingElmt();
            this.selectPackingElmt = new PackingElmt();
            this.checkHideInfo = true;
          } else {
            swal('Oops..', 'Delete packing error!', 'error');
          }
          this.isDeletePacking = false;
        },
        err => {
          console.log(err);
          this.isDeletePacking = false;
        },
        () => {
          this.isDeletePacking = false;
        }
        );
      }
    });
  }

  updatePacking (packing) {
    if (!packing.LABEL || packing.LABEL === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (typeof packing.LABEL === 'number') {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!packing.PACKING_VERSION) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(packing.PACKING_VERSION)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    if (!packing.PACKINGCOND) {
      swal('Oops..', 'Please specify Lambda thermal conductivity!', 'warning');
      return;
    }
    if (isNaN(packing.PACKINGCOND)) {
      swal('Oops..', 'Not a valid number in Lambda thermal conductivity !', 'warning');
      return;
    }
    if (!packing.PACKING_RELEASE) {
      swal('Oops..', 'Please choose status !', 'warning');
      return;
    }
    if (!packing.PACKING_RELEASE) {
      packing.PACKING_RELEASE = '';
    }

    this.isUpdatePacking = true;
    this.referencedata.updatePacking({
      ID_PACKING_ELMT: this.selectPackingElmt.ID_PACKING_ELMT,
      LABEL: packing.LABEL,
      PACKING_VERSION: packing.PACKING_VERSION,
      PACKINGCOND: packing.PACKINGCOND,
      PACKING_COMMENT: packing.PACKING_COMMENT,
      PACKING_RELEASE: packing.PACKING_RELEASE
    }).subscribe(
      response => {
        let success = true;

        if (response === undefined) {
          success = false;
        }

        if (response === -1) {
          swal('Oops..', 'Not found packing!', 'error');
        } else if (response === 0) {
          swal('Oops..', 'Name and version already in use!', 'error');
        } else {
          if (success) {
            localStorage.setItem('packingCurr', JSON.stringify(response));
            this.refrestListPackingElmt();
            this.toastr.success('Update packing', 'successfully');
            this.router.navigate(['/references/packing']);
          } else {
            swal('Oops..', 'Update packing error!', 'error');
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
    console.log(this.packingSaveAs.newVersion);
    if (!this.packingSaveAs.newName || this.packingSaveAs.newName === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (typeof this.packingSaveAs.newName === 'number') {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (String(this.packingSaveAs.newVersion) === '') {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.packingSaveAs.newVersion)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
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
            swal('Oops..', 'Name and version already in use!', 'error');
          } else {
            if (success) {
              localStorage.setItem('packingCurr', JSON.stringify(response));
              this.modalSaveAs.hide();
              this.refrestListPackingElmt();
              this.toastr.success('Save as success !', 'successfully');
              this.router.navigate(['/references/packing']);
              this.updatePackingElmt = new PackingElmt();
              this.packingSaveAs = {
                newName: '',
                newVersion: 0
              };
            } else {
              swal('Oops..', 'Save as packing error!', 'error');
            }
          }
          this.isSaveAs = false;
        },
        err => {
          console.log(err);
          this.isSaveAs = false;
        },
        () => {
          this.isSaveAs = false;
        }
      );
  }
}
