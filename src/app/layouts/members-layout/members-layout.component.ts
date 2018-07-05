import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Study } from '../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-members-layout',
  templateUrl: './members-layout.component.html',
  styleUrls: ['./members-layout.component.scss']
})

export class MembersLayoutComponent implements OnInit, AfterViewInit {
  public nav = [
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

  public subnav = [];

  constructor(private router: Router, private route: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  subnavChangedHandler(subnav) {
    this.subnav = subnav;
    // console.log('subnav received:');
    // console.log(subnav);
  }

}
