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

import { ViewLogin } from '../models/view-login';
import { Login } from '../models/login';
import { ViewUnits } from '../models/view-units';
import { Units } from '../models/units';
import { Error } from '../models/error';
import { MonetaryCurrency } from '../models/monetary-currency';
import { MeshParamDef } from '../models/mesh-param-def';
import { TempRecordPtsDef } from '../models/temp-record-pts-def';
import { CalculationParametersDef } from '../models/calculation-parameters-def';
import { CheckControlView } from '../models/check-control-view';
import { CheckControl } from '../models/check-control';
import { ViewMinMax } from '../models/view-min-max';
import { MeshParamDefSave } from '../models/mesh-param-def-save';
import { TempRecordPtsDefSave } from '../models/temp-record-pts-def-save';
import { CalculationParametersDefSave } from '../models/calculation-parameters-def-save';
import { BrainCalculator } from '../models/brain-calculator';
import { StartBrainCalculate } from '../models/start-brain-calculate';
import { UnitDataEquipment } from '../models/unit-data-equipment';
import { Study } from '../models/study';
import { ViewLineList } from '../models/view-line-list';
import { CreateModiPipeLine } from '../models/create-modi-pipe-line';
import { ViewResponseUrl } from '../models/view-response-url';
import { Report } from '../models/report';
import { ViewProcessingReport } from '../models/view-processing-report';
import { DisplayAllLangs } from '../models/display-all-langs';
import { ChangeLabel } from '../models/change-label';
import { LoadTransLang } from '../models/load-trans-lang';
import { Symbol } from '../models/symbol';
import { OptimumResultAna } from '../models/optimum-result-ana';
import { HeadBalanceResult } from '../models/head-balance-result';
import { HeadBalanceMaxResult } from '../models/head-balance-max-result';
import { EquipSizing } from '../models/equip-sizing';
import { EstimationHeadBalanceResult } from '../models/estimation-head-balance-result';
import { ViewTrCalculate } from '../models/view-tr-calculate';
import { ViewEquipTr } from '../models/view-equip-tr';
import { ConsumptionResult } from '../models/consumption-result';
import { EconomicResult } from '../models/economic-result';
import { StudyEquipment } from '../models/study-equipment';
import { ViewStudyEquipment } from '../models/view-study-equipment';
import { RecordPosition } from '../models/record-position';
import { ViewOperatingSetting } from '../models/view-operating-setting';
import { EquipSizingParam } from '../models/equip-sizing-param';
import { OperatingSettingParam } from '../models/operating-setting-param';
import { ConsPieToReportParam } from '../models/cons-pie-to-report-param';
import { TempRecordPts } from '../models/temp-record-pts';
import { ProductElmt } from '../models/product-elmt';
import { PointValue } from '../models/point-value';
import { AxisTempSelect } from '../models/axis-temp-select';
import { LocationAxisParams } from '../models/location-axis-params';
import { ViewselectionCriteriaFilter } from '../models/viewselection-criteria-filter';
import { ViewFamily } from '../models/view-family';
import { ViewMinMaxProduction } from '../models/view-min-max-production';
import { ViewMinMaxProductMeshPacking } from '../models/view-min-max-product-mesh-packing';
import { ViewMinMaxEquipment } from '../models/view-min-max-equipment';
import { Color } from '../models/color';
import { ProductCharColorParam } from '../models/product-char-color-param';
import { ViewSizingResultOptimum } from '../models/view-sizing-result-optimum';
import { SizingOptimumData } from '../models/sizing-optimum-data';
import { ViewSizingEstimationResult } from '../models/view-sizing-estimation-result';
import { ViewTemperatureProfile } from '../models/view-temperature-profile';
import { ViewHeatExchange } from '../models/view-heat-exchange';
import { ViewTimeBased } from '../models/view-time-based';
import { ViewProductSection } from '../models/view-product-section';
import { saveTempRecordPts } from '../models/save-temp-record-pts';
import { ViewProductchart2D } from '../models/view-productchart-2d';
import { productChart2DStatic } from '../models/product-chart-2dstatic';
import { inline_response_200 } from '../models/inline-_response-_200';
import { OutputComputeTrTsParam } from '../models/output-compute-tr-ts-param';
import { Translation } from '../models/translation';
import { ViewMeshPosition } from '../models/view-mesh-position';
import { ViewOpenStudy } from '../models/view-open-study';
import { GenericError } from '../models/generic-error';
import { ViewChaining } from '../models/view-chaining';
import { ProductUpdateParams } from '../models/product-update-params';
import { UpdateStdEqpLayoutParams } from '../models/update-std-eqp-layout-params';
import { Equipment } from '../models/equipment';
import { Production } from '../models/production';
import { Product } from '../models/product';
import { ViewProduct } from '../models/view-product';
import { ProdElmtInitTemp } from '../models/prod-elmt-init-temp';
import { ViewComponents } from '../models/view-components';
import { Shape } from '../models/shape';
import { PackingElement } from '../models/packing-element';
import { PackingLayer } from '../models/packing-layer';
import { ViewPackingLayer } from '../models/view-packing-layer';
import { SavePackingLayer } from '../models/save-packing-layer';
import { ViewMesh } from '../models/view-mesh';
import { GenMeshParams } from '../models/gen-mesh-params';
import { Users } from '../models/users';
import { User } from '../models/user';


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
  loginResponse(body: Login): Observable<HttpResponse<ViewLogin>> {
    let __params = this.newParams();
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
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      filter(_r => _r instanceof HttpResponse),
      map(_r => {
        let _resp = _r as HttpResponse<any>;
        let _body: ViewLogin = null;
        _body = _resp.body as ViewLogin
        return _resp.clone({body: _body}) as HttpResponse<ViewLogin>;
      })
    );
  }

  /**
   * @param body - The username/password
   */
  login(body: Login): Observable<ViewLogin> {
    return this.loginResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  logoutResponse(): Observable<HttpResponse<void>> {
    let __params = this.newParams();
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
   */
  unitsResponse(): Observable<HttpResponse<ViewUnits>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/admin/units`,
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
        let _body: ViewUnits = null;
        _body = _resp.body as ViewUnits
        return _resp.clone({body: _body}) as HttpResponse<ViewUnits>;
      })
    );
  }

  /**
   */
  units(): Observable<ViewUnits> {
    return this.unitsResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * create a new unit
   * @param unit - The monetary currency to create.
   */
  createUnitResponse(unit?: Units): Observable<HttpResponse<Units>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = unit;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/unit`,
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
        let _body: Units = null;
        _body = _resp.body as Units
        return _resp.clone({body: _body}) as HttpResponse<Units>;
      })
    );
  }

  /**
   * create a new unit
   * @param unit - The monetary currency to create.
   */
  createUnit(unit?: Units): Observable<Units> {
    return this.createUnitResponse(unit).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - undefined
   */
  saveUnitResponse(body?: Units): Observable<HttpResponse<Units>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PATCH",
      this.rootUrl + `/unit`,
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
        let _body: Units = null;
        _body = _resp.body as Units
        return _resp.clone({body: _body}) as HttpResponse<Units>;
      })
    );
  }

  /**
   * @param body - undefined
   */
  saveUnit(body?: Units): Observable<Units> {
    return this.saveUnitResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * create a new monetary currency
   * @param monetaryCurrency - The monetary currency to create.
   */
  createMonetaryCurrencyResponse(monetaryCurrency?: MonetaryCurrency): Observable<HttpResponse<MonetaryCurrency>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = monetaryCurrency;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/monetaryCurrency`,
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
        let _body: MonetaryCurrency = null;
        _body = _resp.body as MonetaryCurrency
        return _resp.clone({body: _body}) as HttpResponse<MonetaryCurrency>;
      })
    );
  }

  /**
   * create a new monetary currency
   * @param monetaryCurrency - The monetary currency to create.
   */
  createMonetaryCurrency(monetaryCurrency?: MonetaryCurrency): Observable<MonetaryCurrency> {
    return this.createMonetaryCurrencyResponse(monetaryCurrency).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - undefined
   */
  saveMonetaryCurrencyResponse(body?: MonetaryCurrency): Observable<HttpResponse<MonetaryCurrency>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "PATCH",
      this.rootUrl + `/monetaryCurrency`,
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
        let _body: MonetaryCurrency = null;
        _body = _resp.body as MonetaryCurrency
        return _resp.clone({body: _body}) as HttpResponse<MonetaryCurrency>;
      })
    );
  }

  /**
   * @param body - undefined
   */
  saveMonetaryCurrency(body?: MonetaryCurrency): Observable<MonetaryCurrency> {
    return this.saveMonetaryCurrencyResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - MonetaryCurrency ID
   */
  getMonetaryCurrencyByIdResponse(id: number): Observable<HttpResponse<MonetaryCurrency>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/monetaryCurrency/${id}`,
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
        let _body: MonetaryCurrency = null;
        _body = _resp.body as MonetaryCurrency
        return _resp.clone({body: _body}) as HttpResponse<MonetaryCurrency>;
      })
    );
  }

  /**
   * @param id - MonetaryCurrency ID
   */
  getMonetaryCurrencyById(id: number): Observable<MonetaryCurrency> {
    return this.getMonetaryCurrencyByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  getMyMeshParamDefResponse(): Observable<HttpResponse<MeshParamDef>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/meshparamdef`,
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
        let _body: MeshParamDef = null;
        _body = _resp.body as MeshParamDef
        return _resp.clone({body: _body}) as HttpResponse<MeshParamDef>;
      })
    );
  }

  /**
   */
  getMyMeshParamDef(): Observable<MeshParamDef> {
    return this.getMyMeshParamDefResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  getMyTempRecordPtsDefResponse(): Observable<HttpResponse<TempRecordPtsDef>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/temprecordptsdef`,
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
        let _body: TempRecordPtsDef = null;
        _body = _resp.body as TempRecordPtsDef
        return _resp.clone({body: _body}) as HttpResponse<TempRecordPtsDef>;
      })
    );
  }

  /**
   */
  getMyTempRecordPtsDef(): Observable<TempRecordPtsDef> {
    return this.getMyTempRecordPtsDefResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  getMyCalculationParametersDefResponse(): Observable<HttpResponse<CalculationParametersDef>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/calculationparametersdef`,
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
        let _body: CalculationParametersDef = null;
        _body = _resp.body as CalculationParametersDef
        return _resp.clone({body: _body}) as HttpResponse<CalculationParametersDef>;
      })
    );
  }

  /**
   */
  getMyCalculationParametersDef(): Observable<CalculationParametersDef> {
    return this.getMyCalculationParametersDefResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get array checkcontrol
   * @param idStudy - undefined
   * @param idProd - undefined
   */
  checkControlViewResponse(params: ApiService.CheckControlViewParams): Observable<HttpResponse<CheckControlView>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.idProd != null) __params = __params.set("idProd", params.idProd.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/checkcontrolview`,
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
        let _body: CheckControlView = null;
        _body = _resp.body as CheckControlView
        return _resp.clone({body: _body}) as HttpResponse<CheckControlView>;
      })
    );
  }

  /**
   * get array checkcontrol
   * @param idStudy - undefined
   * @param idProd - undefined
   */
  checkControlView(params: ApiService.CheckControlViewParams): Observable<CheckControlView> {
    return this.checkControlViewResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get checkcontrol
   * @param idStudy - undefined
   * @param idProd - undefined
   */
  checkControlResponse(params: ApiService.CheckControlParams): Observable<HttpResponse<CheckControl>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.idProd != null) __params = __params.set("idProd", params.idProd.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/checkcontrol`,
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
        let _body: CheckControl = null;
        _body = _resp.body as CheckControl
        return _resp.clone({body: _body}) as HttpResponse<CheckControl>;
      })
    );
  }

  /**
   * get checkcontrol
   * @param idStudy - undefined
   * @param idProd - undefined
   */
  checkControl(params: ApiService.CheckControlParams): Observable<CheckControl> {
    return this.checkControlResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save MeshParamDef
   * @param body - body save meshParamDef
   */
  saveMyMeshParamDefResponse(body: MeshParamDefSave): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/savemeshparamdef`,
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
   * save MeshParamDef
   * @param body - body save meshParamDef
   */
  saveMyMeshParamDef(body: MeshParamDefSave): Observable<ViewMinMax> {
    return this.saveMyMeshParamDefResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save TempRecordPtsDef by id
   * @param body - body save TempRecordPtsDef
   */
  saveMyTempRecordPtsDefResponse(body: TempRecordPtsDefSave): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/savetemprecordptsdef`,
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
   * save TempRecordPtsDef by id
   * @param body - body save TempRecordPtsDef
   */
  saveMyTempRecordPtsDef(body: TempRecordPtsDefSave): Observable<ViewMinMax> {
    return this.saveMyTempRecordPtsDefResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save CalculationParametersDef by id
   * @param body - body save CalculationParametersDef
   */
  saveMyCalculationParametersDefResponse(body: CalculationParametersDefSave): Observable<HttpResponse<ViewMinMax>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/savecalculationparametersdef`,
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
   * save CalculationParametersDef by id
   * @param body - body save CalculationParametersDef
   */
  saveMyCalculationParametersDef(body: CalculationParametersDefSave): Observable<ViewMinMax> {
    return this.saveMyCalculationParametersDefResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Study ID
   */
  startStudyCalculationResponse(id: number): Observable<HttpResponse<number[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/calculate`,
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
   * @param id - Study ID
   */
  startStudyCalculation(id: number): Observable<number[]> {
    return this.startStudyCalculationResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param type - undefined
   * @param idStudyEquipment - undefined
   * @param idStudy - undefined
   * @param checkOptim - undefined
   */
  getStudyEquipmentCalculationResponse(params: ApiService.GetStudyEquipmentCalculationParams): Observable<HttpResponse<BrainCalculator>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set("type", params.type.toString());
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.checkOptim != null) __params = __params.set("checkOptim", params.checkOptim.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyequipment/braincalculate`,
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
        let _body: BrainCalculator = null;
        _body = _resp.body as BrainCalculator
        return _resp.clone({body: _body}) as HttpResponse<BrainCalculator>;
      })
    );
  }

  /**
   * @param type - undefined
   * @param idStudyEquipment - undefined
   * @param idStudy - undefined
   * @param checkOptim - undefined
   */
  getStudyEquipmentCalculation(params: ApiService.GetStudyEquipmentCalculationParams): Observable<BrainCalculator> {
    return this.getStudyEquipmentCalculationResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Run Kernal Brain Calculate
   * @param body - body save startBrainCalculate
   */
  startBrainCalculateResponse(body: StartBrainCalculate): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyequipment/startbraincalculate`,
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
   * Run Kernal Brain Calculate
   * @param body - body save startBrainCalculate
   */
  startBrainCalculate(body: StartBrainCalculate): Observable<number> {
    return this.startBrainCalculateResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get Price, interval Width Lenght
   * @param id - undefined
   */
  getUnitDataResponse(id: number): Observable<HttpResponse<UnitDataEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/equipment/unitData`,
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
        let _body: UnitDataEquipment = null;
        _body = _resp.body as UnitDataEquipment
        return _resp.clone({body: _body}) as HttpResponse<UnitDataEquipment>;
      })
    );
  }

  /**
   * Get Price, interval Width Lenght
   * @param id - undefined
   */
  getUnitData(id: number): Observable<UnitDataEquipment> {
    return this.getUnitDataResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Update price Studies
   * @param price - undefined
   * @param id - undefined
   */
  updatePriceResponse(params: ApiService.UpdatePriceParams): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.price != null) __params = __params.set("price", params.price.toString());
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studies/${params.id}/equipment/price`,
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
   * Update price Studies
   * @param price - undefined
   * @param id - undefined
   */
  updatePrice(params: ApiService.UpdatePriceParams): Observable<number> {
    return this.updatePriceResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Update Interval Lenght Width Studies
   * @param width - undefined
   * @param lenght - undefined
   * @param id - undefined
   */
  updateIntervalResponse(params: ApiService.UpdateIntervalParams): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.width != null) __params = __params.set("width", params.width.toString());
    if (params.lenght != null) __params = __params.set("lenght", params.lenght.toString());
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studies/${params.id}/equipment/interval`,
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
   * Update Interval Lenght Width Studies
   * @param width - undefined
   * @param lenght - undefined
   * @param id - undefined
   */
  updateInterval(params: ApiService.UpdateIntervalParams): Observable<number> {
    return this.updateIntervalResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param name - Study name
   * @param id - Study id
   */
  saveStudyAsResponse(params: ApiService.SaveStudyAsParams): Observable<HttpResponse<Study>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.name != null) __params = __params.set("name", params.name.toString());
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/clone`,
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
   * @param name - Study name
   * @param id - Study id
   */
  saveStudyAs(params: ApiService.SaveStudyAsParams): Observable<Study> {
    return this.saveStudyAsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  loadPipelineResponse(id: number): Observable<HttpResponse<ViewLineList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/lines/${id}/getListLine`,
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
        let _body: ViewLineList = null;
        _body = _resp.body as ViewLineList
        return _resp.clone({body: _body}) as HttpResponse<ViewLineList>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  loadPipeline(id: number): Observable<ViewLineList> {
    return this.loadPipelineResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - create a new pipe line!!
   */
  savePipelinesResponse(body: CreateModiPipeLine): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/lines/saveLines`,
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
   * @param body - create a new pipe line!!
   */
  savePipelines(body: CreateModiPipeLine): Observable<void> {
    return this.savePipelinesResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param reportParam - undefined
   * @param id - undefined
   */
  downLoadPDFResponse(params: ApiService.DownLoadPDFParams): Observable<HttpResponse<ViewResponseUrl>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.reportParam;
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/reports/${params.id}/downLoadPDF`,
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
        let _body: ViewResponseUrl = null;
        _body = _resp.body as ViewResponseUrl
        return _resp.clone({body: _body}) as HttpResponse<ViewResponseUrl>;
      })
    );
  }

  /**
   * @param reportParam - undefined
   * @param id - undefined
   */
  downLoadPDF(params: ApiService.DownLoadPDFParams): Observable<ViewResponseUrl> {
    return this.downLoadPDFResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param reportParam - undefined
   * @param id - undefined
   */
  downLoadHtmlToPDFResponse(params: ApiService.DownLoadHtmlToPDFParams): Observable<HttpResponse<ViewResponseUrl>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.reportParam;
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/reports/${params.id}/downLoadHtmlToPDF`,
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
        let _body: ViewResponseUrl = null;
        _body = _resp.body as ViewResponseUrl
        return _resp.clone({body: _body}) as HttpResponse<ViewResponseUrl>;
      })
    );
  }

  /**
   * @param reportParam - undefined
   * @param id - undefined
   */
  downLoadHtmlToPDF(params: ApiService.DownLoadHtmlToPDFParams): Observable<ViewResponseUrl> {
    return this.downLoadHtmlToPDFResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  processingReportResponse(id: number): Observable<HttpResponse<ViewProcessingReport>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/reports/${id}/processingReport`,
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
        let _body: ViewProcessingReport = null;
        _body = _resp.body as ViewProcessingReport
        return _resp.clone({body: _body}) as HttpResponse<ViewProcessingReport>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  processingReport(id: number): Observable<ViewProcessingReport> {
    return this.processingReportResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   */
  getDefaultLanguageResponse(): Observable<HttpResponse<DisplayAllLangs>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translations/getDefaultLanguage`,
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
        let _body: DisplayAllLangs = null;
        _body = _resp.body as DisplayAllLangs
        return _resp.clone({body: _body}) as HttpResponse<DisplayAllLangs>;
      })
    );
  }

  /**
   */
  getDefaultLanguage(): Observable<DisplayAllLangs> {
    return this.getDefaultLanguageResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - change label of compponent!!
   */
  changeLabelsResponse(body: ChangeLabel[]): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/translations/update`,
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
   * @param body - change label of compponent!!
   */
  changeLabels(body: ChangeLabel[]): Observable<void> {
    return this.changeLabelsResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param idtrans - undefined
   * @param id - undefined
   */
  filterTransResponse(params: ApiService.FilterTransParams): Observable<HttpResponse<LoadTransLang>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idtrans != null) __params = __params.set("idtrans", params.idtrans.toString());
    if (params.id != null) __params = __params.set("id", params.id.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translations/filterTrans`,
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
        let _body: LoadTransLang = null;
        _body = _resp.body as LoadTransLang
        return _resp.clone({body: _body}) as HttpResponse<LoadTransLang>;
      })
    );
  }

  /**
   * @param idtrans - undefined
   * @param id - undefined
   */
  filterTrans(params: ApiService.FilterTransParams): Observable<LoadTransLang> {
    return this.filterTransResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get symbol study
   * @param idStudy - Study ID
   */
  getSymbolResponse(idStudy: number): Observable<HttpResponse<Symbol>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/symbol/${idStudy}`,
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
        let _body: Symbol = null;
        _body = _resp.body as Symbol
        return _resp.clone({body: _body}) as HttpResponse<Symbol>;
      })
    );
  }

  /**
   * get symbol study
   * @param idStudy - Study ID
   */
  getSymbol(idStudy: number): Observable<Symbol> {
    return this.getSymbolResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get pro info study
   * @param idStudy - Study ID
   */
  getProInfoStudyResponse(idStudy: number): Observable<HttpResponse<OptimumResultAna>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/proInfoStudy/${idStudy}`,
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
        let _body: OptimumResultAna = null;
        _body = _resp.body as OptimumResultAna
        return _resp.clone({body: _body}) as HttpResponse<OptimumResultAna>;
      })
    );
  }

  /**
   * get pro info study
   * @param idStudy - Study ID
   */
  getProInfoStudy(idStudy: number): Observable<OptimumResultAna> {
    return this.getProInfoStudyResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get optimum head balance
   * @param idStudy - Study ID
   */
  getOptimumHeadBalanceResponse(idStudy: number): Observable<HttpResponse<HeadBalanceResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/optimum/headBalance/${idStudy}`,
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
        let _body: HeadBalanceResult = null;
        _body = _resp.body as HeadBalanceResult
        return _resp.clone({body: _body}) as HttpResponse<HeadBalanceResult>;
      })
    );
  }

  /**
   * get optimum head balance
   * @param idStudy - Study ID
   */
  getOptimumHeadBalance(idStudy: number): Observable<HeadBalanceResult> {
    return this.getOptimumHeadBalanceResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get optimum head balance max
   * @param idStudy - get optimum head balance max results
   */
  getOptimumHeadBalanceMaxResponse(idStudy: number): Observable<HttpResponse<HeadBalanceMaxResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/optimum/headBalanceMax/${idStudy}`,
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
        let _body: HeadBalanceMaxResult = null;
        _body = _resp.body as HeadBalanceMaxResult
        return _resp.clone({body: _body}) as HttpResponse<HeadBalanceMaxResult>;
      })
    );
  }

  /**
   * get optimum head balance max
   * @param idStudy - get optimum head balance max results
   */
  getOptimumHeadBalanceMax(idStudy: number): Observable<HeadBalanceMaxResult> {
    return this.getOptimumHeadBalanceMaxResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get equip sizing
   * @param idStudyEquipment - StudyEquipment ID
   */
  getEquipSizingResponse(idStudyEquipment: number): Observable<HttpResponse<EquipSizing>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/optimum/equipSizing/${idStudyEquipment}`,
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
        let _body: EquipSizing = null;
        _body = _resp.body as EquipSizing
        return _resp.clone({body: _body}) as HttpResponse<EquipSizing>;
      })
    );
  }

  /**
   * get equip sizing
   * @param idStudyEquipment - StudyEquipment ID
   */
  getEquipSizing(idStudyEquipment: number): Observable<EquipSizing> {
    return this.getEquipSizingResponse(idStudyEquipment).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get estimation head balance
   * @param idStudy - Study ID
   * @param tr - Control temperature
   */
  getEstimationHeadBalanceResponse(params: ApiService.GetEstimationHeadBalanceParams): Observable<HttpResponse<EstimationHeadBalanceResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.tr != null) __params = __params.set("tr", params.tr.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/estimation/headBalance`,
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
        let _body: EstimationHeadBalanceResult = null;
        _body = _resp.body as EstimationHeadBalanceResult
        return _resp.clone({body: _body}) as HttpResponse<EstimationHeadBalanceResult>;
      })
    );
  }

  /**
   * get estimation head balance
   * @param idStudy - Study ID
   * @param tr - Control temperature
   */
  getEstimationHeadBalance(params: ApiService.GetEstimationHeadBalanceParams): Observable<EstimationHeadBalanceResult> {
    return this.getEstimationHeadBalanceResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get temperature calculation data
   * @param idStudyEquipment - StudyEquipment ID
   */
  temperatureCalculationResponse(idStudyEquipment: number): Observable<HttpResponse<ViewTrCalculate>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/estimation/trCalculate/${idStudyEquipment}`,
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
        let _body: ViewTrCalculate = null;
        _body = _resp.body as ViewTrCalculate
        return _resp.clone({body: _body}) as HttpResponse<ViewTrCalculate>;
      })
    );
  }

  /**
   * get temperature calculation data
   * @param idStudyEquipment - StudyEquipment ID
   */
  temperatureCalculation(idStudyEquipment: number): Observable<ViewTrCalculate> {
    return this.temperatureCalculationResponse(idStudyEquipment).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * view Equipment Temperature
   * @param idStudyEquipment - StudyEquipment ID
   */
  viewEquipTrResponse(idStudyEquipment: number): Observable<HttpResponse<ViewEquipTr>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/estimation/viewEquipTr/${idStudyEquipment}`,
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
        let _body: ViewEquipTr = null;
        _body = _resp.body as ViewEquipTr
        return _resp.clone({body: _body}) as HttpResponse<ViewEquipTr>;
      })
    );
  }

  /**
   * view Equipment Temperature
   * @param idStudyEquipment - StudyEquipment ID
   */
  viewEquipTr(idStudyEquipment: number): Observable<ViewEquipTr> {
    return this.viewEquipTrResponse(idStudyEquipment).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get consumption results
   * @param idStudy - Study ID
   */
  getAnalyticalConsumptionResponse(idStudy: number): Observable<HttpResponse<ConsumptionResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/common/consumption/${idStudy}`,
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
        let _body: ConsumptionResult = null;
        _body = _resp.body as ConsumptionResult
        return _resp.clone({body: _body}) as HttpResponse<ConsumptionResult>;
      })
    );
  }

  /**
   * get consumption results
   * @param idStudy - Study ID
   */
  getAnalyticalConsumption(idStudy: number): Observable<ConsumptionResult> {
    return this.getAnalyticalConsumptionResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get economic results
   * @param idStudy - Study ID
   */
  getAnalyticalEconomicResponse(idStudy: number): Observable<HttpResponse<EconomicResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/common/economic/${idStudy}`,
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
        let _body: EconomicResult = null;
        _body = _resp.body as EconomicResult
        return _resp.clone({body: _body}) as HttpResponse<EconomicResult>;
      })
    );
  }

  /**
   * get economic results
   * @param idStudy - Study ID
   */
  getAnalyticalEconomic(idStudy: number): Observable<EconomicResult> {
    return this.getAnalyticalEconomicResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get study equipment product chart
   * @param id - Study ID
   */
  getstudyEquipmentProductChartResponse(id: number): Observable<HttpResponse<StudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}/productChart`,
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
        let _body: StudyEquipment = null;
        _body = _resp.body as StudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<StudyEquipment>;
      })
    );
  }

  /**
   * get study equipment product chart
   * @param id - Study ID
   */
  getstudyEquipmentProductChart(id: number): Observable<StudyEquipment> {
    return this.getstudyEquipmentProductChartResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get All Study Equipment in Study
   * @param id - Study ID
   */
  getstudyEquipmentByStudyIdResponse(id: number): Observable<HttpResponse<ViewStudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}/study`,
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
        let _body: ViewStudyEquipment = null;
        _body = _resp.body as ViewStudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewStudyEquipment>;
      })
    );
  }

  /**
   * get All Study Equipment in Study
   * @param id - Study ID
   */
  getstudyEquipmentByStudyId(id: number): Observable<ViewStudyEquipment> {
    return this.getstudyEquipmentByStudyIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get study equipment record position
   * @param id - StudyEquipment ID
   */
  getRecordPositionResponse(id: number): Observable<HttpResponse<RecordPosition>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}/recordPosition`,
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
        let _body: RecordPosition = null;
        _body = _resp.body as RecordPosition
        return _resp.clone({body: _body}) as HttpResponse<RecordPosition>;
      })
    );
  }

  /**
   * get study equipment record position
   * @param id - StudyEquipment ID
   */
  getRecordPosition(id: number): Observable<RecordPosition> {
    return this.getRecordPositionResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get Operating Settings
   * @param id - StudyEquipment ID
   */
  getOperatingSettingResponse(id: number): Observable<HttpResponse<ViewOperatingSetting>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}/operatingSetting`,
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
        let _body: ViewOperatingSetting = null;
        _body = _resp.body as ViewOperatingSetting
        return _resp.clone({body: _body}) as HttpResponse<ViewOperatingSetting>;
      })
    );
  }

  /**
   * get Operating Settings
   * @param id - StudyEquipment ID
   */
  getOperatingSetting(id: number): Observable<ViewOperatingSetting> {
    return this.getOperatingSettingResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  saveEquipSizingResponse(params: ApiService.SaveEquipSizingParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyEquipment/${params.id}/saveEquipSizing`,
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
   * @param id - undefined
   * @param body - undefined
   */
  saveEquipSizing(params: ApiService.SaveEquipSizingParams): Observable<void> {
    return this.saveEquipSizingResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  saveEquipmentDataResponse(params: ApiService.SaveEquipmentDataParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyEquipment/${params.id}/saveEquipmentData`,
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
   * @param id - undefined
   * @param body - undefined
   */
  saveEquipmentData(params: ApiService.SaveEquipmentDataParams): Observable<void> {
    return this.saveEquipmentDataResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  computeTrTsConfigResponse(params: ApiService.ComputeTrTsConfigParams): Observable<HttpResponse<ViewStudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyEquipment/${params.id}/computeTrTsConfig`,
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
        let _body: ViewStudyEquipment = null;
        _body = _resp.body as ViewStudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewStudyEquipment>;
      })
    );
  }

  /**
   * @param id - undefined
   * @param body - undefined
   */
  computeTrTsConfig(params: ApiService.ComputeTrTsConfigParams): Observable<ViewStudyEquipment> {
    return this.computeTrTsConfigResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  addConsPieToReportResponse(params: ApiService.AddConsPieToReportParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyEquipment/${params.id}/addConsPieToReport`,
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
   * @param id - undefined
   * @param body - undefined
   */
  addConsPieToReport(params: ApiService.AddConsPieToReportParams): Observable<void> {
    return this.addConsPieToReportResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getTempRecordPtsResponse(id: number): Observable<HttpResponse<TempRecordPts>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/tempRecordPts`,
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
        let _body: TempRecordPts = null;
        _body = _resp.body as TempRecordPts
        return _resp.clone({body: _body}) as HttpResponse<TempRecordPts>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  getTempRecordPts(id: number): Observable<TempRecordPts> {
    return this.getTempRecordPtsResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getProductElmtResponse(id: number): Observable<HttpResponse<ProductElmt>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/productElmt`,
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
        let _body: ProductElmt = null;
        _body = _resp.body as ProductElmt
        return _resp.clone({body: _body}) as HttpResponse<ProductElmt>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  getProductElmt(id: number): Observable<ProductElmt> {
    return this.getProductElmtResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getMeshPointsResponse(id: number): Observable<HttpResponse<PointValue[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/meshPoints`,
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
        let _body: PointValue[] = null;
        _body = _resp.body as PointValue[]
        return _resp.clone({body: _body}) as HttpResponse<PointValue[]>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  getMeshPoints(id: number): Observable<PointValue[]> {
    return this.getMeshPointsResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getlocationAxisSelectedResponse(id: number): Observable<HttpResponse<AxisTempSelect>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/locationAxisSelected`,
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
        let _body: AxisTempSelect = null;
        _body = _resp.body as AxisTempSelect
        return _resp.clone({body: _body}) as HttpResponse<AxisTempSelect>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  getlocationAxisSelected(id: number): Observable<AxisTempSelect> {
    return this.getlocationAxisSelectedResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  saveLocationAxisResponse(params: ApiService.SaveLocationAxisParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studies/${params.id}/saveLocationAxis`,
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
   * @param id - undefined
   * @param body - undefined
   */
  saveLocationAxis(params: ApiService.SaveLocationAxisParams): Observable<void> {
    return this.saveLocationAxisResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  reCalculateResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/equipments/${id}/reCalculate`,
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
   * @param id - undefined
   */
  reCalculate(id: number): Observable<void> {
    return this.reCalculateResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param sery - undefined
   * @param process - undefined
   * @param origin - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param energy - undefined
   */
  getSelectionCriteriaFilterResponse(params: ApiService.GetSelectionCriteriaFilterParams): Observable<HttpResponse<ViewselectionCriteriaFilter>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sery != null) __params = __params.set("sery", params.sery.toString());
    if (params.process != null) __params = __params.set("process", params.process.toString());
    if (params.origin != null) __params = __params.set("origin", params.origin.toString());
    if (params.model != null) __params = __params.set("model", params.model.toString());
    if (params.manufacturer != null) __params = __params.set("manufacturer", params.manufacturer.toString());
    if (params.energy != null) __params = __params.set("energy", params.energy.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/equipments/selection/selectionCriteriaFilter`,
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
        let _body: ViewselectionCriteriaFilter = null;
        _body = _resp.body as ViewselectionCriteriaFilter
        return _resp.clone({body: _body}) as HttpResponse<ViewselectionCriteriaFilter>;
      })
    );
  }

  /**
   * @param sery - undefined
   * @param process - undefined
   * @param origin - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param energy - undefined
   */
  getSelectionCriteriaFilter(params: ApiService.GetSelectionCriteriaFilterParams): Observable<ViewselectionCriteriaFilter> {
    return this.getSelectionCriteriaFilterResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get all compamily
   */
  getAllCompFamilyResponse(): Observable<HttpResponse<ViewFamily>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/components/allCompFamily`,
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
        let _body: ViewFamily = null;
        _body = _resp.body as ViewFamily
        return _resp.clone({body: _body}) as HttpResponse<ViewFamily>;
      })
    );
  }

  /**
   * get all compamily
   */
  getAllCompFamily(): Observable<ViewFamily> {
    return this.getAllCompFamilyResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get subfamily filter
   * @param compfamily - compfamily
   */
  getSubfamilyResponse(compfamily: number): Observable<HttpResponse<ViewFamily>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/products/subfamily/${compfamily}`,
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
        let _body: ViewFamily = null;
        _body = _resp.body as ViewFamily
        return _resp.clone({body: _body}) as HttpResponse<ViewFamily>;
      })
    );
  }

  /**
   * get subfamily filter
   * @param compfamily - compfamily
   */
  getSubfamily(compfamily: number): Observable<ViewFamily> {
    return this.getSubfamilyResponse(compfamily).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get min max production
   */
  getMinMaxProductionResponse(): Observable<HttpResponse<ViewMinMaxProduction>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/minMaxs/production`,
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
        let _body: ViewMinMaxProduction = null;
        _body = _resp.body as ViewMinMaxProduction
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMaxProduction>;
      })
    );
  }

  /**
   * get min max production
   */
  getMinMaxProduction(): Observable<ViewMinMaxProduction> {
    return this.getMinMaxProductionResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get min max product mesh packing
   */
  getMinMaxProductMeshPackingResponse(): Observable<HttpResponse<ViewMinMaxProductMeshPacking>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/minMaxs/productMeshPacking`,
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
        let _body: ViewMinMaxProductMeshPacking = null;
        _body = _resp.body as ViewMinMaxProductMeshPacking
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMaxProductMeshPacking>;
      })
    );
  }

  /**
   * get min max product mesh packing
   */
  getMinMaxProductMeshPacking(): Observable<ViewMinMaxProductMeshPacking> {
    return this.getMinMaxProductMeshPackingResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get min max equipment
   * @param id - study ID
   */
  getMinMaxEquipmentResponse(id: number): Observable<HttpResponse<ViewMinMaxEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/minMaxs/${id}/equipment`,
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
        let _body: ViewMinMaxEquipment = null;
        _body = _resp.body as ViewMinMaxEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewMinMaxEquipment>;
      })
    );
  }

  /**
   * get min max equipment
   * @param id - study ID
   */
  getMinMaxEquipment(id: number): Observable<ViewMinMaxEquipment> {
    return this.getMinMaxEquipmentResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get color palletes
   */
  findColorPalettesResponse(): Observable<HttpResponse<Color[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/colorPalettes`,
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
        let _body: Color[] = null;
        _body = _resp.body as Color[]
        return _resp.clone({body: _body}) as HttpResponse<Color[]>;
      })
    );
  }

  /**
   * get color palletes
   */
  findColorPalettes(): Observable<Color[]> {
    return this.findColorPalettesResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * update product chart color
   * @param id - Product ID
   * @param body - body
   */
  updateProductCharColorResponse(params: ApiService.UpdateProductCharColorParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${params.id}/productCharColor`,
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
   * update product chart color
   * @param id - Product ID
   * @param body - body
   */
  updateProductCharColor(params: ApiService.UpdateProductCharColorParams): Observable<void> {
    return this.updateProductCharColorResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get sizing result optimum
   * @param idStudy - Study ID
   */
  sizingOptimumResultResponse(idStudy: number): Observable<HttpResponse<ViewSizingResultOptimum>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/sizingresult/${idStudy}/optimum`,
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
        let _body: ViewSizingResultOptimum = null;
        _body = _resp.body as ViewSizingResultOptimum
        return _resp.clone({body: _body}) as HttpResponse<ViewSizingResultOptimum>;
      })
    );
  }

  /**
   * get sizing result optimum
   * @param idStudy - Study ID
   */
  sizingOptimumResult(idStudy: number): Observable<ViewSizingResultOptimum> {
    return this.sizingOptimumResultResponse(idStudy).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * draw singzing optimum chart
   * @param idStudy - Study ID
   * @param body - body
   */
  sizingOptimumDrawResponse(params: ApiService.SizingOptimumDrawParams): Observable<HttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/sizingresult/${params.idStudy}/optimum`,
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
        let _body: string = null;
        _body = _resp.body as string
        return _resp.clone({body: _body}) as HttpResponse<string>;
      })
    );
  }

  /**
   * draw singzing optimum chart
   * @param idStudy - Study ID
   * @param body - body
   */
  sizingOptimumDraw(params: ApiService.SizingOptimumDrawParams): Observable<string> {
    return this.sizingOptimumDrawResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * sizing result estimation
   * @param idStudy - Study ID
   * @param tr - Control temperature
   */
  sizingEstimationResultResponse(params: ApiService.SizingEstimationResultParams): Observable<HttpResponse<ViewSizingEstimationResult>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.tr != null) __params = __params.set("tr", params.tr.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/sizingresult/estimation`,
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
        let _body: ViewSizingEstimationResult = null;
        _body = _resp.body as ViewSizingEstimationResult
        return _resp.clone({body: _body}) as HttpResponse<ViewSizingEstimationResult>;
      })
    );
  }

  /**
   * sizing result estimation
   * @param idStudy - Study ID
   * @param tr - Control temperature
   */
  sizingEstimationResult(params: ApiService.SizingEstimationResultParams): Observable<ViewSizingEstimationResult> {
    return this.sizingEstimationResultResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get temperature profile
   * @param idStudyEquipment - StudyEquipment ID
   */
  temperatureProfileResponse(idStudyEquipment: number): Observable<HttpResponse<ViewTemperatureProfile>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/temperatureProfile/${idStudyEquipment}`,
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
        let _body: ViewTemperatureProfile = null;
        _body = _resp.body as ViewTemperatureProfile
        return _resp.clone({body: _body}) as HttpResponse<ViewTemperatureProfile>;
      })
    );
  }

  /**
   * get temperature profile
   * @param idStudyEquipment - StudyEquipment ID
   */
  temperatureProfile(idStudyEquipment: number): Observable<ViewTemperatureProfile> {
    return this.temperatureProfileResponse(idStudyEquipment).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get heat exchange product chart
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  heatExchangeResponse(params: ApiService.HeatExchangeParams): Observable<HttpResponse<ViewHeatExchange>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/heatExchange`,
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
        let _body: ViewHeatExchange = null;
        _body = _resp.body as ViewHeatExchange
        return _resp.clone({body: _body}) as HttpResponse<ViewHeatExchange>;
      })
    );
  }

  /**
   * get heat exchange product chart
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  heatExchange(params: ApiService.HeatExchangeParams): Observable<ViewHeatExchange> {
    return this.heatExchangeResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get based product chart
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  timeBasedResponse(params: ApiService.TimeBasedParams): Observable<HttpResponse<ViewTimeBased>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/timeBased`,
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
        let _body: ViewTimeBased = null;
        _body = _resp.body as ViewTimeBased
        return _resp.clone({body: _body}) as HttpResponse<ViewTimeBased>;
      })
    );
  }

  /**
   * get based product chart
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  timeBased(params: ApiService.TimeBasedParams): Observable<ViewTimeBased> {
    return this.timeBasedResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get product section product chart
   * @param selectedAxe - Axe select
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  productSectionResponse(params: ApiService.ProductSectionParams): Observable<HttpResponse<ViewProductSection>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.selectedAxe != null) __params = __params.set("selectedAxe", params.selectedAxe.toString());
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/productSection`,
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
        let _body: ViewProductSection = null;
        _body = _resp.body as ViewProductSection
        return _resp.clone({body: _body}) as HttpResponse<ViewProductSection>;
      })
    );
  }

  /**
   * get product section product chart
   * @param selectedAxe - Axe select
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   */
  productSection(params: ApiService.ProductSectionParams): Observable<ViewProductSection> {
    return this.productSectionResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param body - body
   */
  saveTempRecordPtsResponse(body: saveTempRecordPts): Observable<HttpResponse<ViewProductSection>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/saveTempRecordPts`,
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
        let _body: ViewProductSection = null;
        _body = _resp.body as ViewProductSection
        return _resp.clone({body: _body}) as HttpResponse<ViewProductSection>;
      })
    );
  }

  /**
   * @param body - body
   */
  saveTempRecordPts(body: saveTempRecordPts): Observable<ViewProductSection> {
    return this.saveTempRecordPtsResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get product chart 2d chart
   * @param selectedPlan - Plan select
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   * @param dimension - dimension language name
   */
  productchart2DResponse(params: ApiService.Productchart2DParams): Observable<HttpResponse<ViewProductchart2D>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.selectedPlan != null) __params = __params.set("selectedPlan", params.selectedPlan.toString());
    if (params.idStudyEquipment != null) __params = __params.set("idStudyEquipment", params.idStudyEquipment.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
    if (params.dimension != null) __params = __params.set("dimension", params.dimension.toString());
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/productchart2D`,
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
        let _body: ViewProductchart2D = null;
        _body = _resp.body as ViewProductchart2D
        return _resp.clone({body: _body}) as HttpResponse<ViewProductchart2D>;
      })
    );
  }

  /**
   * get product chart 2d chart
   * @param selectedPlan - Plan select
   * @param idStudyEquipment - StudyEquipment ID
   * @param idStudy - Study ID
   * @param dimension - dimension language name
   */
  productchart2D(params: ApiService.Productchart2DParams): Observable<ViewProductchart2D> {
    return this.productchart2DResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get product chart 2d static chart
   * @param body - body
   */
  productChart2DStaticResponse(body: productChart2DStatic): Observable<HttpResponse<ViewProductchart2D>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/productChart2DStatic`,
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
        let _body: ViewProductchart2D = null;
        _body = _resp.body as ViewProductchart2D
        return _resp.clone({body: _body}) as HttpResponse<ViewProductchart2D>;
      })
    );
  }

  /**
   * get product chart 2d static chart
   * @param body - body
   */
  productChart2DStatic(body: productChart2DStatic): Observable<ViewProductchart2D> {
    return this.productChart2DStaticResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get all product chart 2d
   * @param body - body
   */
  productchart2DAnimResponse(body: productChart2DStatic): Observable<HttpResponse<ViewProductchart2D>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/productchart2DAnim`,
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
        let _body: ViewProductchart2D = null;
        _body = _resp.body as ViewProductchart2D
        return _resp.clone({body: _body}) as HttpResponse<ViewProductchart2D>;
      })
    );
  }

  /**
   * get all product chart 2d
   * @param body - body
   */
  productchart2DAnim(body: productChart2DStatic): Observable<ViewProductchart2D> {
    return this.productchart2DAnimResponse(body).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get value contour data
   * @param idStudyEquipment - StudyEquipment ID
   */
  readDataContourResponse(idStudyEquipment: number): Observable<HttpResponse<inline_response_200>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/output/readDataContour/${idStudyEquipment}`,
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
        let _body: inline_response_200 = null;
        _body = _resp.body as inline_response_200
        return _resp.clone({body: _body}) as HttpResponse<inline_response_200>;
      })
    );
  }

  /**
   * get value contour data
   * @param idStudyEquipment - StudyEquipment ID
   */
  readDataContour(idStudyEquipment: number): Observable<inline_response_200> {
    return this.readDataContourResponse(idStudyEquipment).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param idStudyEquipment - undefined
   * @param body - undefined
   */
  computeTrTsResponse(params: ApiService.ComputeTrTsParams): Observable<HttpResponse<ViewStudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/${params.idStudyEquipment}/computeTrTs`,
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
        let _body: ViewStudyEquipment = null;
        _body = _resp.body as ViewStudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewStudyEquipment>;
      })
    );
  }

  /**
   * @param idStudyEquipment - undefined
   * @param body - undefined
   */
  computeTrTs(params: ApiService.ComputeTrTsParams): Observable<ViewStudyEquipment> {
    return this.computeTrTsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param idStudyEquipment - undefined
   * @param body - undefined
   */
  runSequenceCalculationResponse(params: ApiService.RunSequenceCalculationParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/output/${params.idStudyEquipment}/runSequenceCalculation`,
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
   * @param idStudyEquipment - undefined
   * @param body - undefined
   */
  runSequenceCalculation(params: ApiService.RunSequenceCalculationParams): Observable<void> {
    return this.runSequenceCalculationResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list line type
   */
  getListLineTypeResponse(): Observable<HttpResponse<Translation>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translation/linetype`,
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
        let _body: Translation = null;
        _body = _resp.body as Translation
        return _resp.clone({body: _body}) as HttpResponse<Translation>;
      })
    );
  }

  /**
   * Get list line type
   */
  getListLineType(): Observable<Translation> {
    return this.getListLineTypeResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get list energies (list cooling family)
   */
  getListEnergiesResponse(): Observable<HttpResponse<Translation>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translation/energies`,
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
        let _body: Translation = null;
        _body = _resp.body as Translation
        return _resp.clone({body: _body}) as HttpResponse<Translation>;
      })
    );
  }

  /**
   * Get list energies (list cooling family)
   */
  getListEnergies(): Observable<Translation> {
    return this.getListEnergiesResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get data report for studies
   * @param id - undefined
   */
  getReportResponse(id: number): Observable<HttpResponse<Report>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/report`,
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
        let _body: Report = null;
        _body = _resp.body as Report
        return _resp.clone({body: _body}) as HttpResponse<Report>;
      })
    );
  }

  /**
   * Get data report for studies
   * @param id - undefined
   */
  getReport(id: number): Observable<Report> {
    return this.getReportResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save report
   * @param id - undefined
   * @param body - body save report
   */
  saveReportResponse(params: ApiService.SaveReportParams): Observable<HttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/report`,
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
   * save report
   * @param id - undefined
   * @param body - body save report
   */
  saveReport(params: ApiService.SaveReportParams): Observable<number> {
    return this.saveReportResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get data Mesh_Axis_Pos
   * @param id - undefined
   */
  getMeshAxisPosResponse(id: number): Observable<HttpResponse<ViewMeshPosition>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/meshaxispos`,
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
        let _body: ViewMeshPosition = null;
        _body = _resp.body as ViewMeshPosition
        return _resp.clone({body: _body}) as HttpResponse<ViewMeshPosition>;
      })
    );
  }

  /**
   * Get data Mesh_Axis_Pos
   * @param id - undefined
   */
  getMeshAxisPos(id: number): Observable<ViewMeshPosition> {
    return this.getMeshAxisPosResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param lang - undefined
   */
  getComponentTranslationsResponse(lang: string): Observable<HttpResponse<Translation[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translations/${lang}/components`,
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
  getComponentTranslations(lang: string): Observable<Translation[]> {
    return this.getComponentTranslationsResponse(lang).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param lang - undefined
   */
  getPackingTranslationsResponse(lang: string): Observable<HttpResponse<Translation[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/translations/${lang}/packings`,
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
  getPackingTranslations(lang: string): Observable<Translation[]> {
    return this.getPackingTranslationsResponse(lang).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * Get a list of studies
   * @param subfamily - undefined
   * @param idUser - undefined
   * @param component - undefined
   * @param compfamily - undefined
   */
  findStudiesResponse(params: ApiService.FindStudiesParams): Observable<HttpResponse<ViewOpenStudy>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.subfamily != null) __params = __params.set("subfamily", params.subfamily.toString());
    if (params.idUser != null) __params = __params.set("idUser", params.idUser.toString());
    if (params.component != null) __params = __params.set("component", params.component.toString());
    if (params.compfamily != null) __params = __params.set("compfamily", params.compfamily.toString());
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
        let _body: ViewOpenStudy = null;
        _body = _resp.body as ViewOpenStudy
        return _resp.clone({body: _body}) as HttpResponse<ViewOpenStudy>;
      })
    );
  }

  /**
   * Get a list of studies
   * @param subfamily - undefined
   * @param idUser - undefined
   * @param component - undefined
   * @param compfamily - undefined
   */
  findStudies(params: ApiService.FindStudiesParams): Observable<ViewOpenStudy> {
    return this.findStudiesResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * create a new study
   * @param study - The study to create.
   */
  createStudyResponse(study?: Study): Observable<HttpResponse<Study>> {
    let __params = this.newParams();
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
   * create a new study
   * @param study - The study to create.
   */
  createStudy(study?: Study): Observable<Study> {
    return this.createStudyResponse(study).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Study ID
   */
  getContour2dChartResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/contour2d`,
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
  getContour2dChart(id: number): Observable<void> {
    return this.getContour2dChartResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - Study ID
   */
  getStudyByIdResponse(id: number): Observable<HttpResponse<Study>> {
    let __params = this.newParams();
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
    let __params = this.newParams();
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
   * @param id - Study ID
   * @param body - undefined
   */
  saveStudyResponse(params: ApiService.SaveStudyParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "PATCH",
      this.rootUrl + `/studies/${params.id}`,
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
   * @param body - undefined
   */
  saveStudy(params: ApiService.SaveStudyParams): Observable<void> {
    return this.saveStudyResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - id study to open
   */
  openStudyResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
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
   * @param id - id study to open
   */
  getChainingModelResponse(id: number): Observable<HttpResponse<ViewChaining>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/chaining`,
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
        let _body: ViewChaining = null;
        _body = _resp.body as ViewChaining
        return _resp.clone({body: _body}) as HttpResponse<ViewChaining>;
      })
    );
  }

  /**
   * @param id - id study to open
   */
  getChainingModel(id: number): Observable<ViewChaining> {
    return this.getChainingModelResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param studyName - study child name
   * @param stdEqpId - parent study equipment id
   * @param id - id parent study to chaining
   */
  createChildStudyResponse(params: ApiService.CreateChildStudyParams): Observable<HttpResponse<Study>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.studyName != null) __params = __params.set("studyName", params.studyName.toString());
    if (params.stdEqpId != null) __params = __params.set("stdEqpId", params.stdEqpId.toString());
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/chaining`,
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
   * @param studyName - study child name
   * @param stdEqpId - parent study equipment id
   * @param id - id parent study to chaining
   */
  createChildStudy(params: ApiService.CreateChildStudyParams): Observable<Study> {
    return this.createChildStudyResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param updateParams - undefined
   * @param id - study ID
   */
  updateProductResponse(params: ApiService.UpdateProductParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.updateParams;
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studies/${params.id}/product`,
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
   * @param updateParams - undefined
   * @param id - study ID
   */
  updateProduct(params: ApiService.UpdateProductParams): Observable<void> {
    return this.updateProductResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param name - product name
   * @param id - study ID
   */
  newProductResponse(params: ApiService.NewProductParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.name != null) __params = __params.set("name", params.name.toString());
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/product`,
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
   * @param name - product name
   * @param id - study ID
   */
  newProduct(params: ApiService.NewProductParams): Observable<void> {
    return this.newProductResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - refresh mesh of study
   */
  refreshMeshResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
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
   * get study equipment layout image by id
   * @param id - StudyEquipment ID
   */
  getStudyEquipmentLayoutResponse(id: number): Observable<HttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}/layout`,
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
        let _body: string = null;
        _body = _resp.body as string
        return _resp.clone({body: _body}) as HttpResponse<string>;
      })
    );
  }

  /**
   * get study equipment layout image by id
   * @param id - StudyEquipment ID
   */
  getStudyEquipmentLayout(id: number): Observable<string> {
    return this.getStudyEquipmentLayoutResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param body - undefined
   */
  updateStudyEquipmentLayoutResponse(params: ApiService.UpdateStudyEquipmentLayoutParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studyEquipment/${params.id}/layout`,
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
   * @param id - undefined
   * @param body - undefined
   */
  updateStudyEquipmentLayout(params: ApiService.UpdateStudyEquipmentLayoutParams): Observable<void> {
    return this.updateStudyEquipmentLayoutResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getStudyEquipmentsResponse(id: number): Observable<HttpResponse<ViewStudyEquipment[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/equipments`,
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
        let _body: ViewStudyEquipment[] = null;
        _body = _resp.body as ViewStudyEquipment[]
        return _resp.clone({body: _body}) as HttpResponse<ViewStudyEquipment[]>;
      })
    );
  }

  /**
   * @param id - undefined
   */
  getStudyEquipments(id: number): Observable<ViewStudyEquipment[]> {
    return this.getStudyEquipmentsResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param idEquip - undefined
   * @param id - undefined
   */
  addEquipmentResponse(params: ApiService.AddEquipmentParams): Observable<HttpResponse<StudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.idEquip != null) __params = __params.set("idEquip", params.idEquip.toString());
    
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/studies/${params.id}/equipments`,
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
        let _body: StudyEquipment = null;
        _body = _resp.body as StudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<StudyEquipment>;
      })
    );
  }

  /**
   * @param idEquip - undefined
   * @param id - undefined
   */
  addEquipment(params: ApiService.AddEquipmentParams): Observable<StudyEquipment> {
    return this.addEquipmentResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param idEquip - undefined
   * @param id - undefined
   */
  removeStudyEquipmentResponse(params: ApiService.RemoveStudyEquipmentParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/studies/${params.id}/equipments/${params.idEquip}`,
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
   * @param idEquip - undefined
   * @param id - undefined
   */
  removeStudyEquipment(params: ApiService.RemoveStudyEquipmentParams): Observable<void> {
    return this.removeStudyEquipmentResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   */
  getStudyCommentResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/comment`,
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
   * @param id - undefined
   */
  getStudyComment(id: number): Observable<void> {
    return this.getStudyCommentResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * @param id - undefined
   * @param comment - undefined
   */
  postStudyCommentResponse(params: ApiService.PostStudyCommentParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.comment;
    let req = new HttpRequest<any>(
      "PATCH",
      this.rootUrl + `/studies/${params.id}/comment`,
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
   * @param id - undefined
   * @param comment - undefined
   */
  postStudyComment(params: ApiService.PostStudyCommentParams): Observable<void> {
    return this.postStudyCommentResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get all available equipments
   * @param size - undefined
   * @param sery - undefined
   * @param process - undefined
   * @param origin - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param idStudy - undefined
   * @param energy - undefined
   */
  getEquipmentsResponse(params: ApiService.GetEquipmentsParams): Observable<HttpResponse<Equipment[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.size != null) __params = __params.set("size", params.size.toString());
    if (params.sery != null) __params = __params.set("sery", params.sery.toString());
    if (params.process != null) __params = __params.set("process", params.process.toString());
    if (params.origin != null) __params = __params.set("origin", params.origin.toString());
    if (params.model != null) __params = __params.set("model", params.model.toString());
    if (params.manufacturer != null) __params = __params.set("manufacturer", params.manufacturer.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
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
   * @param sery - undefined
   * @param process - undefined
   * @param origin - undefined
   * @param model - undefined
   * @param manufacturer - undefined
   * @param idStudy - undefined
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
    let __params = this.newParams();
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
   * get study equipment by id
   * @param id - StudyEquipment ID
   */
  getStudyEquipmentByIdResponse(id: number): Observable<HttpResponse<ViewStudyEquipment>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studyEquipment/${id}`,
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
        let _body: ViewStudyEquipment = null;
        _body = _resp.body as ViewStudyEquipment
        return _resp.clone({body: _body}) as HttpResponse<ViewStudyEquipment>;
      })
    );
  }

  /**
   * get study equipment by id
   * @param id - StudyEquipment ID
   */
  getStudyEquipmentById(id: number): Observable<ViewStudyEquipment> {
    return this.getStudyEquipmentByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get production by id
   * @param id - Production ID
   */
  getProductionByIdResponse(id: number): Observable<HttpResponse<Production>> {
    let __params = this.newParams();
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
   * @param id - Production ID
   * @param body - todo
   */
  saveProductionResponse(params: ApiService.SaveProductionParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "PATCH",
      this.rootUrl + `/productions/${params.id}`,
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
   * @param id - Production ID
   * @param body - todo
   */
  saveProduction(params: ApiService.SaveProductionParams): Observable<void> {
    return this.saveProductionResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get product by id
   * @param id - Product ID
   */
  getProductByIdResponse(id: number): Observable<HttpResponse<Product>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/products/${id}`,
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
        let _body: Product = null;
        _body = _resp.body as Product
        return _resp.clone({body: _body}) as HttpResponse<Product>;
      })
    );
  }

  /**
   * get product by id
   * @param id - Product ID
   */
  getProductById(id: number): Observable<Product> {
    return this.getProductByIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get product view model
   * @param id - Product ID
   */
  getProductViewModelResponse(id: number): Observable<HttpResponse<ViewProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/products/${id}/view`,
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
        let _body: ViewProduct = null;
        _body = _resp.body as ViewProduct
        return _resp.clone({body: _body}) as HttpResponse<ViewProduct>;
      })
    );
  }

  /**
   * get product view model
   * @param id - Product ID
   */
  getProductViewModel(id: number): Observable<ViewProduct> {
    return this.getProductViewModelResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get elements of a products
   * @param id - Product ID
   */
  getElementsByProductIdResponse(id: number): Observable<HttpResponse<ProductElmt[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/products/${id}/elements`,
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
        let _body: ProductElmt[] = null;
        _body = _resp.body as ProductElmt[]
        return _resp.clone({body: _body}) as HttpResponse<ProductElmt[]>;
      })
    );
  }

  /**
   * get elements of a products
   * @param id - Product ID
   */
  getElementsByProductId(id: number): Observable<ProductElmt[]> {
    return this.getElementsByProductIdResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * update elements to product
   * @param id - Product ID
   * @param elementId - undefined
   * @param realmass - undefined
   * @param dim5 - undefined
   * @param dim4 - undefined
   * @param dim2 - undefined
   * @param description - undefined
   * @param computedmass - undefined
   */
  updateProductElementResponse(params: ApiService.UpdateProductElementParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    if (params.elementId != null) __params = __params.set("elementId", params.elementId.toString());
    if (params.realmass != null) __params = __params.set("realmass", params.realmass.toString());
    if (params.dim5 != null) __params = __params.set("dim5", params.dim5.toString());
    if (params.dim4 != null) __params = __params.set("dim4", params.dim4.toString());
    if (params.dim2 != null) __params = __params.set("dim2", params.dim2.toString());
    if (params.description != null) __params = __params.set("description", params.description.toString());
    if (params.computedmass != null) __params = __params.set("computedmass", params.computedmass.toString());
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${params.id}/elements`,
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
   * update elements to product
   * @param id - Product ID
   * @param elementId - undefined
   * @param realmass - undefined
   * @param dim5 - undefined
   * @param dim4 - undefined
   * @param dim2 - undefined
   * @param description - undefined
   * @param computedmass - undefined
   */
  updateProductElement(params: ApiService.UpdateProductElementParams): Observable<void> {
    return this.updateProductElementResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * append elements to product
   * @param shapeId - undefined
   * @param id - Product ID
   * @param componentId - undefined
   * @param dim3 - undefined
   * @param dim1 - undefined
   */
  appendElementsToProductResponse(params: ApiService.AppendElementsToProductParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.shapeId != null) __params = __params.set("shapeId", params.shapeId.toString());
    
    if (params.componentId != null) __params = __params.set("componentId", params.componentId.toString());
    if (params.dim3 != null) __params = __params.set("dim3", params.dim3.toString());
    if (params.dim1 != null) __params = __params.set("dim1", params.dim1.toString());
    let req = new HttpRequest<any>(
      "PUT",
      this.rootUrl + `/products/${params.id}/elements`,
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
   * append elements to product
   * @param shapeId - undefined
   * @param id - Product ID
   * @param componentId - undefined
   * @param dim3 - undefined
   * @param dim1 - undefined
   */
  appendElementsToProduct(params: ApiService.AppendElementsToProductParams): Observable<void> {
    return this.appendElementsToProductResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * remove a product element
   * @param id - Product ID
   * @param elementId - undefined
   */
  removeProductElementResponse(params: ApiService.RemoveProductElementParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    if (params.elementId != null) __params = __params.set("elementId", params.elementId.toString());
    let req = new HttpRequest<any>(
      "DELETE",
      this.rootUrl + `/products/${params.id}/elements`,
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
   * remove a product element
   * @param id - Product ID
   * @param elementId - undefined
   */
  removeProductElement(params: ApiService.RemoveProductElementParams): Observable<void> {
    return this.removeProductElementResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * move a product element up
   * @param id - element ID
   */
  productElementMoveUpResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/productElmts/${id}/moveup`,
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
   * move a product element up
   * @param id - element ID
   */
  productElementMoveUp(id: number): Observable<void> {
    return this.productElementMoveUpResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * move a product element down
   * @param id - element ID
   */
  productElementMoveDownResponse(id: number): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/productElmts/${id}/movedown`,
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
   * move a product element down
   * @param id - element ID
   */
  productElementMoveDown(id: number): Observable<void> {
    return this.productElementMoveDownResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * init product element temperature
   * @param id - product element id
   * @param body - undefined
   */
  initProdElmtTempResponse(params: ApiService.InitProdElmtTempParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/productElmts/${params.id}/initTemp`,
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
   * init product element temperature
   * @param id - product element id
   * @param body - undefined
   */
  initProdElmtTemp(params: ApiService.InitProdElmtTempParams): Observable<void> {
    return this.initProdElmtTempResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * find available components by filter
   * @param waterpercent - undefined
   * @param subfamily - undefined
   * @param idStudy - undefined
   * @param compfamily - undefined
   */
  findComponentsResponse(params: ApiService.FindComponentsParams): Observable<HttpResponse<ViewComponents>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.waterpercent != null) __params = __params.set("waterpercent", params.waterpercent.toString());
    if (params.subfamily != null) __params = __params.set("subfamily", params.subfamily.toString());
    if (params.idStudy != null) __params = __params.set("idStudy", params.idStudy.toString());
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
        let _body: ViewComponents = null;
        _body = _resp.body as ViewComponents
        return _resp.clone({body: _body}) as HttpResponse<ViewComponents>;
      })
    );
  }

  /**
   * find available components by filter
   * @param waterpercent - undefined
   * @param subfamily - undefined
   * @param idStudy - undefined
   * @param compfamily - undefined
   */
  findComponents(params: ApiService.FindComponentsParams): Observable<ViewComponents> {
    return this.findComponentsResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get available shapes
   * @param calMode - undefined
   */
  getShapesResponse(calMode?: number): Observable<HttpResponse<Shape[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (calMode != null) __params = __params.set("calMode", calMode.toString());
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
   * @param calMode - undefined
   */
  getShapes(calMode?: number): Observable<Shape[]> {
    return this.getShapesResponse(calMode).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get available packing elements
   */
  findPackingElementsResponse(): Observable<HttpResponse<PackingElement[]>> {
    let __params = this.newParams();
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
  }
  /**
   * get packing layers
   */
  findPackingLayersResponse(): Observable<HttpResponse<PackingLayer[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/packingLayers`,
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
        let _body: PackingLayer[] = null;
        _body = _resp.body as PackingLayer[]
        return _resp.clone({body: _body}) as HttpResponse<PackingLayer[]>;
      })
    );
  }

  /**
   * get packing layers
   */
  findPackingLayers(): Observable<PackingLayer[]> {
    return this.findPackingLayersResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get StudyPackingLayers
   * @param id - study id
   */
  getStudyPackingLayersResponse(id: number): Observable<HttpResponse<ViewPackingLayer>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/studies/${id}/packingLayers`,
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
        let _body: ViewPackingLayer = null;
        _body = _resp.body as ViewPackingLayer
        return _resp.clone({body: _body}) as HttpResponse<ViewPackingLayer>;
      })
    );
  }

  /**
   * get StudyPackingLayers
   * @param id - study id
   */
  getStudyPackingLayers(id: number): Observable<ViewPackingLayer> {
    return this.getStudyPackingLayersResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * save packing
   * @param id - study id
   * @param body - body
   */
  savePackingResponse(params: ApiService.SavePackingParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/studies/${params.id}/packingLayers`,
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
   * save packing
   * @param id - study id
   * @param body - body
   */
  savePacking(params: ApiService.SavePackingParams): Observable<void> {
    return this.savePackingResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get mesh view of product
   * @param id - id of product
   */
  getMeshViewResponse(id: number): Observable<HttpResponse<ViewMesh>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/products/${id}/meshView`,
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
        let _body: ViewMesh = null;
        _body = _resp.body as ViewMesh
        return _resp.clone({body: _body}) as HttpResponse<ViewMesh>;
      })
    );
  }

  /**
   * get mesh view of product
   * @param id - id of product
   */
  getMeshView(id: number): Observable<ViewMesh> {
    return this.getMeshViewResponse(id).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * initialize non isothermal temperature
   * @param idProd - undefined
   * @param body - undefined
   */
  initNonIsoTemperatureResponse(params: ApiService.InitNonIsoTemperatureParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${params.idProd}/initNonIsoTemperature`,
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
   * initialize non isothermal temperature
   * @param idProd - undefined
   * @param body - undefined
   */
  initNonIsoTemperature(params: ApiService.InitNonIsoTemperatureParams): Observable<void> {
    return this.initNonIsoTemperatureResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * generate product mesh
   * @param idProd - undefined
   * @param body - undefined
   */
  generateMeshResponse(params: ApiService.GenerateMeshParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    __body = params.body;
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${params.idProd}/generateMesh`,
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
   * generate product mesh
   * @param idProd - undefined
   * @param body - undefined
   */
  generateMesh(params: ApiService.GenerateMeshParams): Observable<void> {
    return this.generateMeshResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * generate product default mesh
   * @param idProd - undefined
   */
  generateDefaultMeshResponse(idProd: number): Observable<HttpResponse<ViewMesh>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${idProd}/defaultMesh`,
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
        let _body: ViewMesh = null;
        _body = _resp.body as ViewMesh
        return _resp.clone({body: _body}) as HttpResponse<ViewMesh>;
      })
    );
  }

  /**
   * generate product default mesh
   * @param idProd - undefined
   */
  generateDefaultMesh(idProd: number): Observable<ViewMesh> {
    return this.generateDefaultMeshResponse(idProd).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * initialize temperature
   * @param initTemp - undefined
   * @param idProd - undefined
   */
  initIsoTemperatureResponse(params: ApiService.InitIsoTemperatureParams): Observable<HttpResponse<void>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.initTemp != null) __params = __params.set("initTemp", params.initTemp.toString());
    
    let req = new HttpRequest<any>(
      "POST",
      this.rootUrl + `/products/${params.idProd}/initIsoTemperature`,
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
   * initialize temperature
   * @param initTemp - undefined
   * @param idProd - undefined
   */
  initIsoTemperature(params: ApiService.InitIsoTemperatureParams): Observable<void> {
    return this.initIsoTemperatureResponse(params).pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get my recent studies
   */
  recentStudiesResponse(): Observable<HttpResponse<Study[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/recentStudies`,
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
   * get my recent studies
   */
  recentStudies(): Observable<Study[]> {
    return this.recentStudiesResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get default user colors
   */
  getColorDefsResponse(): Observable<HttpResponse<Color[]>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/users/colors`,
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
        let _body: Color[] = null;
        _body = _resp.body as Color[]
        return _resp.clone({body: _body}) as HttpResponse<Color[]>;
      })
    );
  }

  /**
   * get default user colors
   */
  getColorDefs(): Observable<Color[]> {
    return this.getColorDefsResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * todo
   */
  getActiveUsersResponse(): Observable<HttpResponse<Users>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/users`,
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
        let _body: Users = null;
        _body = _resp.body as Users
        return _resp.clone({body: _body}) as HttpResponse<Users>;
      })
    );
  }

  /**
   * todo
   */
  getActiveUsers(): Observable<Users> {
    return this.getActiveUsersResponse().pipe(
      map(_r => _r.body)
    );
  }
  /**
   * get user by id
   * @param id - undefined
   */
  getUserResponse(id: number): Observable<HttpResponse<User>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      "GET",
      this.rootUrl + `/users/${id}`,
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
        let _body: User = null;
        _body = _resp.body as User
        return _resp.clone({body: _body}) as HttpResponse<User>;
      })
    );
  }

  /**
   * get user by id
   * @param id - undefined
   */
  getUser(id: number): Observable<User> {
    return this.getUserResponse(id).pipe(
      map(_r => _r.body)
    );
  }}

export module ApiService {
  export interface CheckControlViewParams {
    idStudy?: number;
    idProd?: number;
  }
  export interface CheckControlParams {
    idStudy?: number;
    idProd?: number;
  }
  export interface GetStudyEquipmentCalculationParams {
    type: number;
    idStudyEquipment: number;
    idStudy: number;
    checkOptim: boolean;
  }
  export interface UpdatePriceParams {
    price: number;
    id: number;
  }
  export interface UpdateIntervalParams {
    width: number;
    lenght: number;
    id: number;
  }
  export interface SaveStudyAsParams {
    name: string;
    id: number;
  }
  export interface DownLoadPDFParams {
    reportParam: Report;
    id: number;
  }
  export interface DownLoadHtmlToPDFParams {
    reportParam: Report;
    id: number;
  }
  export interface FilterTransParams {
    idtrans: number;
    id: number;
  }
  export interface GetEstimationHeadBalanceParams {
    idStudy: number;
    tr?: number;
  }
  export interface SaveEquipSizingParams {
    id: number;
    body: EquipSizingParam;
  }
  export interface SaveEquipmentDataParams {
    id: number;
    body: OperatingSettingParam;
  }
  export interface ComputeTrTsConfigParams {
    id: number;
    body: OperatingSettingParam;
  }
  export interface AddConsPieToReportParams {
    id: number;
    body: ConsPieToReportParam;
  }
  export interface SaveLocationAxisParams {
    id: number;
    body: LocationAxisParams;
  }
  export interface GetSelectionCriteriaFilterParams {
    sery?: number;
    process?: number;
    origin?: number;
    model?: number;
    manufacturer?: string;
    energy?: number;
  }
  export interface UpdateProductCharColorParams {
    id: number;
    body: ProductCharColorParam;
  }
  export interface SizingOptimumDrawParams {
    idStudy: number;
    body: SizingOptimumData[];
  }
  export interface SizingEstimationResultParams {
    idStudy: number;
    tr?: number;
  }
  export interface HeatExchangeParams {
    idStudyEquipment: number;
    idStudy: number;
  }
  export interface TimeBasedParams {
    idStudyEquipment: number;
    idStudy: number;
  }
  export interface ProductSectionParams {
    selectedAxe: number;
    idStudyEquipment: number;
    idStudy: number;
  }
  export interface Productchart2DParams {
    selectedPlan: number;
    idStudyEquipment: number;
    idStudy: number;
    dimension: string;
  }
  export interface ComputeTrTsParams {
    idStudyEquipment: number;
    body: OutputComputeTrTsParam;
  }
  export interface RunSequenceCalculationParams {
    idStudyEquipment: number;
    body: OutputComputeTrTsParam;
  }
  export interface SaveReportParams {
    id: number;
    body: Report;
  }
  export interface FindStudiesParams {
    subfamily?: number;
    idUser?: number;
    component?: number;
    compfamily?: number;
  }
  export interface SaveStudyParams {
    id: number;
    body?: Study;
  }
  export interface CreateChildStudyParams {
    studyName: string;
    stdEqpId: number;
    id: number;
  }
  export interface UpdateProductParams {
    updateParams: ProductUpdateParams;
    id: number;
  }
  export interface NewProductParams {
    name: string;
    id: number;
  }
  export interface UpdateStudyEquipmentLayoutParams {
    id: number;
    body: UpdateStdEqpLayoutParams;
  }
  export interface AddEquipmentParams {
    idEquip: number;
    id: number;
  }
  export interface RemoveStudyEquipmentParams {
    idEquip: number;
    id: number;
  }
  export interface PostStudyCommentParams {
    id: number;
    comment?: string;
  }
  export interface GetEquipmentsParams {
    size?: string;
    sery?: number;
    process?: number;
    origin?: number;
    model?: number;
    manufacturer?: string;
    idStudy?: number;
    energy?: number;
  }
  export interface SaveProductionParams {
    id: number;
    body?: Production;
  }
  export interface UpdateProductElementParams {
    id: number;
    elementId: number;
    realmass?: number;
    dim5?: number;
    dim4?: number;
    dim2?: number;
    description?: string;
    computedmass?: number;
  }
  export interface AppendElementsToProductParams {
    shapeId: number;
    id: number;
    componentId: number;
    dim3?: number;
    dim1?: number;
  }
  export interface RemoveProductElementParams {
    id: number;
    elementId: number;
  }
  export interface InitProdElmtTempParams {
    id: number;
    body: ProdElmtInitTemp;
  }
  export interface FindComponentsParams {
    waterpercent?: number;
    subfamily?: number;
    idStudy?: number;
    compfamily?: number;
  }
  export interface SavePackingParams {
    id: number;
    body: SavePackingLayer;
  }
  export interface InitNonIsoTemperatureParams {
    idProd: number;
    body: ViewMesh;
  }
  export interface GenerateMeshParams {
    idProd: number;
    body: GenMeshParams;
  }
  export interface InitIsoTemperatureParams {
    initTemp: number;
    idProd: number;
  }
}
