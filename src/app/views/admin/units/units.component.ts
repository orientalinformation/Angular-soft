import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  @ViewChild('modalValueType') public modalValueType: ModalDirective;
  constructor() { }

  ngOnInit() {
  }

}
