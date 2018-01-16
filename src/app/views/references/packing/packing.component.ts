import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ReferencedataService } from '../../../api/services/referencedata.service';
import { PackingElmt, ViewPackingElmt, NewPacking } from '../../../api/models';
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
  public filterString = '';
  public isAddPacking = false;
  public listPackingElmts: ViewPackingElmt;
  public selectPackingElmt: PackingElmt;
  public newPackingElmt: NewPacking;

  constructor(private referencedata: ReferencedataService, private toastr: ToastrService, private router: Router) {
    this.newPackingElmt = new NewPacking();
    // this.newPackingElmt.release = 1;
   }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.refrestListPackingElmt();
  }

  onSelectPackingElmt(packingElmt) {
    this.selectPackingElmt = packingElmt;
    console.log(this.selectPackingElmt);
  }

  refrestListPackingElmt() {
    this.referencedata.findRefPackingElmt()
      .subscribe(
      data => {
        // console.log(data);
        this.listPackingElmts = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }

  newPacking() {
    if (!this.newPackingElmt.name || this.newPackingElmt.name === undefined) {
      swal('Oops..', 'Please specify name!', 'warning');
      return;
    }
    if (typeof this.newPackingElmt.name === 'number') {
      swal('Oops..', 'Not a valid string in Name !', 'warning');
      return;
    }
    if (!this.newPackingElmt.version) {
      swal('Oops..', 'Please specify version!', 'warning');
      return;
    }
    if (isNaN(this.newPackingElmt.version)) {
      swal('Oops..', 'Not a valid number in Version !', 'warning');
      return;
    }
    if (!this.newPackingElmt.conductivity) {
      swal('Oops..', 'Please specify Lambda thermal conductivity!', 'warning');
      return;
    }
    if (isNaN(this.newPackingElmt.conductivity)) {
      swal('Oops..', 'Not a valid number in Lambda thermal conductivity !', 'warning');
      return;
    }
    this.isAddPacking = true;
    this.referencedata.NewPacking(this.newPackingElmt).subscribe(
      response => {
        let success = true;
        if (response === 0) {
          success = false;
        }

        if (success) {
          this.modalAddPackingElmt.hide();
          this.newPackingElmt = new NewPacking();
          this.toastr.success('Create user', 'successfully');
          this.router.navigate(['/references/packing']);
          this.refrestListPackingElmt();
        } else {
          swal('Oops..', 'Create user error!', 'error');
        }
        this.isAddPacking = false;
      },
      err => {
        this.isAddPacking = false;
      },
      () => {
        this.isAddPacking = false;
        this.newPackingElmt = new NewPacking();
        // this.newPackingElmt.release = 1;
      }
    );
  }
}
