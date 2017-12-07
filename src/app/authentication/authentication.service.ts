import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import * as moment from 'moment';
import { Login } from '../api/models/login';


@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) {

  }

  login(username: string, password: string) {
    console.log('auth service send login');
    return this.http.post<Login>('http://localhost:10010/api/v1/login', { username, password })
      .do(resp => this.setSession(resp));
  }

  private setSession(authResponse) {
    console.log(authResponse.token);
    // const expiresAt = moment().add(authResponse.expiresIn, 'second');
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', authResponse.user);
    // localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('study');
    // localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
