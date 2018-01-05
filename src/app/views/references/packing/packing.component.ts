import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {
  @ViewChild('modalDeletePacking') public modalDeletePacking: ModalDirective;
  @ViewChild('modalSaveAsPacking') public modalSaveAsPacking: ModalDirective;
  public activePagePacking = '';

  constructor() { }

  ngOnInit() {
    this.activePagePacking = 'new';
  }

  openNewPacking() {
    const newC = <HTMLElement>document.getElementById('page-new-packing');
    const openC = <HTMLElement>document.getElementById('page-load-packing');
    newC.style.display = 'block';
    openC.style.display = 'none';
    this.activePagePacking = 'new';
  }

  openLoadPacking() {
    const newC = <HTMLElement>document.getElementById('page-new-packing');
    const openC = <HTMLElement>document.getElementById('page-load-packing');
    newC.style.display = 'none';
    openC.style.display = 'block';
    this.activePagePacking = 'load';
  }
}
