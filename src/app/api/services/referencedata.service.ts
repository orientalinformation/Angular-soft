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

import { ViewMinMax } from '../models/view-min-max';
import { ViewComponent } from '../models/view-component';
import { PackingElmt } from '../models/packing-elmt';
import { PipeLineElmt } from '../models/pipe-line-elmt';
import { NewEquipment } from '../models/new-equipment';
import { ViewCurve } from '../models/view-curve';
import { ViewTempSetPoint } from '../models/view-temp-set-point';
import { VComponent } from '../models/vcomponent';
import { ViewFamily } from '../models/view-family';
import { ViewTemperature } from '../models/view-temperature';
import { ResultCalculateFreeze } from '../models/result-calculate-freeze';
import { MyComponent } from '../models/my-component';
import { Compenth } from '../models/compenth';
import { FilterEquipment } from '../models/filter-equipment';
import { ViewPackingElmt } from '../models/view-packing-elmt';
import { ViewPipeLineElmt } from '../models/view-pipe-line-elmt';
import { ViewEquipment } from '../models/view-equipment';
import { RefEquipment } from '../models/ref-equipment';
import { SaveEquipment } from '../models/save-equipment';
import { SaveAsEquipment } from '../models/save-as-equipment';
import { EquipmentFamily } from '../models/equipment-family';
import { EquipmentSeries } from '../models/equipment-series';
import { Ramps } from '../models/ramps';
import { Shelves } from '../models/shelves';
import { Consumptions } from '../models/consumptions';
import { EquipCharact } from '../models/equip-charact';
import { ViewHighChart } from '../models/view-high-chart';
import { DataHightChart } from '../models/data-hight-chart';
import { ResultBuildForNewTR } from '../models/result-build-for-new-tr';
import { ViewCapability } from '../models/view-capability';


