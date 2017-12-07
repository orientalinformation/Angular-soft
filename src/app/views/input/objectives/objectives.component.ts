import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Study } from '../../../api/models/study';
import { ApiService } from '../../../api/services';
import { InputNavItems } from '../input.nav-items';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {

  public study: Study;
  public production: Study;
  @Output() subnavChanged: EventEmitter<any> = new EventEmitter();
  public subnav;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.subnav = InputNavItems;
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  toggleChainControl() {
    if (this.study.CHAINING_CONTROLS) {
      this.study.OPTION_CRYOPIPELINE = 0;
    } else {
      this.study.CHAINING_ADD_COMP_ENABLE = 0;
    }
  }

  ngAfterViewInit() {
    this.subnavChanged.emit(this.subnav);
    console.log('ngAfterViewInit');
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getProductionById(this.study.ID_PRODUCTION).subscribe(
        data => {
          // console.log('get studies response:');
          // console.log(data);
          this.production = data;
        },
        err => {
          console.log(err);
        },
        () => {
          // console.log('find sttudies completed');
        }
      );
    }
  }

}
