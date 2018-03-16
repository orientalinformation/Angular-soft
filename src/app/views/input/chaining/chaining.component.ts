import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, AfterContentInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ViewChaining, Study, ViewProduct, ViewStudyEquipment } from '../../../api/models';
import { ApiService } from '../../../api/services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-chaining',
  templateUrl: './chaining.component.html',
  styleUrls: ['./chaining.component.scss']
})
export class ChainingComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Output('loaded') loaded = new EventEmitter();
  @ViewChild('chainingModal') chainingModal: ModalDirective;
  public model: ViewChaining;
  public study: Study;
  public numberOfChildren = 0;
  public visibleObjectives = false;
  public visibleProduct = false;
  public visibleInitialTemp = false;
  public visiblePacking = false;
  public visibleEquipment = false;
  public equipmentsLoaded = false;
  public laddaConfirm = false;
  public equipments: ViewStudyEquipment[];
  public selectedEquipmentId = 0;
  public childStudyName = '';

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.model = null;
  }

  chainingEnabled() {
    return this.study.CHAINING_CONTROLS;
  }

  studyHasParent() {
    return this.study.PARENT_ID !== 0;
  }

  studyHasChild() {
    return this.study.HAS_CHILD;
  }

  addingComponentAllowed() {
    return this.study.CHAINING_ADD_COMP_ENABLE;
  }

  showProduct() {
    this.visibleProduct = true;
  }

  showEquipment() {
    this.visibleEquipment = true;
  }

  showPacking() {
    this.visiblePacking = true;
  }

  ngAfterViewInit() {
  }

  ngAfterContentInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.api.getChainingModel(this.study.ID_STUDY).subscribe(
      (resp: ViewChaining) => {
        this.setModel(resp);
        this.loaded.emit();
        console.log('chaining controls init');
      },
      (err) => {}
    );
  }

  setStudy(study) {
    this.study = study;
  }

  setModel(model) {
    this.model = model;
    this.numberOfChildren = 0;
    if (typeof this.model.children !== 'undefined' && this.model.children != null) {
      this.numberOfChildren = this.model.children.length;
    }
  }

  showObjectives() {
    this.visibleObjectives = true;
  }

  showInitialTemp() {
    this.visibleInitialTemp = true;
  }

  openCreateModal() {
    this.equipmentsLoaded = false;
    this.chainingModal.show();
    this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
      (resp: ViewStudyEquipment[]) => {
        this.equipments = resp;
        this.equipmentsLoaded = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  onConfirmCreateChildStudy() {
    if (this.childStudyName.length === 0) {
      swal('Error', 'Please input child study name!', 'error');
      return;
    }

    if (this.selectedEquipmentId == 0) {
      swal('Error', 'Please select an equipment!', 'error');
      return;
    }

    this.laddaConfirm = true;
    this.api.createChildStudy({
      id: this.study.ID_STUDY,
      studyName: this.childStudyName,
      stdEqpId: this.selectedEquipmentId
    }).subscribe(
      (resp: Study) => {
        this.laddaConfirm = false;
        this.closeAndOpenStudy(resp.ID_STUDY);
      },
      err => {
        console.log(err);
        swal('Error', 'Error when creating chaining child study, <br>please check console log for more detail!', 'error');
        this.laddaConfirm = false;
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
        this.api.openStudy(resp.ID_STUDY)
          .subscribe(
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
                  console.log(err);
                },
                () => {
                  this.router.navigate(['/input']);
                }
              );
            },
            err => {
              console.log(err);
            },
            () => {
            }
          );
      },
      (err) => {
        console.log(err);
      },
      () => {

      }
    );
  }

}