@Injectable()
export class ReferencedataService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Check Data Component Parameters
   * @param body - body  Check Start Calculation Parameters
   */
  checkSaveDataComponentResponse(body: ViewComponent): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/savedatacomponent`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check Data Component Parameters
   * @param body - body  Check Start Calculation Parameters
   */
  checkSaveDataComponent(body: ViewComponent): Observable<ViewMinMax> {
    return this.checkSaveDataComponentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max temperatures
   * @param temperatures - temperatures check
   */
  checkTemperatureResponse(temperatures: number): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (temperatures != null) __params = __params.set("temperatures", temperatures.toString());
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checktemperature`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max temperatures
   * @param temperatures - temperatures check
   */
  checkTemperature(temperatures: number): Observable<ViewMinMax> {
    return this.checkTemperatureResponse(temperatures).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max Packing
   * @param body - body check packing
   */
  checkPackingResponse(body: PackingElmt): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checkpacking`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max Packing
   * @param body - body check packing
   */
  checkPacking(body: PackingElmt): Observable<ViewMinMax> {
    return this.checkPackingResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max Pipeline
   * @param body - body check Pipeline
   */
  checkPipelineResponse(body: PipeLineElmt): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checkpipeline`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max Pipeline
   * @param body - body check Pipeline
   */
  checkPipeline(body: PipeLineElmt): Observable<ViewMinMax> {
    return this.checkPipelineResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max Equipment
   * @param body - body check Equipment
   */
  checkEquipmentResponse(body: NewEquipment): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checkequipment`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max Equipment
   * @param body - body check Equipment
   */
  checkEquipment(body: NewEquipment): Observable<ViewMinMax> {
    return this.checkEquipmentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max Curves
   * @param body - body check Curves
   */
  checkRedrawCurvesResponse(body: ViewCurve): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checkredrawcurves`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max Curves
   * @param body - body check Curves
   */
  checkRedrawCurves(body: ViewCurve): Observable<ViewMinMax> {
    return this.checkRedrawCurvesResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Check unit min max tempsetpoint
   * @param body - body check tempsetpoint
   */
  checkBuildForNewTRResponse(body: ViewTempSetPoint): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/checktempsetpoint`,
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
        let _body: ViewMinMax = null;
        _body = _resp.body as ViewMinMax
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMax>;
      })
    );
  }

  /**
   * Check unit min max tempsetpoint
   * @param body - body check tempsetpoint
   */
  checkBuildForNewTR(body: ViewTempSetPoint): Observable<ViewMinMax> {
    return this.checkBuildForNewTRResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get component by id
   * @param id - undefined
   */
  getComponentByIdResponse(id: number): Observable<HttpResponse<VComponent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/components/${id}`,
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
        let _body: VComponent = null;
        _body = _resp.body as VComponent
        return _resp.clone({body: _body}) as HttpResponse<VComponent>;
      })
    );
  }

  /**
   * Get component by id
   * @param id - undefined
   */
  getComponentById(id: number): Observable<VComponent> {
    return this.getComponentByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getDataComponentResponse(compfamily: string): Observable<HttpResponse<ViewComponent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (compfamily != null) __params = __params.set("compfamily", compfamily.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/component`,
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
        let _body: ViewComponent = null;
        _body = _resp.body as ViewComponent
        return _resp.clone({body: _body}) as HttpResponse<ViewComponent>;
      })
    );
  }

  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getDataComponent(compfamily: string): Observable<ViewComponent> {
    return this.getDataComponentResponse(compfamily).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Save data component
   * @param body - body save Component
   */
  saveDataComponentResponse(body: ViewComponent): Observable<HttpResponse<VComponent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/component`,
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
        let _body: VComponent = null;
        _body = _resp.body as VComponent
        return _resp.clone({body: _body}) as HttpResponse<VComponent>;
      })
    );
  }

  /**
   * Save data component
   * @param body - body save Component
   */
  saveDataComponent(body: ViewComponent): Observable<VComponent> {
    return this.saveDataComponentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getDataSubFamilyResponse(compfamily?: string): Observable<HttpResponse<ViewFamily[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (compfamily != null) __params = __params.set("compfamily", compfamily.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/subfamily`,
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
        let _body: ViewFamily[] = null;
        _body = _resp.body as ViewFamily[]
        return _resp.clone({body: _body}) as HttpResponse<ViewFamily[]>;
      })
    );
  }

  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getDataSubFamily(compfamily?: string): Observable<ViewFamily[]> {
    return this.getDataSubFamilyResponse(compfamily).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getFilterComponentResponse(compfamily: string): Observable<HttpResponse<ViewComponent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (compfamily != null) __params = __params.set("compfamily", compfamily.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/component/filter`,
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
        let _body: ViewComponent = null;
        _body = _resp.body as ViewComponent
        return _resp.clone({body: _body}) as HttpResponse<ViewComponent>;
      })
    );
  }

  /**
   * Get a list of family component
   * @param compfamily - undefined
   */
  getFilterComponent(compfamily: string): Observable<ViewComponent> {
    return this.getFilterComponentResponse(compfamily).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Component Id
   */
  getTemperaturesByIdCompResponse(id: number): Observable<HttpResponse<ViewTemperature[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/component/${id}`,
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
        let _body: ViewTemperature[] = null;
        _body = _resp.body as ViewTemperature[]
        return _resp.clone({body: _body}) as HttpResponse<ViewTemperature[]>;
      })
    );
  }

  /**
   * @param id - Component Id
   */
  getTemperaturesByIdComp(id: number): Observable<ViewTemperature[]> {
    return this.getTemperaturesByIdCompResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete component
   * @param id - undefined
   */
  deleteComponentResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/component/${id}`,
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
   * delete component
   * @param id - undefined
   */
  deleteComponent(id: number): Observable<number> {
    return this.deleteComponentResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * run calculatefreeze component
   * @param body - body run calculatefreeze
   */
  calculateFreezeResponse(body: ViewComponent): Observable<HttpResponse<ResultCalculateFreeze>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/calculatefreeze`,
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
        let _body: ResultCalculateFreeze = null;
        _body = _resp.body as ResultCalculateFreeze
        return _resp.clone({body: _body}) as HttpResponse<ResultCalculateFreeze>;
      })
    );
  }

  /**
   * run calculatefreeze component
   * @param body - body run calculatefreeze
   */
  calculateFreeze(body: ViewComponent): Observable<ResultCalculateFreeze> {
    return this.calculateFreezeResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * run calculate component
   * @param body - body run calculate
   */
  startFCCalculateResponse(body: ViewComponent): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/calculate`,
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
   * run calculate component
   * @param body - body run calculate
   */
  startFCCalculate(body: ViewComponent): Observable<number> {
    return this.startFCCalculateResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list my component
   */
  getMyComponentResponse(): Observable<HttpResponse<MyComponent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/components`,
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
        let _body: MyComponent = null;
        _body = _resp.body as MyComponent
        return _resp.clone({body: _body}) as HttpResponse<MyComponent>;
      })
    );
  }

  /**
   * Get list my component
   */
  getMyComponent(): Observable<MyComponent> {
    return this.getMyComponentResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list compenth by Id compenth
   * @param idComp - Compenth id
   */
  getCompenthsByIdCompResponse(idComp: number): Observable<HttpResponse<Compenth[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/compenths/${idComp}`,
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
        let _body: Compenth[] = null;
        _body = _resp.body as Compenth[]
        return _resp.clone({body: _body}) as HttpResponse<Compenth[]>;
      })
    );
  }

  /**
   * Get list compenth by Id compenth
   * @param idComp - Compenth id
   */
  getCompenthsByIdComp(idComp: number): Observable<Compenth[]> {
    return this.getCompenthsByIdCompResponse(idComp).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get compenth by id
   * @param id - Compenth id
   */
  getCompenthByIdResponse(id: number): Observable<HttpResponse<Compenth>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/compenth/${id}`,
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
        let _body: Compenth = null;
        _body = _resp.body as Compenth
        return _resp.clone({body: _body}) as HttpResponse<Compenth>;
      })
    );
  }

  /**
   * Get compenth by id
   * @param id - Compenth id
   */
  getCompenthById(id: number): Observable<Compenth> {
    return this.getCompenthByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Save data compenth
   * @param body - body save Compenth
   */
  updateCompenthResponse(body: Compenth): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/compenth`,
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
   * Save data compenth
   * @param body - body save Compenth
   */
  updateCompenth(body: Compenth): Observable<number> {
    return this.updateCompenthResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get data equipment of filter
   * @param id - Equipment id
   */
  getEquipmentFilterResponse(id: number): Observable<HttpResponse<FilterEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipment/${id}/filter`,
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
        let _body: FilterEquipment = null;
        _body = _resp.body as FilterEquipment
        return _resp.clone({body: _body}) as HttpResponse<FilterEquipment>;
      })
    );
  }

  /**
   * Get data equipment of filter
   * @param id - Equipment id
   */
  getEquipmentFilter(id: number): Observable<FilterEquipment> {
    return this.getEquipmentFilterResponse(id).pipe(
      map(_r => _r.body)
    );
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
   * update packing
   * @param body - body update packing
   */
  updatePackingResponse(body: PackingElmt): Observable<HttpResponse<PackingElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
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
        let _body: PackingElmt = null;
        _body = _resp.body as PackingElmt
        return _resp.clone({body: _body}) as HttpResponse<PackingElmt>;
      })
    );
  }

  /**
   * update packing
   * @param body - body update packing
   */
  updatePacking(body: PackingElmt): Observable<PackingElmt> {
    return this.updatePackingResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Create new packing
   * @param body - body create new packing
   */
  newPackingResponse(body: PackingElmt): Observable<HttpResponse<PackingElmt>> {
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
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      filter(_r => _r instanceof HttpResponse),
      map(_r => {
        let _resp = _r as HttpResponse<any>;
        let _body: PackingElmt = null;
        _body = _resp.body as PackingElmt
        return _resp.clone({body: _body}) as HttpResponse<PackingElmt>;
      })
    );
  }

  /**
   * Create new packing
   * @param body - body create new packing
   */
  newPacking(body: PackingElmt): Observable<PackingElmt> {
    return this.newPackingResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete Packing
   * @param id - undefined
   */
  deletePackingResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/packing/${id}`,
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
   * delete Packing
   * @param id - undefined
   */
  deletePacking(id: number): Observable<number> {
    return this.deletePackingResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save as packing
   * @param body - body save as packing
   */
  saveAsPackingResponse(body: PackingElmt): Observable<HttpResponse<PackingElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/packingelmt`,
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
        let _body: PackingElmt = null;
        _body = _resp.body as PackingElmt
        return _resp.clone({body: _body}) as HttpResponse<PackingElmt>;
      })
    );
  }

  /**
   * save as packing
   * @param body - body save as packing
   */
  saveAsPacking(body: PackingElmt): Observable<PackingElmt> {
    return this.saveAsPackingResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of pipeLineElmt
   */
  findRefPipelineResponse(): Observable<HttpResponse<ViewPipeLineElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/pipeline`,
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
        let _body: ViewPipeLineElmt = null;
        _body = _resp.body as ViewPipeLineElmt
        return _resp.clone({body: _body}) as HttpResponse<ViewPipeLineElmt>;
      })
    );
  }

  /**
   * Get a list of pipeLineElmt
   */
  findRefPipeline(): Observable<ViewPipeLineElmt> {
    return this.findRefPipelineResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * update pipe line
   * @param body - body update pipe line
   */
  updatePipeLineResponse(body: PipeLineElmt): Observable<HttpResponse<PipeLineElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/pipeline`,
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
        let _body: PipeLineElmt = null;
        _body = _resp.body as PipeLineElmt
        return _resp.clone({body: _body}) as HttpResponse<PipeLineElmt>;
      })
    );
  }

  /**
   * update pipe line
   * @param body - body update pipe line
   */
  updatePipeLine(body: PipeLineElmt): Observable<PipeLineElmt> {
    return this.updatePipeLineResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Create new pipeline
   * @param body - body create new pipeline
   */
  newPipeLineResponse(body: PipeLineElmt): Observable<HttpResponse<PipeLineElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/pipeline`,
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
        let _body: PipeLineElmt = null;
        _body = _resp.body as PipeLineElmt
        return _resp.clone({body: _body}) as HttpResponse<PipeLineElmt>;
      })
    );
  }

  /**
   * Create new pipeline
   * @param body - body create new pipeline
   */
  newPipeLine(body: PipeLineElmt): Observable<PipeLineElmt> {
    return this.newPipeLineResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete pipe line
   * @param id - undefined
   */
  deletePipeLineResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/pipeline/${id}`,
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
   * delete pipe line
   * @param id - undefined
   */
  deletePipeLine(id: number): Observable<number> {
    return this.deletePipeLineResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save as pipe line
   * @param body - body save as pipe line
   */
  saveAsPipeLineResponse(body: PipeLineElmt): Observable<HttpResponse<PipeLineElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/lineelmt`,
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
        let _body: PipeLineElmt = null;
        _body = _resp.body as PipeLineElmt
        return _resp.clone({body: _body}) as HttpResponse<PipeLineElmt>;
      })
    );
  }

  /**
   * save as pipe line
   * @param body - body save as pipe line
   */
  saveAsPipeLine(body: PipeLineElmt): Observable<PipeLineElmt> {
    return this.saveAsPipeLineResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of equipment
   */
  findRefEquipmentResponse(): Observable<HttpResponse<ViewEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipments`,
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
        let _body: ViewEquipment = null;
        _body = _resp.body as ViewEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewEquipment>;
      })
    );
  }

  /**
   * Get a list of equipment
   */
  findRefEquipment(): Observable<ViewEquipment> {
    return this.findRefEquipmentResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Create new equipment
   * @param body - body create new equipment
   */
  newEquipmentResponse(body: NewEquipment): Observable<HttpResponse<RefEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/equipments`,
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
        let _body: RefEquipment = null;
        _body = _resp.body as RefEquipment
        return _resp.clone({body: _body}) as HttpResponse<RefEquipment>;
      })
    );
  }

  /**
   * Create new equipment
   * @param body - body create new equipment
   */
  newEquipment(body: NewEquipment): Observable<RefEquipment> {
    return this.newEquipmentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save equipment
   * @param body - body save equipment
   */
  saveEquipmentResponse(body: SaveEquipment): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/equipment`,
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
   * save equipment
   * @param body - body save equipment
   */
  saveEquipment(body: SaveEquipment): Observable<number> {
    return this.saveEquipmentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save as equipment
   * @param body - body create new equipment
   */
  saveAsEquipmentResponse(body: SaveAsEquipment): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/equipment`,
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
   * save as equipment
   * @param body - body create new equipment
   */
  saveAsEquipment(body: SaveAsEquipment): Observable<number> {
    return this.saveAsEquipmentResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of equipment family
   */
  getEquipmentFamilyResponse(): Observable<HttpResponse<EquipmentFamily>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipmentfamilys`,
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
        let _body: EquipmentFamily = null;
        _body = _resp.body as EquipmentFamily
        return _resp.clone({body: _body}) as HttpResponse<EquipmentFamily>;
      })
    );
  }

  /**
   * Get a list of equipment family
   */
  getEquipmentFamily(): Observable<EquipmentFamily> {
    return this.getEquipmentFamilyResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list equipment series
   * @param idFamily - ID equipment family
   */
  getEquipmentSeriesResponse(idFamily: number): Observable<HttpResponse<EquipmentSeries>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (idFamily != null) __params = __params.set("idFamily", idFamily.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipmentseries`,
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
        let _body: EquipmentSeries = null;
        _body = _resp.body as EquipmentSeries
        return _resp.clone({body: _body}) as HttpResponse<EquipmentSeries>;
      })
    );
  }

  /**
   * Get list equipment series
   * @param idFamily - ID equipment family
   */
  getEquipmentSeries(idFamily: number): Observable<EquipmentSeries> {
    return this.getEquipmentSeriesResponse(idFamily).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list Ramps
   * @param idEquip - ID equipment
   */
  getRampsResponse(idEquip: number): Observable<HttpResponse<Ramps[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (idEquip != null) __params = __params.set("idEquip", idEquip.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/ramps`,
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
        let _body: Ramps[] = null;
        _body = _resp.body as Ramps[]
        return _resp.clone({body: _body}) as HttpResponse<Ramps[]>;
      })
    );
  }

  /**
   * Get list Ramps
   * @param idEquip - ID equipment
   */
  getRamps(idEquip: number): Observable<Ramps[]> {
    return this.getRampsResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list Shelves
   * @param idEquip - ID equipment
   */
  getShelvesResponse(idEquip: number): Observable<HttpResponse<Shelves[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (idEquip != null) __params = __params.set("idEquip", idEquip.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/shelves`,
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
        let _body: Shelves[] = null;
        _body = _resp.body as Shelves[]
        return _resp.clone({body: _body}) as HttpResponse<Shelves[]>;
      })
    );
  }

  /**
   * Get list Shelves
   * @param idEquip - ID equipment
   */
  getShelves(idEquip: number): Observable<Shelves[]> {
    return this.getShelvesResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list Consumptions
   * @param idEquip - ID equipment
   */
  getConsumptionsResponse(idEquip: number): Observable<HttpResponse<Consumptions[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (idEquip != null) __params = __params.set("idEquip", idEquip.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/consumptions`,
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
        let _body: Consumptions[] = null;
        _body = _resp.body as Consumptions[]
        return _resp.clone({body: _body}) as HttpResponse<Consumptions[]>;
      })
    );
  }

  /**
   * Get list Consumptions
   * @param idEquip - ID equipment
   */
  getConsumptions(idEquip: number): Observable<Consumptions[]> {
    return this.getConsumptionsResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * run equipment calculate
   * @param id - undefined
   */
  startEquipmentCalculateResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/equipment/${id}`,
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
   * run equipment calculate
   * @param id - undefined
   */
  startEquipmentCalculate(id: number): Observable<number> {
    return this.startEquipmentCalculateResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete equipment
   * @param id - undefined
   */
  deleteEquipmentResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/equipment/${id}`,
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
   * delete equipment
   * @param id - undefined
   */
  deleteEquipment(id: number): Observable<number> {
    return this.deleteEquipmentResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list equipment chart by Id equipment
   * @param idEquip - equipment id
   */
  getEquipmentCharactsResponse(idEquip: number): Observable<HttpResponse<EquipCharact[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipcharacts/${idEquip}`,
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
        let _body: EquipCharact[] = null;
        _body = _resp.body as EquipCharact[]
        return _resp.clone({body: _body}) as HttpResponse<EquipCharact[]>;
      })
    );
  }

  /**
   * Get list equipment chart by Id equipment
   * @param idEquip - equipment id
   */
  getEquipmentCharacts(idEquip: number): Observable<EquipCharact[]> {
    return this.getEquipmentCharactsResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete list equip charact
   * @param idEquip - undefined
   */
  deleteEquipCharactsResponse(idEquip: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/equipcharacts/${idEquip}`,
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
   * delete list equip charact
   * @param idEquip - undefined
   */
  deleteEquipCharacts(idEquip: number): Observable<number> {
    return this.deleteEquipCharactsResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get data highchart
   * @param typeChart - undefined
   * @param profilType - undefined
   * @param profilFace - undefined
   * @param newProfil - undefined
   * @param minScaleY - undefined
   * @param maxScaleY - undefined
   * @param ID_EQUIP - undefined
   */
  getDataHighChartResponse(params: ReferencedataService.GetDataHighChartParams): Observable<HttpResponse<ViewHighChart>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.typeChart != null) __params = __params.set("typeChart", params.typeChart.toString());
    if (params.profilType != null) __params = __params.set("profilType", params.profilType.toString());
    if (params.profilFace != null) __params = __params.set("profilFace", params.profilFace.toString());
    if (params.newProfil != null) __params = __params.set("newProfil", params.newProfil.toString());
    if (params.minScaleY != null) __params = __params.set("minScaleY", params.minScaleY.toString());
    if (params.maxScaleY != null) __params = __params.set("maxScaleY", params.maxScaleY.toString());
    if (params.IDEQUIP != null) __params = __params.set("ID_EQUIP", params.IDEQUIP.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/highchart`,
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
        let _body: ViewHighChart = null;
        _body = _resp.body as ViewHighChart
        return _resp.clone({body: _body}) as HttpResponse<ViewHighChart>;
      })
    );
  }

  /**
   * Get data highchart
   * @param typeChart - undefined
   * @param profilType - undefined
   * @param profilFace - undefined
   * @param newProfil - undefined
   * @param minScaleY - undefined
   * @param maxScaleY - undefined
   * @param ID_EQUIP - undefined
   */
  getDataHighChart(params: ReferencedataService.GetDataHighChartParams): Observable<ViewHighChart> {
    return this.getDataHighChartResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save Selected Profile
   * @param body - body save DataHightChart
   */
  saveSelectedProfileResponse(body: DataHightChart): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/highchart`,
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
   * save Selected Profile
   * @param body - body save DataHightChart
   */
  saveSelectedProfile(body: DataHightChart): Observable<number> {
    return this.saveSelectedProfileResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get equipcharact by id
   * @param id - Compenth id
   */
  getEquipCharactByIdResponse(id: number): Observable<HttpResponse<EquipCharact>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/equipcharact/${id}`,
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
        let _body: EquipCharact = null;
        _body = _resp.body as EquipCharact
        return _resp.clone({body: _body}) as HttpResponse<EquipCharact>;
      })
    );
  }

  /**
   * Get equipcharact by id
   * @param id - Compenth id
   */
  getEquipCharactById(id: number): Observable<EquipCharact> {
    return this.getEquipCharactByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * delete equip charact
   * @param id - undefined
   */
  deleteEquipCharactResponse(id: number): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/referencedata/equipcharact/${id}`,
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
   * delete equip charact
   * @param id - undefined
   */
  deleteEquipCharact(id: number): Observable<number> {
    return this.deleteEquipCharactResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - add equip EquipCharact
   */
  addEquipCharactResponse(body: EquipCharact): Observable<HttpResponse<EquipCharact>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/referencedata/equipcharact`,
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
        let _body: EquipCharact = null;
        _body = _resp.body as EquipCharact
        return _resp.clone({body: _body}) as HttpResponse<EquipCharact>;
      })
    );
  }

  /**
   * @param body - add equip EquipCharact
   */
  addEquipCharact(body: EquipCharact): Observable<EquipCharact> {
    return this.addEquipCharactResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - update equip EquipCharact
   */
  updateEquipCharactResponse(body: EquipCharact): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/equipcharact`,
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
   * @param body - update equip EquipCharact
   */
  updateEquipCharact(body: EquipCharact): Observable<number> {
    return this.updateEquipCharactResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get data curve
   * @param idEquip - undefined
   */
  getDataCurveResponse(idEquip: number): Observable<HttpResponse<ViewCurve>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/curve/${idEquip}`,
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
        let _body: ViewCurve = null;
        _body = _resp.body as ViewCurve
        return _resp.clone({body: _body}) as HttpResponse<ViewCurve>;
      })
    );
  }

  /**
   * Get data curve
   * @param idEquip - undefined
   */
  getDataCurve(idEquip: number): Observable<ViewCurve> {
    return this.getDataCurveResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - redrawCurves
   */
  redrawCurvesResponse(body: ViewCurve): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/redrawcurves`,
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
   * @param body - redrawCurves
   */
  redrawCurves(body: ViewCurve): Observable<number> {
    return this.redrawCurvesResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get set temp point
   * @param idEquip - equipment id
   */
  getTempSetPointResponse(idEquip: number): Observable<HttpResponse<ViewTempSetPoint>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/tempsetpoint/${idEquip}`,
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
        let _body: ViewTempSetPoint = null;
        _body = _resp.body as ViewTempSetPoint
        return _resp.clone({body: _body}) as HttpResponse<ViewTempSetPoint>;
      })
    );
  }

  /**
   * Get set temp point
   * @param idEquip - equipment id
   */
  getTempSetPoint(idEquip: number): Observable<ViewTempSetPoint> {
    return this.getTempSetPointResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - build for new TR
   */
  buildForNewTRResponse(body: ViewTempSetPoint): Observable<HttpResponse<ResultBuildForNewTR>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/referencedata/tempsetpoint`,
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
        let _body: ResultBuildForNewTR = null;
        _body = _resp.body as ResultBuildForNewTR
        return _resp.clone({body: _body}) as HttpResponse<ResultBuildForNewTR>;
      })
    );
  }

  /**
   * @param body - build for new TR
   */
  buildForNewTR(body: ViewTempSetPoint): Observable<ResultBuildForNewTR> {
    return this.buildForNewTRResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get value capability
   * @param idEquip - equipment id
   */
  getCapabitityResponse(idEquip: number): Observable<HttpResponse<ViewCapability>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/referencedata/capability/${idEquip}`,
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
        let _body: ViewCapability = null;
        _body = _resp.body as ViewCapability
        return _resp.clone({body: _body}) as HttpResponse<ViewCapability>;
      })
    );
  }

  /**
   * Get value capability
   * @param idEquip - equipment id
   */
  getCapabitity(idEquip: number): Observable<ViewCapability> {
    return this.getCapabitityResponse(idEquip).pipe(
      map(_r => _r.body)
    );
  }}

export module ReferencedataService {
  export interface GetDataHighChartParams {
    typeChart: number;
    profilType: number;
    profilFace: number;
    newProfil: string;
    minScaleY: number;
    maxScaleY: number;
    IDEQUIP: number;
  }
}
