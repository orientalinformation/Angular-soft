import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Study } from '../../api/models';
import { AfterViewInit, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { User } from '../../api/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements AfterViewInit, OnInit {
  @Input() showStudy;

  public study: Study = null;
  public user: User = null;

  constructor(private router: Router) { }

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

  }
}
