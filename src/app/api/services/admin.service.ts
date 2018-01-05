/* tslint:disable */
import { Injectable } from '@angular/core';
import {
  HttpClient, HttpRequest, HttpResponse, 
  HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';

import { NewUser } from '../models/new-user';


@Injectable()
export class AdminService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   */
  getUsersResponse(): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/admin/users`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      filter(_r => _r instanceof HttpResponse),
      map(_r => {
        let _resp = _r as HttpResponse<any>;
        let _body: void = null;
        
        return _resp.clone({body: _body}) as HttpResponse<void>;
      })
    );
  }

  /**
   */
  getUsers(): Observable<void> {
    return this.getUsersResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Create new user
   * @param body - body create new user
   */
  newUserResponse(body: NewUser): Observable<HttpResponse<number[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/admin/newuser`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      filter(_r => _r instanceof HttpResponse),
      map(_r => {
        let _resp = _r as HttpResponse<any>;
        let _body: number[] = null;
        _body = _resp.body as number[]
        return _resp.clone({body: _body}) as HttpResponse<number[]>;
      })
    );
  }

  /**
   * Create new user
   * @param body - body create new user
   */
  newUser(body: NewUser): Observable<number[]> {
    return this.newUserResponse(body).pipe(
      map(_r => _r.body)
    );
  }}

export module AdminService {
}
