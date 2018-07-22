import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { ChainingService } from '../../api/services/chaining.service';
import { ApiService } from '../../api/services/api.service';
import { Study, ViewOpenStudy, OverviewChaining } from '../../api/models';
import { ToastrService } from 'ngx-toastr';
import { isUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public study: Study;
  public chainings: Array<OverviewChaining>;
  public newPhase: OverviewChaining;

  constructor(public bsModalRef: BsModalRef, private apichaining: ChainingService, private toastr: ToastrService,
    private api: ApiService, private translate: TranslateService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.getOverviewChaining();
    }
  }

  getOverviewChaining() {
    this.apichaining.getOverViewChaining(this.study.ID_STUDY).subscribe(
      data => {
        this.chainings = data;
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }

  closeAndOpenStudy(idStudy) {
    console.log(idStudy);
  }

  addNewPhase() {
    // add php study and return study here
    if (this.chainings.length > 0 && this.chainings.length < 3) {
      this.newPhase = new OverviewChaining();
      this.newPhase.StudyEquipment = this.chainings[this.chainings.length - 1].StudyEquipment;
      this.newPhase.imgComp = this.chainings[this.chainings.length - 1].imgComp;
      this.chainings.push(this.newPhase);
    } else {
      this.toastr.error(this.translate.instant('Can not add more than 3 Phase!'), 'Error');
    }
  }
}
