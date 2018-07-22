import { Component, isDevMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { ApiService } from './api/services/api.service';
import { TextService } from './shared/text.service';
import { NgxLocalizedNumbersService } from 'ngx-localized-numbers';
import { User, Translation, Constructors, Units, MonetaryCurrency, Langue, DefaultEquipment, Profile } from './api/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  private subscription: Subscription;
  public userLogon: User;
  public langname: string;

  constructor(public translate: TranslateService, private activatedRoute: ActivatedRoute,
    api: ApiService, text: TextService, private localizedNumbersService: NgxLocalizedNumbersService) {
    translate.addLangs(['en', 'fr', 'es', 'it', 'de']);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    if (this.userLogon !== null ) {
      if (Number(this.userLogon.CODE_LANGUE) === 1) {
        this.langname = 'en';
      } else if (Number(this.userLogon.CODE_LANGUE) === 2) {
        this.langname = 'fr';
      } else if (Number(this.userLogon.CODE_LANGUE) === 3) {
        this.langname = 'it';
      } else if (Number(this.userLogon.CODE_LANGUE) === 4) {
        this.langname = 'de';
      } else if (Number(this.userLogon.CODE_LANGUE) === 5) {
        this.langname = 'es';
      }
      translate.use(this.langname);
    } else {
      translate.use('en');
    }
    text.initialize();
  }

  ngOnInit() {
    this.localizedNumbersService.setLocale('en_US');
    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        const locale = param['locale'];
        if (locale !== undefined) {
          this.translate.use('locale');
          console.log('change locale to: ' + locale);
        }
      });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }
}
