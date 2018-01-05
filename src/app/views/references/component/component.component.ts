import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';


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
  constructor() { }

  ngOnInit() {
    this.activePageComponent = 'new';
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
