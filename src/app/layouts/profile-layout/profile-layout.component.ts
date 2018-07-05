import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  public nav = [
    {
      name: this.translate.instant('Profile'),
      url: '/profile',
      icon: 'icon-user',
    },
    {
      name: this.translate.instant('Settings'),
      url: '/settings',
      icon: 'icon-wrench',
    },
    {
      name: this.translate.instant('Reference data'),
      url: '/references',
      icon: 'fa fa-database',
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
