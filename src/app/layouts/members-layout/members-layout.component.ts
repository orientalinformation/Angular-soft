import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Study, ViewChaining, ModelChaining } from '../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChainingService } from '../../api/services/chaining.service';

@Component({
  selector: 'app-members-layout',
  templateUrl: './members-layout.component.html',
  styleUrls: ['./members-layout.component.scss']
})

export class MembersLayoutComponent implements OnInit, AfterViewInit {
  public study: Study;
  public nav = [];
  public navDefault = [
    {
      name: this.translate.instant('Input'),
      url: '/input',
      icon: 'icon-note',
    },
    {
      name: this.translate.instant('Calculate'),
      url: '/calculation',
      icon: 'icon-energy',
    },
    {
      name: this.translate.instant('Output'),
      url: '/output',
      icon: 'icon-pie-chart',
    },
    {
      name: this.translate.instant('Report'),
      url: '/report',
      icon: 'icon-doc',
    }
  ];
  public default = {
    name: 'PHASE 1',
    url: '/abc',
    children: [],
    id: null
  };
  public navChaining = [];
  public chaining: Array<ModelChaining>;
  public subnav = [];

  constructor(private router: Router, private route: ActivatedRoute, private translate: TranslateService,
     private apiChain: ChainingService) { }

  ngOnInit() {
    this.study =  JSON.parse(localStorage.getItem('study'));
    if (this.study) {
      this.apiChain.getAllChaining(this.study.ID_STUDY).subscribe(
        data => {
          this.chaining = data;
        },
        err => {
          console.log('err');
        },
        () => {
          if (this.chaining) {
            for (let i = 0; i < this.chaining.length; i++) {
              this.default = {
                name: this.chaining[i].studyName,
                url: '/input/objectives',
                children: (Number(this.chaining[i].active) === 1) ? this.navDefault : [],
                id: this.chaining[i].ID_STUDY
              };
              this.navChaining.push(this.default);
            }
          }
        }
      );

      if (Number(this.study.CHAINING_CONTROLS) === 1) {
        this.nav = this.navChaining;
      } else {
        this.nav = this.navDefault;
      }
    }
  }

  ngAfterViewInit() {

  }

  subnavChangedHandler(subnav) {
    this.subnav = subnav;
  }
}
