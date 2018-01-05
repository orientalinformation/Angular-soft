import { Component, OnInit } from '@angular/core';
import { OnChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  @ViewChild('modalTempSetpoint') public modalTempSetpoint: ModalDirective;
  @ViewChild('modalReferentialEquip') public modalReferentialEquip: ModalDirective;
  @ViewChild('modalEquipmentProfil') public modalEquipmentProfil: ModalDirective;
  @ViewChild('modalEquipmentProfil2') public modalEquipmentProfil2: ModalDirective;

  public equipmentGenerate: number;
  public equipmentMerge1: number;
  public equipmentMerge2: number;
  public equipmentLoad: number;
  public activePageEquipment = '';
  constructor() {
    this.equipmentGenerate = 0;
    this.equipmentMerge1 = 0;
    this.equipmentMerge2 = 0;
    this.equipmentLoad = 0;
  }

  ngOnInit() {
    this.activePageEquipment = 'new';
  }

  openNewEquipment() {
    this.hideAllPageEquipment();
    const newE = <HTMLElement>document.getElementById('page-new-equipment');
    newE.style.display = 'block';
    this.activePageEquipment = 'new';
  }

  openLoadEquipment() {
    this.hideAllPageEquipment();
    const loadE = <HTMLElement>document.getElementById('page-load-equipment');
    loadE.style.display = 'block';
    this.activePageEquipment = 'load';
  }

  openGenerateEquipment() {
    this.hideAllPageEquipment();
    const genE = <HTMLElement>document.getElementById('page-generated-equipment');
    genE.style.display = 'block';
    this.activePageEquipment = 'gen';
  }

  openCurvesEquipment() {
    this.hideAllPageEquipment();
    const curE = <HTMLElement>document.getElementById('page-curves-equipment');
    curE.style.display = 'block';
    this.activePageEquipment = 'curves';
  }

  changeEquipmentLoad(val) {
    this.equipmentLoad = val;
    const pageEquip1 = <HTMLElement>document.getElementById('page-load-equipment1');
    const pageEquip2 = <HTMLElement>document.getElementById('page-load-equipment2');
    const pageEquip3 = <HTMLElement>document.getElementById('page-load-equipment3');
    if(val != 0){
      pageEquip1.style.display = 'block';
      pageEquip2.style.display = 'block';
      pageEquip3.style.display = 'block';
    }else{
      pageEquip1.style.display = 'none';
      pageEquip2.style.display = 'none';
      pageEquip3.style.display = 'none';
    }
  }

  hideAllPageEquipment() {
    const newE = <HTMLElement>document.getElementById('page-new-equipment');
    const loadE = <HTMLElement>document.getElementById('page-load-equipment');
    const genE = <HTMLElement>document.getElementById('page-generated-equipment');
    const curE = <HTMLElement>document.getElementById('page-curves-equipment');
    newE.style.display = 'none';
    loadE.style.display = 'none';
    genE.style.display = 'none';
    curE.style.display = 'none';

  }

  showGenerateRegulation() {
    const equip = <HTMLElement>document.getElementById('generate-regulation-temperature');
    if(this.equipmentGenerate != 0){
      equip.style.display = 'block';
    }else{
      equip.style.display = 'none';
    }
  }

  showMergeRegulation() {
    const equip = <HTMLElement>document.getElementById('merge-regulation-temperature');
    if(this.equipmentMerge1 != 0 && this.equipmentMerge2 != 0){
      equip.style.display = 'block';
    }else{
      equip.style.display = 'none';
    }
  }

  pageGenerate() {
    this.hideAllPage();
    const gen = <HTMLElement>document.getElementById('equipment-page-generate');
    gen.style.display = 'block';
  }

  pageRotate() {
    this.hideAllPage();
    const rot = <HTMLElement>document.getElementById('equipment-page-rotate');
    rot.style.display = 'block';
  }

  pageTranslate() {
    this.hideAllPage();
    const tran = <HTMLElement>document.getElementById('equipment-page-translate');
    tran.style.display = 'block';
  }

  pageMerge() {
    this.hideAllPage();
    const mer = <HTMLElement>document.getElementById('equipment-page-merge');
    const btnFilter = <HTMLElement>document.getElementById('equipment-filter');
    mer.style.display = 'block';
    btnFilter.style.display = 'none';
  }

  hideAllPage() {
    const generate = <HTMLElement>document.getElementById('equipment-page-generate');
    const rotate = <HTMLElement>document.getElementById('equipment-page-rotate');
    const translate = <HTMLElement>document.getElementById('equipment-page-translate');
    const merge = <HTMLElement>document.getElementById('equipment-page-merge');
    const btnFilter = <HTMLElement>document.getElementById('equipment-filter');
    generate.style.display = 'none';
    rotate.style.display = 'none';
    translate.style.display = 'none';
    merge.style.display = 'none';
    btnFilter.style.display = 'block';
  }

}
