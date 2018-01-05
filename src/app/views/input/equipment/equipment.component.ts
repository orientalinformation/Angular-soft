import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TextService } from '../../../shared/text.service';
import { TranslateService } from '@ngx-translate/core';
import * as Models from '../../../api/models';

import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, AfterViewInit {
  @ViewChild('addEquipModal') public addEquipModal: ModalDirective;

  public  showTable = false;
  public study: Models.Study;
  public equipmentsView: Models.ViewStudyEquipment[];

  public laddaListingEquipments = false;
  public laddaAddingEquipment = false;

  public equipments: Models.Equipment[];

  constructor(private api: ApiService, private text: TextService, private translate: TranslateService) { }

  public selectedAddingEquipment: Models.Equipment;

  public filterString = '';

  ngOnInit() {
  }

  recalculateEquipment() {
    swal('Warning', 'This feature is not yet implement', 'warning');
  }

  refreshView() {
    this.api.getStudyEquipments(this.study.ID_STUDY).subscribe(
      (equips: Models.ViewStudyEquipment[]) => {
        console.log(equips);
        this.equipmentsView = equips;
      },
      (err) => {
        console.log(err);
      },
      () => {

      }
    );
  }

  ngAfterViewInit() {
    this.study = JSON.parse(localStorage.getItem('study'));

    this.refreshView();
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
}
