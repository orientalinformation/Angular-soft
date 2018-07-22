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

import { ModelChaining } from '../models/model-chaining';
import { OverviewChaining } from '../models/overview-chaining';


@Injectable()
export class ChainingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param id - id study to open
   */
  getAllChainingResponse(id: number): Observable<HttpResponse<ModelChaining[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/chaining/${id}`,
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
        let _body: ModelChaining[] = null;
        _body = _resp.body as ModelChaining[]
        return _resp.clone({body: _body}) as HttpResponse<ModelChaining[]>;
      })
    );
  }

  /**
   * @param id - id study to open
   */
  getAllChaining(id: number): Observable<ModelChaining[]> {
    return this.getAllChainingResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - id study
   */
  getOverViewChainingResponse(id: number): Observable<HttpResponse<OverviewChaining[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/chaining/overview/${id}`,
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
        let _body: OverviewChaining[] = null;
        _body = _resp.body as OverviewChaining[]
        return _resp.clone({body: _body}) as HttpResponse<OverviewChaining[]>;
      })
    );
  }

  /**
   * @param id - id study
   */
  getOverViewChaining(id: number): Observable<OverviewChaining[]> {
    return this.getOverViewChainingResponse(id).pipe(
      map(_r => _r.body)
    );
  }}

export module ChainingService {
}
