import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { map } from 'rxjs/operators/map';
import { ApiService } from '../../../api/services';
import { InputService } from '../../../api/services/input.service';
import { error } from 'selenium-webdriver';
import { Study, ViewOpenStudy } from '../../../api/models';
import { IOption } from 'ng-select';
import { Router } from '@angular/router';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';

import * as Models from '../../../api/models';

import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Users } from '../../../api/models/users';
import { ViewFamily } from '../../../api/models/view-family';
import { ViewComponents } from '../../../api/models/view-components';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  public transform(values: Study[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter(v => v.STUDY_NAME.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }
}

@Component({
  selector: 'app-open-study',
  templateUrl: './open-study.component.html',
  styleUrls: ['./open-study.component.scss']
})
export class OpenStudyComponent implements OnInit, AfterViewInit {
  @ViewChild('modalSaveAs') public modalSaveAs: ModalDirective;
  public studies: ViewOpenStudy;

  public selectedStudy: Study = null;
  public studyID: any;

  public filterUsers: Array<IOption> = [];
  public filterCompFamilies: Array<IOption> = [];
  public filterCompSubFamilies: Array<IOption> = [];
  public filterComponents: Array<IOption> = [];

  public filterString = '';
  public name = '';
  public laddaOpeningStudy = false;
  public laddaDeletingStudy = false;
  public laddaSaveStudyAs = false;
  public users: Users;
  public user: Models.User;
  public compFamily: ViewFamily;
  public subFamily: ViewFamily;
  public components: ViewComponents;
  public userSelected = 0;
  public compFamilySelected = 0;
  public subFamilySelected = 0;
  public componentSelected = 0;
  public isLoading = true;

  constructor(private api: ApiService, private router: Router,
    private input: InputService, private toastr: ToastrService, private translate: TranslateService) {}
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  openStudy() {
    localStorage.setItem('study', JSON.stringify(this.selectedStudy));
    this.laddaOpeningStudy = true;
    this.api.openStudy(this.selectedStudy.ID_STUDY)
      .subscribe(
        data => {
          this.api.getProductViewModel(this.selectedStudy.ID_PROD).subscribe(
            (response: Models.ViewProduct) => {
              localStorage.setItem('productWarning', 'Y');
              localStorage.setItem('productDeleteWarning', 'Y');
              localStorage.setItem('productView', JSON.stringify(response));
              const elements = response.elements;
              if (elements.length > 0) {
                localStorage.setItem('productShape', elements[0].ID_SHAPE.toString());
              } else {
                localStorage.removeItem('productShape');
              }
              this.laddaOpeningStudy = false;
              this.router.navigate(['/input']);
            },
            err => {
              console.log(err);
            },
            () => {
            }
          );
        },
        err => {
          console.log(err);
          this.laddaOpeningStudy = false;
        },
        () => {
          this.laddaOpeningStudy = false;
        }
      );
  }

  onSelect(study: Study) {
    // console.log('select study: ' + study.ID_STUDY);
    this.selectedStudy = study;
  }

  refrestListStudies() {
    this.isLoading = true;
    localStorage.removeItem('study');
    this.selectedStudy = null;
    this.api.findStudies({})
      .subscribe(
      data => {
        // console.log('get studies response:');
        // console.log(data);
        this.studies = data;
        this.isLoading = false;
      },
      err => {
        console.log(err);
        this.isLoading = false;
      },
      () => {
        // console.log('find sttudies completed');
      }
    );
    this.api.getActiveUsers().subscribe(
      data => {
        this.users = data;
      }
    );
    this.api.getAllCompFamily().subscribe(
      data => {
        this.compFamily = data;
      }
    );
    this.api.getSubfamily(this.compFamilySelected).subscribe(
      data => {
        this.subFamily = data;
      }
    );
    this.api.findComponents({}).subscribe(
      data => {
        this.components = data;
      }
    );
  }

  ngAfterViewInit() {
    // console.log('open study initializing');
    this.refrestListStudies();
  }

  deleteStudy() {
    swal({
      title: this.translate.instant('Are you sure?'),
      text: this.translate.instant('You won\'t be able to revert this!'),
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#dd3333',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.laddaDeletingStudy = true;
        this.api.deleteStudyById(this.selectedStudy.ID_STUDY).subscribe(
          data => {
            // console.log(data);
            this.laddaDeletingStudy = false;
            swal(
              this.translate.instant('Deleted!'),
              this.translate.instant('Your study has been deleted.'),
              'success'
            );
            this.refrestListStudies();
          },
          err => {
            this.laddaDeletingStudy = false;
            console.log(err);
          },
          () => {
            this.laddaDeletingStudy = false;
          }
        );
      }
    });
  }

  saveStudyAs() {
    // console.log(this.name);
    if (!this.name) {
      this.toastr.error(this.translate.instant('Please specify study name!'), 'Error');
      return false;
    }
    this.laddaSaveStudyAs = true;
    this.studyID = this.selectedStudy.ID_STUDY;
    const studyName = this.name;
        // console.log(studyName);
        // console.log(this.name);
    this.api.saveStudyAs({
      id: this.studyID,
      name: this.name
    }).subscribe(
      (data: Study) => {
        this.modalSaveAs.hide();
        this.laddaSaveStudyAs = false;
        this.refrestListStudies();
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.error.message), 'Error');
        console.log(err);
        this.laddaSaveStudyAs = false;
      },
      () => {
        this.laddaSaveStudyAs = false;
      }
    );
  }

  selectUser() {
    this.api.findStudies({
        idUser: this.userSelected
      })
      .subscribe(
      data => {
        this.studies = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  selectFamily() {
    this.api.getSubfamily(this.compFamilySelected).subscribe(
      data => {
        this.subFamily = data;
      }
    );

    this.api.findComponents({
      idStudy: 0,
      compfamily: this.compFamilySelected,
    }).subscribe(
      data => {
        // console.log(data);
        this.components = data;
      }
    );

    this.api.findStudies({
        idUser: this.userSelected,
        compfamily: this.compFamilySelected
    }).subscribe(
      data => {
        this.studies = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  selectSubFamily() {
    this.api.findComponents({
      idStudy: 0,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected
    }).subscribe(
      data => {
        // console.log(data);
        this.components = data;
      }
    );
    this.api.findStudies({
      idUser: this.userSelected,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected
    }).subscribe(
      data => {
        this.studies = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  selectComponent() {
    this.api.findStudies({
      idUser: this.userSelected,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected,
      component: this.componentSelected
    }).subscribe(
      data => {
        this.studies = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  disabledField() {
    return !(Number(this.selectedStudy.ID_USER) === Number(this.user.ID_USER));
  }
}
