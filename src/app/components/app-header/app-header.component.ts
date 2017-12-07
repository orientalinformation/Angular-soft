import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Study } from '../../api/models';
import { AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements AfterViewInit, OnInit {
  public study: Study;

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  onCloseStudy() {
    localStorage.removeItem('study');
    this.study = null;
    this.router.navigate(['/']);
  }

  onShowNotes() {
    
  }
}
