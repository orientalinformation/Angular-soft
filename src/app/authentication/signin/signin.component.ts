import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Login } from '../../api/models/login';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../../shared/text.service';
import { ApiService, MinmaxService, ProfileService } from '../../api/services';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  user: Login = new Login();

  constructor(private auth: AuthenticationService, private api: ApiService, private router: Router,
    private toastr: ToastrService, private text: TextService, private minmaxService: MinmaxService,
    private profileService: ProfileService) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.auth.login(this.user.username, this.user.password)
      .subscribe(
        data => {
          console.log('User is logged in');
          this.toastr.success('Welcome back', 'Authenticated successfully');
          this.api.getColorDefs().subscribe(
            (resp) => {
              localStorage.setItem('colors', JSON.stringify(resp));
            }
          );
          this.minmaxService.getMinMax().subscribe(
            (res) => {
              localStorage.setItem('MinMax', JSON.stringify(res));
            }
          );
          const userLogon = JSON.parse(localStorage.getItem('user'));
          this.profileService.getUnits(userLogon.ID_USER).subscribe(
            (res) => {
              console.log(res);
              localStorage.setItem('UnitUser', JSON.stringify(res));
            }
          );
          this.router.navigate(['/']);
        },
        error => {
          console.log('login failed!');
          swal('Oops...', 'Logged in failed', 'error');
        }
      );
  }

  forgotPassword() {
    swal('Forgot password?', 'Please contact our Administrator', 'warning');
  }

}
