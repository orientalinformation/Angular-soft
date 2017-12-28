import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Study } from '../../../api/models/study';
import { ApiService } from '../../../api/services';
import { InputNavItems } from '../input.nav-items';
import { Production } from '../../../api/models/production';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {

  public study: Study;
  public production: Production;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  saveStudy() {
  }

  toggleChainControl() {
    if (this.study.CHAINING_CONTROLS) {
      this.study.OPTION_CRYOPIPELINE = false;
    } else {
      this.study.CHAINING_ADD_COMP_ENABLE = false;
    }
  }

  ngAfterViewInit() {
    this.api.getStudyById( JSON.parse(localStorage.getItem('study')).ID_STUDY ).subscribe(
      (resp: Study) => {
        this.study = resp;
        console.log(this.study);
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
      },
      err => {
        console.log(err);
      }
    );
  }

}
