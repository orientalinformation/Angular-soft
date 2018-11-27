import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Login } from '../../api/models/login';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../../shared/text.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, MinmaxService, ProfileService } from '../../api/services';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  user: Login = new Login();
  private langname: string;

  constructor(private auth: AuthenticationService, private api: ApiService, private router: Router,
    private toastr: ToastrService, private text: TextService, private minmaxService: MinmaxService,
    private profileService: ProfileService, private translate: TranslateService) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.auth.login(this.user.username, this.user.password)
      .subscribe(
        data => {
          this.toastr.success('Welcome back', 'Authenticated successfully');
          this.api.getColorDefs().subscribe(
            (resp) => {
              localStorage.setItem('colors', JSON.stringify(resp));
            }
          );
          const userLogon = JSON.parse(localStorage.getItem('user'));
          if (Number(userLogon.CODE_LANGUE) === 1) {
            this.langname = 'en';
          } else if (Number(userLogon.CODE_LANGUE) === 2) {
            this.langname = 'fr';
          } else if (Number(userLogon.CODE_LANGUE) === 3) {
            this.langname = 'it';
          } else if (Number(userLogon.CODE_LANGUE) === 4) {
            this.langname = 'de';
          } else if (Number(userLogon.CODE_LANGUE) === 5) {
            this.langname = 'es';
          }
          this.translate.use(this.langname);

          this.profileService.getUnits(userLogon.ID_USER).subscribe(
            (res) => {
              localStorage.setItem('UnitUser', JSON.stringify(res));
            }
          );

          this.profileService.getMonetaryUser(userLogon.ID_USER).subscribe(
            (res) => {
              localStorage.setItem('MoneratyUser', JSON.stringify(res));
            }
          );
          localStorage.setItem('IdCompInput', null);
          localStorage.setItem('paramsCompInput', null);
          this.router.navigate(['/']);
        },
        error => {
          swal('Warning', error.error[0], 'error');
        }
      );
  }

  forgotPassword() {
    swal('Forgot password?', 'Please contact our Administrator', 'warning');
  }

}
