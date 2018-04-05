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

import { MinMax } from '../models/min-max';


@Injectable()
export class MinmaxService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * get data min max
   */
  getMinMaxResponse(): Observable<HttpResponse<MinMax[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/minmax`,
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
        let _body: MinMax[] = null;
        _body = _resp.body as MinMax[]
        return _resp.clone({body: _body}) as HttpResponse<MinMax[]>;
      })
    );
  }

  /**
   * get data min max
   */
  getMinMax(): Observable<MinMax[]> {
    return this.getMinMaxResponse().pipe(
      map(_r => _r.body)
    );
  }}

export module MinmaxService {
}
