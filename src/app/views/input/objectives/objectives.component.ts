import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Study } from '../../../api/models/study';
import { ApiService } from '../../../api/services';
import { InputNavItems } from '../input.nav-items';
import { Production } from '../../../api/models/production';
import { ToastrService } from 'ngx-toastr';
import { ChainingComponent } from '../chaining/chaining.component';
import { ViewChaining } from '../../../api/models';
import { Symbol } from '../../../api/models/symbol';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {
  @ViewChild('chainingControls') public chainingControls: ChainingComponent;

  public study: Study;
  public production: Production;
  public symbol: Symbol;
  public laddaSavingStudy = false;
  public laddaSavingProduction = false;

  public laddaSavingObjectives = false;
  public isLoading = false;
  public studyState: Study = null;

  public objectivesInput = {
    DAILY_PROD: '',
    WEEKLY_PROD: '',
    NB_PROD_WEEK_PER_YEAR: '',
    DAILY_STARTUP: '',
    AMBIENT_TEMP: '',
    AMBIENT_HUM: ''
  };

  constructor(private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoading = true;
  }

  onChainingControlsLoaded() {
    if (this.study.CHAINING_CONTROLS && (this.study.HAS_CHILD || this.study.PARENT_STUD_EQP_ID !== 0)) {
      this.chainingControls.showObjectives();
    }
  }

  saveObjectiveView() {
    this.laddaSavingObjectives = true;
    this.api.saveStudy({
      id: this.study.ID_STUDY,
      body: this.study
    }).subscribe(
      resp => {
        localStorage.setItem('study', JSON.stringify(this.study));
        this.api.saveProduction({
          id: this.production.ID_PRODUCTION,
          body: this.production
        }).subscribe(
          data => {
            console.log(data);
            this.toastr.success('Save objectives completed!', 'Success');
            this.laddaSavingObjectives = false;
            this.refreshViewModel();
          },
          error2 => {
            console.log(error2);
            this.laddaSavingObjectives = false;
          },
          () => {
            this.laddaSavingObjectives = false;
          }
        );
      },
      err => {
        console.log(err);
      },
      () => {
        this.laddaSavingStudy = false;
      }
    );
  }

  createChildStudyDialog() {
    this.chainingControls.openCreateModal();
  }

  toggleChainControl() {
    if (this.study.CHAINING_CONTROLS) {
      this.study.OPTION_CRYOPIPELINE = false;
    } else {
      this.study.CHAINING_ADD_COMP_ENABLE = false;
    }
  }

  ngAfterViewInit() {
    this.refreshViewModel();
  }

  refreshViewModel() {
    this.isLoading = true;
    this.api.getStudyById(JSON.parse(localStorage.getItem('study')).ID_STUDY).subscribe(
      (resp: Study) => {
        localStorage.setItem('study', JSON.stringify(resp));
        this.study = resp;
        this.studyState = JSON.parse(localStorage.getItem('study'));
        this.api.getSymbol(this.study.ID_STUDY).subscribe(
          data => {
            this.symbol = data;
          }
        );
        this.api.getProductionById(this.study.ID_PRODUCTION).subscribe(
          data => {
            // console.log('get studies response:');
            console.log(data);
            this.production = data;
            this.objectivesInput.DAILY_PROD = parseFloat((this.production.DAILY_PROD * 1).toFixed()).toFixed(2);
            this.objectivesInput.WEEKLY_PROD = parseFloat((this.production.WEEKLY_PROD * 1).toFixed()).toFixed(2);
            this.objectivesInput.NB_PROD_WEEK_PER_YEAR = parseFloat((this.production.NB_PROD_WEEK_PER_YEAR * 1).toFixed()).toFixed(2);
            this.objectivesInput.DAILY_STARTUP = parseFloat((this.production.DAILY_STARTUP * 1).toFixed()).toFixed(2);
            this.objectivesInput.AMBIENT_TEMP = parseFloat((this.production.AMBIENT_TEMP * 1).toFixed()).toFixed(2);
            this.objectivesInput.AMBIENT_HUM = parseFloat((this.production.AMBIENT_HUM * 1).toFixed()).toFixed(2);
            this.isLoading = false;
          },
          err => {
            console.log(err);
          },
          () => {
            this.isLoading = false;
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  disabledField() {
    return !(!this.study.HAS_CHILD && this.study.PARENT_ID === 0);
  }

}
