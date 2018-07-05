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

import { Mesh3dInfo } from '../models/mesh-3d-info';
import { ViewMesh } from '../models/view-mesh';


@Injectable()
export class New3dService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Get mesh3dInfo by id prod
   * @param idProd - undefined
   */
  getMesh3DInfoResponse(idProd: number): Observable<HttpResponse<Mesh3dInfo>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/threed/mesh3dInfo/${idProd}`,
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
        let _body: Mesh3dInfo = null;
        _body = _resp.body as Mesh3dInfo
        return _resp.clone({body: _body}) as HttpResponse<Mesh3dInfo>;
      })
    );
  }

  /**
   * Get mesh3dInfo by id prod
   * @param idProd - undefined
   */
  getMesh3DInfo(idProd: number): Observable<Mesh3dInfo> {
    return this.getMesh3DInfoResponse(idProd).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * initialize 3D temperature
   * @param initTemp - undefined
   * @param idProd - undefined
   */
  initIso3DTemperatureResponse(params: New3dService.InitIso3DTemperatureParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.initTemp != null) __params = __params.set("initTemp", params.initTemp.toString());
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/threed/${params.idProd}/initIso3DTemperature`,
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
   * initialize 3D temperature
   * @param initTemp - undefined
   * @param idProd - undefined
   */
  initIso3DTemperature(params: New3dService.InitIso3DTemperatureParams): Observable<void> {
    return this.initIso3DTemperatureResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * initialize non isothermal 3D temperature
   * @param idProd - undefined
   * @param body - undefined
   */
  initNonIso3DTemperatureResponse(params: New3dService.InitNonIso3DTemperatureParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/threed/${params.idProd}/initNonIso3DTemperature`,
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
   * initialize non isothermal 3D temperature
   * @param idProd - undefined
   * @param body - undefined
   */
  initNonIso3DTemperature(params: New3dService.InitNonIso3DTemperatureParams): Observable<void> {
    return this.initNonIso3DTemperatureResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Initial tempRecordpts 3D
   * @param idStudy - study id
   */
  initTempRecordPts3DResponse(idStudy: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/threed/meshinitial/${idStudy}`,
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
   * Initial tempRecordpts 3D
   * @param idStudy - study id
   */
  initTempRecordPts3D(idStudy: number): Observable<void> {
    return this.initTempRecordPts3DResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }}

export module New3dService {
  export interface InitIso3DTemperatureParams {
    initTemp: number;
    idProd: number;
  }
  export interface InitNonIso3DTemperatureParams {
    idProd: number;
    body: ViewMesh;
  }
}
