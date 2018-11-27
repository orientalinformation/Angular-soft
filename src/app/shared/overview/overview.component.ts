import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { ChainingService } from '../../api/services/chaining.service';
import { ApiService } from '../../api/services/api.service';
import { Study, User, OverviewChaining, ViewProduct } from '../../api/models';
import { ToastrService } from 'ngx-toastr';
import { isUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NewchainingComponent } from '../newchaining/newchaining.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public study: Study;
  public chainings: Array<OverviewChaining>;
  public newPhase: OverviewChaining;
  public newModalRef: BsModalRef;
  public user: User = null;

  constructor(public bsModalRef: BsModalRef, private apichaining: ChainingService, private toastr: ToastrService,
    private api: ApiService, private translate: TranslateService, private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.getOverviewChaining();
    }

    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  getOverviewChaining() {
    this.apichaining.getOverViewChaining(this.study.ID_STUDY).subscribe(
      data => {
        this.chainings = data;
        localStorage.setItem('chainings', JSON.stringify(data));
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }

  closeAndOpenStudy(idStudy) {
    localStorage.removeItem('study');
    localStorage.removeItem('meshView');
    localStorage.removeItem('productShape');
    localStorage.removeItem('productView');

    this.router.navigate(['/loading']);
    this.bsModalRef.hide();

    this.api.getStudyById(idStudy).subscribe(
      (resp: Study) => {
        localStorage.setItem('study', JSON.stringify(resp));
        this.api.openStudy(resp.ID_STUDY).subscribe(
          data => {
            this.api.getProductViewModel(resp.ID_PROD).subscribe(
              (response: ViewProduct) => {
                localStorage.setItem('productView', JSON.stringify(response));
                const elements = response.elements;
                if (elements.length > 0) {
                  localStorage.setItem('productShape', elements[0].ID_SHAPE.toString());
                } else {
                  localStorage.removeItem('productShape');
                }
              },
              err => {
                // console.log(err);
              },
              () => {
                this.router.navigate(['/input']);
              }
            );
          },
          err => {
            // console.log(err);
          },
          () => {
          }
        );
      },
      (err) => {
        // console.log(err);
      },
      () => {

      }
    );
  }

  addNewPhase() {
    this.newPhase = new OverviewChaining();
    this.newPhase.hasSEquipment = 0;
    this.newPhase.shape = this.chainings[this.chainings.length - 1].shape;
    this.newPhase.layer = this.chainings[this.chainings.length - 1].layer;
    this.newPhase.ID_STUDY = null;
    this.chainings.push(this.newPhase);
    // if (this.chainings.length > 0 && this.chainings.length < 3) {
    // } else {
    //   this.toastr.error(this.translate.instant('Can not add more than 3 Phase!'), 'Error');
    // }
  }

  createChildStudyDialog() {
    this.newModalRef = this.modalService.show(NewchainingComponent);
  }

  disabledFiled() {
    if (this.chainings) {
      return (this.chainings[this.chainings.length - 1].StudyEquipment == null);
    }
  }

  userLogin() {
    return !(Number(this.study.ID_USER) === Number(this.user.ID_USER));
  }
}
