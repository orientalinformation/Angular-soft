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

import { SVGChart } from '../models/svgchart';


@Injectable()
export class InputService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Initial tempRecordpts
   * @param idStudy - study id
   */
  initTempRecordPtsResponse(idStudy: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/input/meshinitial/${idStudy}`,
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
   * Initial tempRecordpts
   * @param idStudy - study id
   */
  initTempRecordPts(idStudy: number): Observable<void> {
    return this.initTempRecordPtsResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get data svg
   */
  getDataSvgChartResponse(): Observable<HttpResponse<SVGChart>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/input/svgchart`,
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
        let _body: SVGChart = null;
        _body = _resp.body as SVGChart
        return _resp.clone({body: _body}) as HttpResponse<SVGChart>;
      })
    );
  }

  /**
   * get data svg
   */
  getDataSvgChart(): Observable<SVGChart> {
    return this.getDataSvgChartResponse().pipe(
      map(_r => _r.body)
    );
  }}

export module InputService {
}
