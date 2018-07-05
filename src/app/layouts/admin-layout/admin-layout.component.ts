import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  public nav = [
    {
      name: this.translate.instant('Users'),
      url: '/admin/users',
      icon: 'fa fa-users',
    },
    {
      name: this.translate.instant('Units'),
      url: '/admin/units',
      icon: 'fa fa-balance-scale',
    },
    {
      name: this.translate.instant('Translations'),
      url: '/admin/translations',
      icon: 'fa fa-language',
    },
    {
      name: this.translate.instant('Back'),
      url: '/home',
      icon: 'icon-action-undo',
    }
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

}
