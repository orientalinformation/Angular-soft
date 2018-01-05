import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Study } from '../../../api/models/study';
import { ApiService } from '../../../api/services';
import { InputNavItems } from '../input.nav-items';
import { Production } from '../../../api/models/production';
import swal from 'sweetalert2';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {

  public study: Study;
  public production: Production;

  public laddaSavingStudy = false;
  public laddaSavingProduction = false;
  public isLoading = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.isLoading = true;
  }

  saveProduction() {
    this.laddaSavingProduction = true;
    this.api.saveProduction({
      id: this.production.ID_PRODUCTION,
      body: this.production
    }).subscribe(
      resp => {
        console.log(resp);
        swal('Success', 'Save study production options completed', 'success');
      },
      error2 => {
        console.log(error2);
      },
      () => {
        this.laddaSavingProduction = false;
      }
    );
  }

  saveStudy() {
    this.laddaSavingStudy = true;
    this.api.saveStudy({
      id: this.study.ID_STUDY,
      body: this.study
    }).subscribe(
      resp => {
        localStorage.setItem('study', JSON.stringify(this.study));
        console.log(resp);
        swal('Success', 'Save study calculation options completed', 'success');
      },
      err => {
        console.log(err);
      },
      () => {
        this.laddaSavingStudy = false;
      }
    );
  }

  toggleChainControl() {
    if (this.study.CHAINING_CONTROLS) {
      this.study.OPTION_CRYOPIPELINE = false;
    } else {
      this.study.CHAINING_ADD_COMP_ENABLE = false;
    }
  }

  ngAfterViewInit() {
    this.isLoading = true;
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
            this.isLoading = false;
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

}
