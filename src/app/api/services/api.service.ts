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

import { Login } from '../models/login';
import { Study } from '../models/study';
import { Equipment } from '../models/equipment';
import { Production } from '../models/production';
import { Component } from '../models/component';
import { Shape } from '../models/shape';
import { PackingElement } from '../models/packing-element';


@Injectable()
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param body - The username/password
   */
  loginResponse(body: Login): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/login`,
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
   * @param body - The username/password
   */
  login(body: Login): Observable<void> {
    return this.loginResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  logoutResponse(): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/logout`,
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
  logout(): Observable<void> {
    return this.logoutResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of studies
   * @param mine - true will return studies of current logged in user, false for getting other studies
   */
  findStudiesResponse(mine?: boolean): Observable<HttpResponse<Study[]>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (mine != null) __params = __params.set("mine", mine.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies`,
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
        let _body: Study[] = null;
        _body = _resp.body as Study[]
        return _resp.clone({body: _body}) as HttpResponse<Study[]>;
      })
    );
  }

  /**
   * Get a list of studies
   * @param mine - true will return studies of current logged in user, false for getting other studies
   */
  findStudies(mine?: boolean): Observable<Study[]> {
    return this.findStudiesResponse(mine).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * create a new study
   * @param study - The study to create.
   */
  createStudyResponse(study?: Study): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = study;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies`,
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
   * create a new study
   * @param study - The study to create.
   */
  createStudy(study?: Study): Observable<void> {
    return this.createStudyResponse(study).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Study ID
   */
  getStudyByIdResponse(id: number): Observable<HttpResponse<Study>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}`,
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
        let _body: Study = null;
        _body = _resp.body as Study
        return _resp.clone({body: _body}) as HttpResponse<Study>;
      })
    );
  }

  /**
   * @param id - Study ID
   */
  getStudyById(id: number): Observable<Study> {
    return this.getStudyByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Study ID
   */
  deleteStudyByIdResponse(id: number): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/studies/${id}`,
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
   * @param id - Study ID
   */
  deleteStudyById(id: number): Observable<void> {
    return this.deleteStudyByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - id study to open
   */
  openStudyResponse(id: number): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/open`,
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
   * @param id - id study to open
   */
  openStudy(id: number): Observable<void> {
    return this.openStudyResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - refresh mesh of study
   */
  refreshMeshResponse(id: number): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/refreshMesh`,
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
   * @param id - refresh mesh of study
   */
  refreshMesh(id: number): Observable<void> {
    return this.refreshMeshResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param name - new study name.
   * @param id - id study to open.
   */
  saveStudyAsResponse(params: ApiService.SaveStudyAsParams): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/clone`,
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
   * @param name - new study name.
   * @param id - id study to open.
   */
  saveStudyAs(params: ApiService.SaveStudyAsParams): Observable<void> {
    return this.saveStudyAsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get all available equipments
   * @param size - undefined
   * @param process_type - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param family - undefined
   * @param equip_origin - undefined
   * @param energy - undefined
   */
  getEquipmentsResponse(params: ApiService.GetEquipmentsParams): Observable<HttpResponse<Equipment[]>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.size != null) __params = __params.set("size", params.size.toString());
    if (params.processType != null) __params = __params.set("process_type", params.processType.toString());
    if (params.model != null) __params = __params.set("model", params.model.toString());
    if (params.manufacturer != null) __params = __params.set("manufacturer", params.manufacturer.toString());
    if (params.family != null) __params = __params.set("family", params.family.toString());
    if (params.equipOrigin != null) __params = __params.set("equip_origin", params.equipOrigin.toString());
    if (params.energy != null) __params = __params.set("energy", params.energy.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/equipments`,
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
        let _body: Equipment[] = null;
        _body = _resp.body as Equipment[]
        return _resp.clone({body: _body}) as HttpResponse<Equipment[]>;
      })
    );
  }

  /**
   * get all available equipments
   * @param size - undefined
   * @param process_type - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param family - undefined
   * @param equip_origin - undefined
   * @param energy - undefined
   */
  getEquipments(params: ApiService.GetEquipmentsParams): Observable<Equipment[]> {
    return this.getEquipmentsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get equipment by id
   * @param id - Equipment ID
   */
  getEquipmentByIdResponse(id: number): Observable<HttpResponse<Equipment>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/equipments/${id}`,
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
        let _body: Equipment = null;
        _body = _resp.body as Equipment
        return _resp.clone({body: _body}) as HttpResponse<Equipment>;
      })
    );
  }

  /**
   * get equipment by id
   * @param id - Equipment ID
   */
  getEquipmentById(id: number): Observable<Equipment> {
    return this.getEquipmentByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get production by id
   * @param id - Production ID
   */
  getProductionByIdResponse(id: number): Observable<HttpResponse<Production>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/productions/${id}`,
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
        let _body: Production = null;
        _body = _resp.body as Production
        return _resp.clone({body: _body}) as HttpResponse<Production>;
      })
    );
  }

  /**
   * get production by id
   * @param id - Production ID
   */
  getProductionById(id: number): Observable<Production> {
    return this.getProductionByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * find available components by filter
   * @param waterpercent - undefined
   * @param subfamily - undefined
   * @param compfamily - undefined
   */
  findComponentsResponse(params: ApiService.FindComponentsParams): Observable<HttpResponse<Component[]>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.waterpercent != null) __params = __params.set("waterpercent", params.waterpercent.toString());
    if (params.subfamily != null) __params = __params.set("subfamily", params.subfamily.toString());
    if (params.compfamily != null) __params = __params.set("compfamily", params.compfamily.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/components`,
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
        let _body: Component[] = null;
        _body = _resp.body as Component[]
        return _resp.clone({body: _body}) as HttpResponse<Component[]>;
      })
    );
  }

  /**
   * find available components by filter
   * @param waterpercent - undefined
   * @param subfamily - undefined
   * @param compfamily - undefined
   */
  findComponents(params: ApiService.FindComponentsParams): Observable<Component[]> {
    return this.findComponentsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * todo
   */
  getUsersResponse(): Observable<HttpResponse<void>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/users`,
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
   * todo
   */
  getUsers(): Observable<void> {
    return this.getUsersResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get available shapes
   */
  getShapesResponse(): Observable<HttpResponse<Shape[]>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/shapes`,
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
        let _body: Shape[] = null;
        _body = _resp.body as Shape[]
        return _resp.clone({body: _body}) as HttpResponse<Shape[]>;
      })
    );
  }

  /**
   * get available shapes
   */
  getShapes(): Observable<Shape[]> {
    return this.getShapesResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get available packing elements
   */
  findPackingElementsResponse(): Observable<HttpResponse<PackingElement[]>> {
    let __params = new HttpParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/packingElements`,
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
        let _body: PackingElement[] = null;
        _body = _resp.body as PackingElement[]
        return _resp.clone({body: _body}) as HttpResponse<PackingElement[]>;
      })
    );
  }

  /**
   * get available packing elements
   */
  findPackingElements(): Observable<PackingElement[]> {
    return this.findPackingElementsResponse().pipe(
      map(_r => _r.body)
    );
  }}

export module ApiService {
  export interface SaveStudyAsParams {
    name: string;
    id: number;
  }
  export interface GetEquipmentsParams {
    size?: number;
    processType?: number;
    model?: number;
    manufacturer?: number;
    family?: number;
    equipOrigin?: number;
    energy?: number;
  }
  export interface FindComponentsParams {
    waterpercent?: number;
    subfamily?: number;
    compfamily?: number;
  }
}
