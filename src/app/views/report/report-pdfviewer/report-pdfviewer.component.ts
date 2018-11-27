import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { User } from '../../../api/models/user';
import { Study } from '../../../api/models/study';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  public progressFileHtml;
  constructor(private sanitizer: DomSanitizer, private router: Router,  private translate: TranslateService) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.study = JSON.parse(localStorage.getItem('study'));
    const name = this.user.USERNAM;
    const id = this.study.ID_STUDY;
    const studyname = this.study.STUDY_NAME;
    if (localStorage.getItem('iframeReport') != '') {
      this.progressFileHtml = localStorage.getItem('iframeReport');
      this.iframeReport = this.sanitizer.bypassSecurityTrustResourceUrl(this.progressFileHtml);
    } else {
      swal('Warning', this.translate.instant('Please generate report config'), 'error');
      this.router.navigate(['/report/reportconfig']);
    }
  }

  ngAfterViewInit() {
  }
}
