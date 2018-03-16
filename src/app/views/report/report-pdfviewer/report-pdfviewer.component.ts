import { Component, OnInit } from '@angular/core';
import { User } from '../../../api/models/user';
import { Study } from '../../../api/models/study';
import { RequestOptions, Request, RequestMethod } from '@angular/http';

@Component({
  selector: 'app-report-pdfviewer',
  templateUrl: './report-pdfviewer.component.html',
  styleUrls: ['./report-pdfviewer.component.scss']
})
export class ReportPdfviewerComponent implements OnInit {
  pdfSrc: string;
  page: number;
  public user: User;
  public study: Study;
  constructor() { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.study = JSON.parse(localStorage.getItem('study'));
    const name = this.user.USERNAM;
    const id = this.study.ID_STUDY;
    const studyname = this.study.STUDY_NAME;
    const options = new RequestOptions({
      url: 'http://localhost:10010/',
      withCredentials: true
    });
    const req = new Request(options);
    console.log('options.url:', options.url); // https://google.com
    this.pdfSrc = '' + name + '/' + id + '-' + ' ' + studyname + '-Report.pdf';
    this.page = 1;
  }

  onFileSelected() {
    const img: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer(img.files[0]);
    }
  }
}
