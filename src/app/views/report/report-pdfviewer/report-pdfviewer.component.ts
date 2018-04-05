import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { User } from '../../../api/models/user';
import { Study } from '../../../api/models/study';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-report-pdfviewer',
  templateUrl: './report-pdfviewer.component.html',
  styleUrls: ['./report-pdfviewer.component.scss']
})
export class ReportPdfviewerComponent implements OnInit, AfterViewInit {
  pdfSrc: string;
  page: number;
  public user: User;
  public study: Study;
  public iframeReport;
  public progressFileHtml = '';
  constructor(private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.study = JSON.parse(localStorage.getItem('study'));
    const name = this.user.USERNAM;
    const id = this.study.ID_STUDY;
    const studyname = this.study.STUDY_NAME;
  }

  ngAfterViewInit() {
    if (localStorage.getItem('iframeReport')) {
      this.progressFileHtml = localStorage.getItem('iframeReport');
    }
    console.log(this.progressFileHtml);
    this.iframeReport = this.sanitizer.bypassSecurityTrustResourceUrl(this.progressFileHtml);
  }
}
