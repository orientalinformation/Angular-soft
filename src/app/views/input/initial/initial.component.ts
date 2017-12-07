import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiService } from '../../../api/services/api.service';
import { Study } from '../../../api/models/study';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit, AfterViewInit {
  private study: Study;
  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.api.refreshMesh(this.study.ID_STUDY).subscribe(data => {
      console.log(data);
    });
  }

}
