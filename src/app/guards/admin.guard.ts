import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../api/models/user';

@Injectable()
export class AdminGuard implements CanActivate {
  public user: User = null;

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      if (this.user.USERPRIO === 1 || this.user.USERPRIO === 0) {
        return true;
      }
    }

    // not logged in so redirect to login page
    this.router.navigate(['/home']);
    return false;
  }
}
