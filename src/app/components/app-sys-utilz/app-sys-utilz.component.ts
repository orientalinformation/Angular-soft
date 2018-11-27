import { Component, OnInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sys-utilz',
  templateUrl: './app-sys-utilz.component.html',
  styleUrls: ['./app-sys-utilz.component.scss']
})
export class AppSysUtilzComponent implements OnInit, AfterContentChecked {
  public isRefDbActivated: boolean;

  constructor(private router: Router) {
    this.isRefDbActivated = false;
  }

  ngOnInit() {}

  ngAfterContentChecked() {
    this.isRefDbActivated = this.router.url.startsWith('/references');
  }

}
