import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { InputService } from '../../api/services/input.service';
import { ApiService } from '../../api/services/api.service';
import { Study, ViewOpenStudy } from '../../api/models';
import { ToastrService } from 'ngx-toastr';
import { isUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  public txtComment: string;
  public study: Study;
  public data: Study;

  constructor(public bsModalRef: BsModalRef, private input: InputService, private toastr: ToastrService,
     private api: ApiService, private translate: TranslateService) { }

  ngOnInit() {
    this.study  = JSON.parse(localStorage.getItem('study'));
    this.getStudy();
  }

  getStudy() {
    this.api.getStudyById(this.study.ID_STUDY).subscribe(
      data => {
        this.data = data;
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }

  updateStudy() {
    this.input.updateStudy({
      idStudy: this.study.ID_STUDY,
      COMMENTTXT: this.data.COMMENT_TXT
    }).subscribe(
      resp => {
        if (resp === 1) {
          this.toastr.success(this.translate.instant('Update study!'), 'successfully');
        } else {
          this.toastr.error(this.translate.instant('Update study!'), 'Error');
        }
      },
      err => {
        console.log('err');
      },
      () => { }
    );
  }
}
