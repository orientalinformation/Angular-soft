import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TextService } from '../../../shared/text.service';
import { TranslateService } from '@ngx-translate/core';
import * as Models from '../../../api/models';

import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Symbol } from '../../../api/models/symbol';
import { ChainingComponent } from '../chaining/chaining.component';
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, AfterContentInit {
  @ViewChild('addEquipModal') public addEquipModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('chainingControls') chainingControls: ChainingComponent;

  public isUpdatePrice = false;
  public isUpdateInterval = false;
  public  showTable = false;
  public study: Models.Study;
  public equipmentsView: Models.ViewStudyEquipment[];
  public laddaDeletingStudyEquip: boolean[];
  public laddaListingEquipments = false;
  public laddaLoadingLayout = false;
  public laddaAddingEquipment = false;
  public equipments: Models.Equipment[];
  public editLayoutForm: {
    stdEquipId?: number,
    widthInterval?: number,
    lengthInterval?: number,
    orientation?: number
  };

  constructor(private api: ApiService, private text: TextService, private translate: TranslateService,
    private toastr: ToastrService, private router: Router, private auth: AuthenticationService) { }
  public selectedAddingEquipment: Models.Equipment;
  public filterString = '';
  public unitData: Models.UnitDataEquipment;
  public unitDataRes = {
    price: 0,
    intervalL: 0,
    intervalW: 0
  };
  public symbol: Symbol;
  public equipment;
  public loadInterval = false;

  ngOnInit() {
    this.study = null;
  }

  deleteStudyEquipment(equip: Models.StudyEquipment, index: number) {
    this.laddaDeletingStudyEquip[index] = true;
    this.api.removeStudyEquipment({
      id: this.study.ID_STUDY,
      idEquip: equip.ID_STUDY_EQUIPMENTS
    }).subscribe(
      (resp) => {
        this.refreshView();
      },
      (err) => {
        this.laddaDeletingStudyEquip[index] = false;
        swal('Error', 'Failed to remove equipment, please check your internet connection and' +
          ' try again, contact administrators if error is persist.', 'warning');

        console.log(err);
      },
      () => {
        this.laddaDeletingStudyEquip[index] = false;

      }
    );
  }

  recalculateEquipment() {
    swal('Warning', 'This feature is not yet implement', 'warning');
  }

  refreshView() {
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
          (equips: Models.ViewStudyEquipment[]) => {
            console.log(equips);
            this.laddaDeletingStudyEquip = new Array<boolean>(equips.length);
            this.laddaDeletingStudyEquip.fill(false);
            this.equipmentsView = equips;
            console.log(this.equipmentsView);
          },
          (err) => {
            console.log(err);
          },
          () => {
          }
        );
      }
    );
  }

  ngAfterContentInit() {
    this.study = JSON.parse(localStorage.getItem('study'));

    this.refreshView();
    this.getUnitData();
  }

  onAddEquip() {
    if (!this.selectedAddingEquipment) {
      swal('Error', 'Please select an equipment!', 'error');
      return;
    }

    this.laddaAddingEquipment = true;
    this.api.addEquipment({
      id: this.study.ID_STUDY,
      idEquip: this.selectedAddingEquipment.ID_EQUIP
    }).subscribe(
      resp => {
        this.refreshView();
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      },
      err => {
        console.log(err);
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      },
      () => {
        this.laddaAddingEquipment = false;
        this.addEquipModal.hide();
      }
    );
  }

  onShowAddEquip() {
    if (!this.equipments || this.equipments.length == 0) {
      this.laddaListingEquipments = true;
      this.api.getEquipments({}).subscribe(
        (resp: Models.Equipment[]) => {
          this.equipments = resp;
          this.laddaListingEquipments = false;
          this.addEquipModal.show();
        },
        err => {
          this.laddaListingEquipments = false;
          console.log(err);
        },
        () => {
          this.laddaListingEquipments = false;
        }
      );
    } else {
      this.addEquipModal.show();
    }
  }

  onSelectAddingEquipment(equip: Models.Equipment) {
    this.selectedAddingEquipment = equip;
  }

  showPageGas() {
    this.showTable = !this.showTable;
    const table = <HTMLElement> document.getElementById('tableGas');
    if (this.showTable) {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }

  getUnitData() {
    this.api.getUnitData(this.study.ID_STUDY).subscribe(
      resp => {
        console.log(resp);
        this.unitData = resp;
        this.unitDataRes.price = resp.Price;
        this.unitDataRes.intervalL = resp.IntervalLength;
        this.unitDataRes.intervalW = resp.IntervalWidth;
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  refreshPrice() {
    this.unitData.Price = this.unitDataRes.price;
  }

  refreshIntervalLW() {
    this.unitData.IntervalLength = this.unitDataRes.intervalL;
    this.unitData.IntervalWidth = this.unitDataRes.intervalW;
  }

  savePrice() {
    // console.log(this.unitData);
    if (!isNumber(this.unitData.Price)) {
      swal('Oops..', 'Please specify Price !', 'warning');
      return;
    }
    this.isUpdatePrice = true;
    this.api.updatePrice({
      id: this.study.ID_STUDY,
      price: this.unitData.Price }).subscribe(
      resp => {
        if (resp === 1) {
          this.toastr.success('Update price', 'successfully');
          this.router.navigate(['/input/equipment']);
          this.getUnitData();
          this.isUpdatePrice = false;
        } else {
          swal('Oops..', 'Update price error!', 'error');
        }
      },
      err => {
        console.log(err);
        this.isUpdatePrice = false;
      },
      () => {
        this.isUpdatePrice = false;
      }
    );
  }

  saveInterval() {
    if (!isNumber(this.unitData.IntervalLength)) {
      swal('Oops..', 'Please specify Lenght !', 'warning');
      return;
    }
    if (!isNumber(this.unitData.IntervalWidth)) {
      swal('Oops..', 'Please specify Width !', 'warning');
      return;
    }
    this.isUpdateInterval = true;
    this.loadInterval = true;
    this.api.updateInterval({
      id: this.study.ID_STUDY,
      lenght: this.unitData.IntervalLength,
      width: this.unitData.IntervalWidth
    }).subscribe(
      resp => {
        if (resp === 1) {
          this.toastr.success('Update interval Lenght Width', 'successfully');
          this.router.navigate(['/input/equipment']);
          this.getUnitData();
          this.refreshView();
          this.isUpdateInterval = false;
          this.loadInterval = false;

          // Recalculate equipment parameter

        } else {
          swal('Oops..', 'Update interval Lenght Width error!', 'error');
        }
      },
      err => {
        console.log(err);
        this.isUpdateInterval = false;
      },
      () => {
        this.isUpdateInterval = false;
      }
    );
  }

  equipEditConfig(equip: Models.ViewStudyEquipment, index: number) {
    swal('Warning', 'This feature is not yet implement', 'warning');
  }

  equipEditLayout(equip: Models.ViewStudyEquipment, index: number) {
    console.log(equip);
    this.equipment = equip;
    this.editLayoutForm = {
      stdEquipId: equip.ID_STUDY_EQUIPMENTS,
      orientation: equip.ORIENTATION
    };
    this.editLayoutForm.lengthInterval = equip.layoutGen.LENGTH_INTERVAL;
    if (equip.layoutGen.LENGTH_INTERVAL < 0) {
      this.editLayoutForm.lengthInterval = this.unitData.IntervalLength;
    }
    this.editLayoutForm.widthInterval = equip.layoutGen.WIDTH_INTERVAL;
    if (equip.layoutGen.WIDTH_INTERVAL < 0) {
      this.editLayoutForm.widthInterval = this.unitData.IntervalWidth;
    }
    console.log(this.editLayoutForm);
    this.editModal.show();
  }

  updateStdEquipLayout() {
    this.api.updateStudyEquipmentLayout({
      id: this.editLayoutForm.stdEquipId,
      body: {
        lengthInterval: this.editLayoutForm.lengthInterval,
        widthInterval: this.editLayoutForm.widthInterval,
        orientation: this.editLayoutForm.orientation
      }
    }).subscribe(
      (resp) => {
        this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
          (equips: Models.ViewStudyEquipment[]) => {
            this.laddaDeletingStudyEquip = new Array<boolean>(equips.length);
            this.laddaDeletingStudyEquip.fill(false);
            this.equipmentsView = equips;
            console.log(this.equipmentsView);
            for (let i = 0; i < Object.keys(this.equipmentsView).length; i++) {
              if (this.equipmentsView[i].ID_STUDY_EQUIPMENTS == this.editLayoutForm.stdEquipId) {
                this.equipment = this.equipmentsView[i];
              }
            }
            console.log(this.equipment);
          },
          (err) => {
            console.log(err);
          },
          () => {
          }
        );
      },
      (err) => {
        console.log(err);
        this.editModal.hide();
      },
      () => {
        // this.editModal.hide();
        // this.refreshView();
      }
    );
  }

  onChainingControlsLoaded() {
    this.chainingControls.showEquipment();
  }

  studyModifiable() {
    if (!this.study) { return false; }
    const owned = this.auth.user().ID_USER === this.study.ID_USER;
    return owned && ((!this.study.CHAINING_CONTROLS) || (!this.study.HAS_CHILD));
  }

  closeEditModal() {
    this.editModal.hide();
    this.refreshView();
  }
}
