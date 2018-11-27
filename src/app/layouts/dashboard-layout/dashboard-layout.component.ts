import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  public nav = [
    {
      name: this.translate.instant('Welcome'),
      url: '/home',
      icon: 'icon-home',
    },
    {
      name: this.translate.instant('New Study'),
      url: '/new',
      icon: 'icon-star',
    },
    {
      name: this.translate.instant('Open Study'),
      url: '/open',
      icon: 'icon-folder-alt',
    },
    {
      name: this.translate.instant('Import'),
      url: '/import',
      icon: 'icon-cloud-upload',
    }
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

}
