import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Study } from '../../../api/models/study';
import { ApiService } from '../../../api/services';
import { InputNavItems } from '../input.nav-items';
import { Production } from '../../../api/models/production';
import { ToastrService } from 'ngx-toastr';
import { ChainingComponent } from '../chaining/chaining.component';
import { ViewChaining } from '../../../api/models';
import { Symbol } from '../../../api/models/symbol';
import { ViewMinMaxProduction } from '../../../api/models/view-min-max-production';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../api/models/user';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {
  @ViewChild('chainingControls') public chainingControls: ChainingComponent;

  public study: Study;
  public user: User;
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

  public minMaxProduction: ViewMinMaxProduction;

  constructor(private api: ApiService, private toastr: ToastrService,  private translate: TranslateService) { }

  ngOnInit() {
    this.isLoading = true;
  }

  onChainingControlsLoaded() {
    if (this.study.CHAINING_CONTROLS && (this.study.HAS_CHILD || this.study.PARENT_STUD_EQP_ID !== 0)) {
      this.chainingControls.showObjectives();
    }
  }

  saveObjectiveView() {
    if (!this.production.DAILY_PROD) {
      this.toastr.error(this.translate.instant('Enter a value in Daily production !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.DAILY_PROD)) {
      this.toastr.error(this.translate.instant('Not a valid number in Daily production !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.DAILY_PROD, this.minMaxProduction.mmDaily.LIMIT_MIN,
      this.minMaxProduction.mmDaily.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Daily production') +
        ' (' + this.minMaxProduction.mmDaily.LIMIT_MIN + ' : ' + this.minMaxProduction.mmDaily.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.WEEKLY_PROD) {
      this.toastr.error(this.translate.instant('Enter a value in Weekly production !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.WEEKLY_PROD)) {
      this.toastr.error(this.translate.instant('Not a valid number in Weekly production !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.WEEKLY_PROD, this.minMaxProduction.mmWeekly.LIMIT_MIN,
      this.minMaxProduction.mmWeekly.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Weekly production') +
        ' (' + this.minMaxProduction.mmWeekly.LIMIT_MIN + ' : ' + this.minMaxProduction.mmWeekly.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.NB_PROD_WEEK_PER_YEAR) {
      this.toastr.error(this.translate.instant('Enter a value in Annual production !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.NB_PROD_WEEK_PER_YEAR)) {
      this.toastr.error(this.translate.instant('Not a valid number in Annual production !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.NB_PROD_WEEK_PER_YEAR, this.minMaxProduction.mmAnnual.LIMIT_MIN,
      this.minMaxProduction.mmAnnual.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Annual production') +
        ' (' + this.minMaxProduction.mmAnnual.LIMIT_MIN + ' : ' + this.minMaxProduction.mmAnnual.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.AMBIENT_TEMP) {
      this.toastr.error(this.translate.instant('Enter a value in Factory Air temperature !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.AMBIENT_TEMP)) {
      this.toastr.error(this.translate.instant('Not a valid number in Factory Air temperature !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.AMBIENT_TEMP, this.minMaxProduction.mmFactory.LIMIT_MIN,
      this.minMaxProduction.mmFactory.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Factory Air temperature') +
        ' (' + this.minMaxProduction.mmFactory.LIMIT_MIN + ' : ' + this.minMaxProduction.mmFactory.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.AMBIENT_HUM) {
      this.toastr.error(this.translate.instant('Enter a value in Relative Humidity of Factory Air !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.AMBIENT_HUM)) {
      this.toastr.error(this.translate.instant('Not a valid number in Relative Humidity of Factory Air !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.AMBIENT_HUM, this.minMaxProduction.mmHumidity.LIMIT_MIN,
      this.minMaxProduction.mmHumidity.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Relative Humidity of Factory Air') +
        ' (' + this.minMaxProduction.mmHumidity.LIMIT_MIN + ' : ' + this.minMaxProduction.mmHumidity.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.AVG_T_DESIRED) {
      this.toastr.error(this.translate.instant('Enter a value in Required Average temperature !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.AVG_T_DESIRED)) {
      this.toastr.error(this.translate.instant('Not a valid number in Required Average temperature !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.AVG_T_DESIRED, this.minMaxProduction.mmAverage.LIMIT_MIN,
      this.minMaxProduction.mmAverage.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Required Average temperature') +
        ' (' + this.minMaxProduction.mmAverage.LIMIT_MIN + ' : ' + this.minMaxProduction.mmAverage.LIMIT_MAX + ') !', 'Error');
        return;
    }
    if (!this.production.PROD_FLOW_RATE) {
      this.toastr.error(this.translate.instant('Enter a value in Required Production Rate !'), 'Error');
      return;
    } else if (!this.isNumberic(this.production.PROD_FLOW_RATE)) {
      this.toastr.error(this.translate.instant('Not a valid number in Required Production Rate !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.production.PROD_FLOW_RATE, this.minMaxProduction.mmProdFlow.LIMIT_MIN,
      this.minMaxProduction.mmProdFlow.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range inRequired Production Rate') +
        ' (' + this.minMaxProduction.mmProdFlow.LIMIT_MIN + ' : ' + this.minMaxProduction.mmProdFlow.LIMIT_MAX + ') !', 'Error');
        return;
    }
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
        this.user = JSON.parse(localStorage.getItem('user'));
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
    this.api.getMinMaxProduction().subscribe(
      data => {
        this.minMaxProduction = data;
      }
    );
  }

  disabledField() {
    return !((!this.study.HAS_CHILD && this.study.PARENT_ID === 0) && (this.study.ID_USER == this.user.ID_USER));
  }

  isNumberic(number) {
    return Number.isInteger(Math.floor(number));
  }

  isInRangeOutput(value, min, max) {
    if (value < min || value > max) {
      return false;
    } else {
      return true;
    }
  }

}
