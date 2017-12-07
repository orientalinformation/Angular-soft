import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { map } from 'rxjs/operators/map';
import { ApiService } from '../../../api/services';
import { error } from 'selenium-webdriver';
import { Study } from '../../../api/models';
import { IOption } from 'ng-select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-study',
  templateUrl: './open-study.component.html',
  styleUrls: ['./open-study.component.scss']
})
export class OpenStudyComponent implements OnInit, AfterViewInit {
  public studies: Study[];

  public selectedStudy: Study = null;

  public filterUsers: Array<IOption> = [];
  public filterCompFamilies: Array<IOption> = [];
  public filterCompSubFamilies: Array<IOption> = [];
  public filterComponents: Array<IOption> = [];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  openStudy() {
    localStorage.setItem('study', JSON.stringify(this.selectedStudy));
    this.api.openStudy(this.selectedStudy.ID_STUDY)
      .subscribe(
        data => {
          this.router.navigate(['/input']);
        }
      );
  }

  onSelect(study: Study) {
    console.log('select study: ' + study.ID_STUDY);
    this.selectedStudy = study;
  }

  ngAfterViewInit() {
    console.log('open study initializing');
    localStorage.removeItem('study');
    this.selectedStudy = null;
    this.api.findStudies(true)
      .subscribe(
        data => {
          // console.log('get studies response:');
          // console.log(data);
          this.studies = data;
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
