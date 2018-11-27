import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { InputService } from '../../api/services/input.service';
import { ApiService } from '../../api/services/api.service';
import { OverviewChaining, ViewStudyEquipment, Study, ViewProduct } from '../../api/models';
import { ToastrService } from 'ngx-toastr';
import { isUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { ChainingService } from '../../api/services/chaining.service';
import { Router } from '@angular/router';
import { OverviewComponent } from '../overview/overview.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';


@Component({
  selector: 'app-newchaining',
  templateUrl: './newchaining.component.html',
  styleUrls: ['./newchaining.component.scss']
})
export class NewchainingComponent implements OnInit {
  public chainings: Array<OverviewChaining>;
  public equipments: ViewStudyEquipment[];
  public equipmentsLoaded = false;
  public selectedEquipmentId = 0;
  public childStudyName = '';
  public laddaConfirm = false;
  public overviewModalRef: BsModalRef;

  constructor(public newModalRef: BsModalRef, private apichaining: ChainingService, private toastr: ToastrService,
    private api: ApiService, private translate: TranslateService, private router: Router, private modalService: BsModalService) { }

  ngOnInit() {
    this.chainings = JSON.parse(localStorage.getItem('chainings'));
    this.openCreateModal();
  }

  openCreateModal() {
    this.equipmentsLoaded = false;
    this.api.getStudyEquipments(this.chainings[this.chainings.length - 1].ID_STUDY).subscribe(
      (resp: ViewStudyEquipment[]) => {
        this.equipments = resp;
        this.equipmentsLoaded = true;
      },
      err => {
        // console.log(err);
      },
      () => {
        if (this.equipments && this.equipments.length > 0) {
        } else {
          this.newModalRef.hide();
          // swal('Error', this.translate.instant('The study is not completely defined!'), 'error');
          return;
        }
      }
    );
  }

  onConfirmCreateChildStudy() {
    if (this.childStudyName.length === 0) {
      swal('Error', this.translate.instant('Please input child study name!'), 'error');
      return;
    }

    if (Number(this.selectedEquipmentId) === 0) {
      swal('Error', this.translate.instant('Please select an equipment!'), 'error');
      return;
    }

    if (this.equipments && this.equipments.length > 0) {
      if (this.equipments) {
        for (let i = 0; i < this.equipments.length; i++) {
          const element = this.equipments[i];
          if (Number(this.equipments[i].ID_STUDY_EQUIPMENTS) === Number(this.selectedEquipmentId)) {
            if (Number(element.BRAIN_TYPE) === 0) {
              swal('Error', this.translate.instant('"There is no results for this equipment" ' +
                'if the equipment has not been calculated'), 'error');
              return;
            }
          }
        }
      }
    }

    this.laddaConfirm = true;
    this.api.createChildStudy({
      id: this.chainings[this.chainings.length - 1].ID_STUDY,
      studyName: this.childStudyName,
      stdEqpId: this.selectedEquipmentId
    }).subscribe(
      (resp: Study) => {
        this.laddaConfirm = false;
        this.closeAndOpenStudy(resp.ID_STUDY);
      },
      err => {
        swal('Error', this.translate.instant('There is no results for this equipment.'), 'error');
        this.laddaConfirm = false;
      },
      () => {
        this.newModalRef.hide();
      }
    );
  }

  closeAndOpenStudy(id) {
    localStorage.removeItem('study');
    localStorage.removeItem('meshView');
    localStorage.removeItem('productShape');
    localStorage.removeItem('productView');

    this.router.navigate(['/loading']);

    this.api.getStudyById(id).subscribe(
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
                  this.overviewModalRef = this.modalService.show(OverviewComponent, { class: 'modal-lg' });
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
}
