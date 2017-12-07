import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Login } from '../../api/models/login';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  user: Login = new Login();

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.auth.login(this.user.username, this.user.password)
      .subscribe(
        data => {
          console.log('User is logged in');
          this.router.navigate(['/']);
        },
        error => {
          console.log('login failed!');
        }
      );
  }

}
