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

import { ViewPackingElmt } from '../models/view-packing-elmt';
import { NewPacking } from '../models/new-packing';
import { Translation } from '../models/translation';


@Injectable()
export class ReferencedataService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Get a list of packingelmt
   */
  findRefPackingElmtResponse(): Observable<HttpResponse<ViewPackingElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/packing`,
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
        let _body: ViewPackingElmt = null;
        _body = _resp.body as ViewPackingElmt
        return _resp.clone({body: _body}) as HttpResponse<ViewPackingElmt>;
      })
    );
  }

  /**
   * Get a list of packingelmt
   */
  findRefPackingElmt(): Observable<ViewPackingElmt> {
    return this.findRefPackingElmtResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Create new packing
   * @param body - body create new packing
   */
  NewPackingResponse(body: NewPacking): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/packing`,
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
        let _body: number = null;
        _body = parseFloat(_resp.body as string)
        return _resp.clone({body: _body}) as HttpResponse<number>;
      })
    );
  }

  /**
   * Create new packing
   * @param body - body create new packing
   */
  NewPacking(body: NewPacking): Observable<number> {
    return this.NewPackingResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param lang - undefined
   */
  getFamilyTranslationsResponse(lang: string): Observable<HttpResponse<Translation[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/${lang}/family`,
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
        let _body: Translation[] = null;
        _body = _resp.body as Translation[]
        return _resp.clone({body: _body}) as HttpResponse<Translation[]>;
      })
    );
  }

  /**
   * @param lang - undefined
   */
  getFamilyTranslations(lang: string): Observable<Translation[]> {
    return this.getFamilyTranslationsResponse(lang).pipe(
      map(_r => _r.body)
    );
  }}

export module ReferencedataService {
}
