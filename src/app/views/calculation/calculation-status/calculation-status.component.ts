import { Component, OnInit } from '@angular/core';
import { Study, ViewStudyCalculator} from '../../../api/models';
import { CalculatorService } from '../../../api/services';
@Component({
  selector: 'app-calculation-status',
  templateUrl: './calculation-status.component.html',
  styleUrls: ['./calculation-status.component.scss']
})
export class CalculationStatusComponent implements OnInit {
  public study: Study;
  public study_current;
  public studies: Array<ViewStudyCalculator>;
  public isLoading = false;

  constructor(private apiCaculator: CalculatorService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }

    this.getMyStudies();
  }

  getMyStudies() {
    this.isLoading = true;
    this.study_current = (this.study != null) ? this.study.ID_STUDY : 0;
    this.apiCaculator.getMyStudies(this.study_current).subscribe(
      data => {
        this.studies = data;
        // console.log(this.studies);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  refreshCalculateStatus() {
    this.getMyStudies();
  }
}
