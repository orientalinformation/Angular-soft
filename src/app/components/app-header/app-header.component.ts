import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Study } from '../../api/models';
import { AfterViewInit, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { User } from '../../api/models/user';
import { BsModalRef } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { CommentComponent } from '../../shared/comment/comment.component';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { ApiService } from '../../api/services';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements AfterViewInit, OnInit {
  bsModalRef: BsModalRef;
  @Input() showStudy;

  public study: Study = null;
  public user: User = null;
  public laddaDeletingStudy = false;

  constructor(private router: Router, private modalService: BsModalService, private api: ApiService) {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.user.USERPRIO = Number(this.user.USERPRIO);
  }

  ngOnInit() {
    if (localStorage.getItem('study') && this.showStudy !== 'false') {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (localStorage.getItem('study') && this.showStudy !== 'false') {
        this.study = JSON.parse(localStorage.getItem('study'));
      }
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  onCloseStudy() {
    localStorage.removeItem('study');
    localStorage.removeItem('meshView');
    localStorage.removeItem('productShape');
    localStorage.removeItem('productView');
    this.study = null;
    this.router.navigate(['/']);
  }

  onShowNotes() {
    this.bsModalRef = this.modalService.show(CommentComponent);
  }

  onDeleteStudy() {
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#dd3333',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
          this.laddaDeletingStudy = true;
          this.api.deleteStudyById(this.study.ID_STUDY).subscribe(
            (data) => {
            },
            (err) => {
              this.laddaDeletingStudy = false;
              this.laddaDeletingStudy = false;
              localStorage.removeItem('study');
              localStorage.removeItem('meshView');
              localStorage.removeItem('productShape');
              localStorage.removeItem('productView');
              this.study = null;
              this.router.navigate(['/open']);
            },
            () => {
              this.laddaDeletingStudy = false;
              localStorage.removeItem('study');
              localStorage.removeItem('meshView');
              localStorage.removeItem('productShape');
              localStorage.removeItem('productView');
              this.study = null;
              this.router.navigate(['/open']);
              swal(
                'Deleted!',
                'Your study has been deleted.',
                'success'
              );
            }
          );
        }
    });
  }

  disabledField() {
    return !(Number(this.study.ID_USER) === Number(this.user.ID_USER));
  }
}
