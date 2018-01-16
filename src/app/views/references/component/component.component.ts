import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

import { ApiService } from '../../../api/services';
// import { ComponentDB } from '../../../api/models';
import { Translation } from '../../../api/models';


@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  @ViewChild('modalFreezetemper') public modalFreezetemper: ModalDirective;
  @ViewChild('modalDeleteComponent') public modalDeleteComponent: ModalDirective;
  @ViewChild('modalSaveAsComponent') public modalSaveAsComponent: ModalDirective;
  public activePageComponent = '';
  // public componentDB: ComponentDB;
  public listFamily: Object;
  public listSubFamily: Object;

  constructor(private api: ApiService) { 
    // this.componentDB = new ComponentDB();
  }

  ngOnInit() {
    this.activePageComponent = 'new';
    // console.log(this.componentDB);
    this.getListFamily();
  }

  saveComponent() {

  }

  getListFamily() {
    // this.api.getFamilyTranslations("en")
    //   .subscribe(
    //   data => {
    //     this.listFamily = data;
    //     console.log(this.listFamily);
    //   },
    //   err => {
    //     console.log(err);
    //   },
    //   () => {
    //     // console.log('find sttudies completed');
    //   }
    //   );
  }

  openNewComponent() {
    this.hideAllPageComponent();
    const newC = <HTMLElement>document.getElementById('page-new-component');
    newC.style.display = 'block';
    this.activePageComponent = 'new';
  }

  openOpenComponent() {
    this.hideAllPageComponent();
    const openC = <HTMLElement>document.getElementById('page-open-component');
    openC.style.display = 'block';
    this.activePageComponent = 'open';
  }

  openDataGenerateComponent() {
    this.hideAllPageComponent();
    const dataGen = <HTMLElement>document.getElementById('page-datagenerated-component');
    dataGen.style.display = 'block';
    this.activePageComponent = 'gen';
  }

  hideAllPageComponent() {
    const newC = <HTMLElement>document.getElementById('page-new-component');
    const openC = <HTMLElement>document.getElementById('page-open-component');
    const dataGen = <HTMLElement>document.getElementById('page-datagenerated-component');
    newC.style.display = 'none';
    openC.style.display = 'none';
    dataGen.style.display = 'none';
  }
}
