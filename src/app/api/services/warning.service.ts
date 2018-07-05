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

import { Warning } from '../models/warning';


@Injectable()
export class WarningService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Check warning equipment
   * @param idEquip - equipment id
   */
  checkWarningEquipmentResponse(idEquip?: number): Observable<HttpResponse<Warning>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (idEquip != null) __params = __params.set("idEquip", idEquip.toString());
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/input/warningequipment`,
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
        let _body: Warning = null;
        _body = _resp.body as Warning
        return _resp.clone({body: _body}) as HttpResponse<Warning>;
      })
    );
  }

  /**
   * Check warning equipment
   * @param idEquip - equipment id
   */
  checkWarningEquipment(idEquip?: number): Observable<Warning> {
    return this.checkWarningEquipmentResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check warning equipment
   * @param idStudyEquipment - study Equipment id
   * @param idStudy - study id
   * @param idEquip - equipment id
   */
  checkPhamCastResponse(params: WarningService.CheckPhamCastParams): Observable<HttpResponse<Warning>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.idEquip != null) __params = __params.set("idEquip", params.idEquip.toString());
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/input/phamcast`,
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
        let _body: Warning = null;
        _body = _resp.body as Warning
        return _resp.clone({body: _body}) as HttpResponse<Warning>;
      })
    );
  }

  /**
   * Check warning equipment
   * @param idStudyEquipment - study Equipment id
   * @param idStudy - study id
   * @param idEquip - equipment id
   */
  checkPhamCast(params: WarningService.CheckPhamCastParams): Observable<Warning> {
    return this.checkPhamCastResponse(params).pipe(
      map(_r => _r.body)
    );
  }}

export module WarningService {
  export interface CheckPhamCastParams {
    idStudyEquipment?: number;
    idStudy?: number;
    idEquip?: number;
  }
}
