import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api/services';
import { NewUser } from '../../../api/models/new-user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { AdminService } from '../../../api/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public activePage = 'new';

  public user: NewUser;
  constructor(private admin: AdminService, private router: Router, private toastr: ToastrService) {
    this.user = new NewUser();
  }

  ngOnInit() {
    this.activePage = 'new';
  }

  openPageNew() {
    this.activePage = 'new';
  }

  openPageLoad() {
    this.activePage = 'load';
  }

  openPageConnections() {
    this.activePage = 'connections';
  }

  newUser() {
    this.admin.newUser({
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      confirmpassword: this.user.confirmpassword
    }).subscribe(
      (response: any[]) => {
        let success = true;
        console.log(response.length);
        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          if (element !== 1) {
            success = false;
            break;
          }
        }

        if (success) {
          this.toastr.success('Create user', 'successfully');
          this.router.navigate(['/admin']);
        } else {
          swal('Oops..', 'Create user error!', 'error');
        }
      },
      err => {

      },
      () => {

      }
    );
  }
}
