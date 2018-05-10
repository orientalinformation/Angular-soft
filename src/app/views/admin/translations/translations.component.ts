import { Component, OnInit, AfterViewInit  } from '@angular/core';

import { ProfileService, ApiService } from '../../../api/services';
import { User, Translation, Langue } from '../../../api/models';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit, AfterViewInit  {
  public activePage = '';
  public listLang: Translation;
  public listLang1: Translation;
  public reflangue: Langue;
  public translangue: Langue;
  public userLogon: User;

  constructor(private profileService: ProfileService) {
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    this.reflangue = new Langue();
    this.translangue = new Langue(); }

  ngOnInit() {
    this.activePage = 'interface';
    this.reflangue.langId = this.userLogon.CODE_LANGUE;
    this.translangue.langId = this.userLogon.CODE_LANGUE;
  }

  ngAfterViewInit() {
    this.refrestListLang();
  }

  openPageInterface() {
    this.activePage = 'interface';
  }

  openPageDataLabel() {
    this.activePage = 'datalabel';
  }

  refrestListLang() {
    this.profileService.getLangue()
      .subscribe(
      data => {
        this.listLang = data;
        this.listLang1 = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }

}
