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
import { TemperatureDrawing } from '../models/temperature-drawing';
import { ElmtEditForm } from '../models/elmt-edit-form';


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
   * Update study
   * @param idStudy - study id
   * @param COMMENT_TXT - study comment
   */
  updateStudyResponse(params: InputService.UpdateStudyParams): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    if (params.COMMENTTXT != null) __params = __params.set("COMMENT_TXT", params.COMMENTTXT.toString());
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/input/update/${params.idStudy}`,
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
   * Update study
   * @param idStudy - study id
   * @param COMMENT_TXT - study comment
   */
  updateStudy(params: InputService.UpdateStudyParams): Observable<number> {
    return this.updateStudyResponse(params).pipe(
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
  }
  /**
   * get data svg temperature
   */
  getDataSvgTemperatureResponse(): Observable<HttpResponse<TemperatureDrawing>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/input/tempprofile`,
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
        let _body: TemperatureDrawing = null;
        _body = _resp.body as TemperatureDrawing
        return _resp.clone({body: _body}) as HttpResponse<TemperatureDrawing>;
      })
    );
  }

  /**
   * get data svg temperature
   */
  getDataSvgTemperature(): Observable<TemperatureDrawing> {
    return this.getDataSvgTemperatureResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get data tempoint
   * @param INDEX_TEMP - undefined
   * @param ID_PROD - undefined
   */
  getDataTempointResponse(params: InputService.GetDataTempointParams): Observable<HttpResponse<ElmtEditForm>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.INDEXTEMP != null) __params = __params.set("INDEX_TEMP", params.INDEXTEMP.toString());
    if (params.IDPROD != null) __params = __params.set("ID_PROD", params.IDPROD.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/input/temppoint`,
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
        let _body: ElmtEditForm = null;
        _body = _resp.body as ElmtEditForm
        return _resp.clone({body: _body}) as HttpResponse<ElmtEditForm>;
      })
    );
  }

  /**
   * get data tempoint
   * @param INDEX_TEMP - undefined
   * @param ID_PROD - undefined
   */
  getDataTempoint(params: InputService.GetDataTempointParams): Observable<ElmtEditForm> {
    return this.getDataTempointResponse(params).pipe(
      map(_r => _r.body)
    );
  }}

export module InputService {
  export interface UpdateStudyParams {
    idStudy: number;
    COMMENTTXT?: string;
  }
  export interface GetDataTempointParams {
    INDEXTEMP: number;
    IDPROD: number;
  }
}
