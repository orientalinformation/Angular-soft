import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfterViewInit, AfterContentChecked, AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiService } from '../../../api/services/api.service';
import { InputService } from '../../../api/services/input.service';
import { New3dService } from '../../../api/services/new-3d.service';
import { Study, Product, ViewProduct, ViewMesh, ProductElmt, TemperatureDrawing } from '../../../api/models';
import { ElmtEditForm, TempPoint, Mesh3dInfo, PlotPoints } from '../../../api/models';
import { Point } from '../../../api/models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { TextService } from '../../../shared/text.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ValuesListService } from '../../../shared/values-list.service';
import { Symbol } from '../../../api/models/symbol';
import { ChainingComponent } from '../chaining/chaining.component';
import { TempProfileEditorComponent } from '../../../components/temp-profile-editor/temp-profile-editor.component';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { isUndefined } from 'util';
import { FloatType } from 'three';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ViewChild('editElmtInitTempModal') public editElmtInitTempModal: ModalDirective;
  @ViewChild('meshParametersModal') public meshParametersModal: ModalDirective;
  @ViewChild('initTempWaitingModal') public initTempWaitingModal: ModalDirective;
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('isoTempEditModal') isoTempEditModal: ModalDirective;
  @ViewChild('chainingControls') chainingControls: ChainingComponent;
  @ViewChild('tempProfileChart') public tempProfileChart: TempProfileEditorComponent;

  public study: Study;
  public user: Models.User;
  public productShape: number;
  public productView: ViewProduct;
  public meshView: ViewMesh;
  public laddaGeneratingMesh = false;
  public laddaInitializingTemp = false;
  public symbol: Symbol;
  public productTempForm: {
    flagIsoTemp: boolean,
    initTemp: number
  };

  public elmtEditForm: {
    isoThermal?: boolean,
    isoTemp?: number,
    elementId?: number,
    elmt?: ProductElmt,
    tempPoints?: Array<number>,
    tempPositions?: Array<number>,
    index?: number
  };

  public tempPointNewForm: ElmtEditForm;
  public tempPointOldForm: ElmtEditForm;
  public indexTemp;

  public meshParamsForm: {
    mesh_type?: number,
    size1?: number,
    size2?: number,
    size3?: number
  };

  public isLoadingView = true;
  public lines: Array<Point> = [];
  public xValues: Array<number> = [];
  public point: Point;
  public dataDrawing = {
    drawing: {
      svgXsize: 335,
      svgYsize: 720,
      x0: 30,
      y0: 30,
      xsize: 245,
      ysize: 660,
      getYTopGraduate: 200,
      getYTopLegend: 15,
      getXquarter: 20,
      getXmedium: 15,
      getXThreeQuarter: 25,
      getRightLimit: 12,
      getBottomLimit: 14,
      getYBottomGraduate: 18,
      getYBottomLegend: 24,
      getXArrow: 12,
      getYArrow: 12,
      getXArrowRight: 25,
      getXArrowLeft: 23,
      getTextArrow: 12,
      getYMediumSVG: 34,
      path: '',
    },
    lines: this.lines,
    xValues: this.xValues,
    legends: {
      getTempMin: -100,
      getTempMax: 100,
      getLegendTemperature: '',
      getQuarterTemp: '',
      getMediumTemp: '',
      getThreeQuarterTemp: '',
      getHeight: ''
    },
  };
  public drawingTemperature: TemperatureDrawing;
  public minmaxProductMeshPacking: Models.ViewMinMaxProductMeshPacking;
  public svgData: {
    size?: number,
    yValue?: Array<number>;
    xValue?: Array<number>;
  };

  public meshSize1Disable = false;
  public meshSize3Disable = false;

  public mesh3dinfo: Mesh3dInfo;
  public pointsTemp: Array<PlotPoints>;

  constructor(private api: ApiService, private router: Router, public text: TextService,
    private valuesList: ValuesListService, private inputApi: InputService, private toastr: ToastrService,
    private translate: TranslateService, private new3d: New3dService) {
    this.elmtEditForm = {
      elementId: null,
      isoThermal: true,
      isoTemp: null,
      elmt: null,
      tempPoints: [],
      tempPositions: [],
      index: 0
    };

    this.mesh3dinfo = {
      nb_points: null,
    };
  }

  updateTempPoint(event, index) {
    // console.log(index, event.target.value);
    this.dataDrawing.xValues[index] = Number(event.target.value);
    this.tempProfileChart.reScale();
  }

  onChainingControlsLoaded() {
    this.chainingControls.showInitialTemp();
  }

  generateMeshWithParameters() {
    if (!(Number(this.productShape) === Number(this.text.shapeNames.SLAB)
    || Number(this.productShape) === Number(this.text.shapeNames.SPHERE))) {
      if (!this.meshSize1Disable) {
        if (!this.meshParamsForm.size1) {
          this.toastr.error(this.translate.instant('Enter a value in  Mesh size 1 !'), 'Error');
          return;
        } else if (!this.isNumberic(this.meshParamsForm.size1)) {
          this.toastr.error(this.translate.instant('Not a valid number in  Mesh size 1 !'), 'Error');
          return;
        }
      }
    }

    if (!this.meshParamsForm.size2) {
      this.toastr.error(this.translate.instant('Enter a value in  Mesh size 2 !'), 'Error');
      return;
    } else if (!this.isNumberic(this.meshParamsForm.size2)) {
      this.toastr.error(this.translate.instant('Not a valid number in  Mesh size 2 !'), 'Error');
      return;
    }

    if ((Number(this.productShape) === Number(this.text.shapeNames.REC_STAND) ||
        Number(this.productShape) === Number(this.text.shapeNames.REC_LAY) ||
        Number(this.productShape) === Number(this.text.shapeNames.BREAD))) {
      if (!this.meshSize3Disable) {
        if (!this.meshParamsForm.size3) {
          this.toastr.error(this.translate.instant('Enter a value in  Mesh size 3 !'), 'Error');
          return;
        } else if (!this.isNumberic(this.meshParamsForm.size3)) {
          this.toastr.error(this.translate.instant('Not a valid number in  Mesh size 3 !'), 'Error');
          return;
        }
      }
    }

    this.api.generateMesh({
      idProd: this.productView.product.ID_PROD,
      body: {
        mesh_type: this.meshParamsForm.mesh_type,
        size1: this.meshParamsForm.size1,
        size2: this.meshParamsForm.size2,
        size3: this.meshParamsForm.size3
      }
    }).subscribe(
      (resp) => {
        if (resp !== 0) {
          swal('Warning', this.translate.instant('Error with the Meshbuilder mesh size is too small'
          + '. Check your input data and start calculation again!'), 'error');
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.meshParametersModal.hide();
        this.refreshView();
      }
    );
  }

  editElementTemp(element: ProductElmt, index: number) {
    this.elmtEditForm.index = index;
    this.elmtEditForm.elmt = element;
    this.elmtEditForm.elementId = element.ID_PRODUCT_ELMT;
    this.elmtEditForm.isoThermal = (Number(element.PROD_ELMT_ISO) === Number(this.valuesList.PRODELT_ISOTHERM));

    this.elmtEditForm.tempPoints = new Array<number>(this.meshView.nbMeshPointElmt[index]);
    this.elmtEditForm.tempPositions = new Array<number>(this.meshView.nbMeshPointElmt[index]);
    if (this.meshView.productElmtInitTemp[index] != null && this.meshView.productElmtInitTemp[index].length > 0) {
      if (this.elmtEditForm.isoThermal) {
        this.elmtEditForm.isoTemp = this.meshView.productElmtInitTemp[index][0];
        this.elmtEditForm.tempPoints.fill(this.meshView.productElmtInitTemp[index][0]);
        this.elmtEditForm.tempPositions.fill(this.meshView.initTempPositions[index][0]);
      } else {
        for (let i = 0; i < this.meshView.productElmtInitTemp[index].length; i++) {
          this.elmtEditForm.tempPoints[i] = this.meshView.productElmtInitTemp[index][i];
          this.elmtEditForm.tempPositions[i] = this.meshView.initTempPositions[index][i];
        }
      }
    } else {
      this.elmtEditForm.tempPoints.fill(0);
      if (this.meshView.initTempPositions[index].length > 0) {
        if (this.elmtEditForm.isoThermal) {
          this.elmtEditForm.tempPositions.fill(this.meshView.initTempPositions[index][0]);
        } else {
          for (let i = 0; i < this.meshView.initTempPositions[index].length; i++) {
            this.elmtEditForm.tempPositions[i] = this.meshView.initTempPositions[index][i];
          }
        }
      }
      this.elmtEditForm.isoTemp = null;
    }

    if (Number(element.PROD_ELMT_ISO) === Number(this.valuesList.PRODELT_UNDEFINED)) {
      this.elmtEditForm.isoThermal = true;
    }
    this.loadDataProfileChart(index);
    this.editElmtInitTempModal.show();
  }

  prodElmtIsoTempChanged() {
    // change isoTemp
    this.elmtEditForm.tempPoints.fill(this.elmtEditForm.isoTemp);
  }

  saveElementInitTemp() {
    if (this.elmtEditForm.isoThermal) {
      if (!this.elmtEditForm.isoTemp) {
        this.toastr.error(this.translate.instant('Enter a value in Initial temperature !'), 'Error');
        return;
      } else if (!this.isNumberic(this.elmtEditForm.isoTemp)) {
        this.toastr.error(this.translate.instant('Not a valid number in Initial temperature !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.elmtEditForm.isoTemp, this.minmaxProductMeshPacking.mmTemp.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmTemp.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Initial temperature') +
          ' (' + this.minmaxProductMeshPacking.mmTemp.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmTemp.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }

    this.meshView.elements[this.elmtEditForm.index].PROD_ELMT_ISO = this.elmtEditForm.isoThermal ? 1 : 2;
    if (this.meshView.elements[this.elmtEditForm.index].PROD_ELMT_ISO === 2) {
      const temp = [];
      if (this.tempPointNewForm) {
        for (let i = 0; i < this.tempPointNewForm.tempPoints.length; i++) {
          const element = this.tempPointNewForm.tempPoints[i];
          if (element.value == null) {
            element.value = 0;
          }

          if (this.drawingTemperature) {
            const maxTemp = Number(this.drawingTemperature.getTempMax);
            if (Number(maxTemp) === Number(373.2)) {
              if (Number(element.value) >= 373.2) {
                element.value = 373.2;
              }

              if (Number(element.value) <= 173.2) {
                element.value = 173.2;
              }
            } else if (Number(maxTemp) === Number(212)) {
              if (Number(element.value) >= 212) {
                element.value = 212;
              }

              if (Number(element.value) <= -148) {
                element.value = -148;
              }
            } else {
              if (Number(element.value) >= 100) {
                element.value = 100;
              }

              if (Number(element.value) <= -100) {
                element.value = -100;
              }
            }
          }
          temp.push(element.value);
        }
        this.elmtEditForm.tempPoints = temp;
      }
    }

    // some code here
    this.meshView.productElmtInitTemp[this.elmtEditForm.index] = this.elmtEditForm.tempPoints;
    this.productView.elements = this.meshView.elements;
    this.editElmtInitTempModal.hide();
  }

  changeTempPoint(event) {
    // console.log(event);
    if (event.index !== null) {
      this.tempPointNewForm.tempPoints[event.index].value = event.value;
      this.dataDrawing.xValues[event.index] = event.value;
    }
  }

  ngOnInit() {
    this.productTempForm = {
      flagIsoTemp: false,
      initTemp: 0.0
    };
    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = {
      elements: []
    };
    this.meshView = new ViewMesh();
  }

  isRendering(): boolean {
    return !this.laddaGeneratingMesh && !this.isLoadingView;
  }

  toggleTempProfileChart() {
    if (!this.elmtEditForm.isoThermal) {
      const index = this.elmtEditForm.index;

      this.elmtEditForm.tempPoints = new Array<number>(this.meshView.nbMeshPointElmt[index]);
      this.elmtEditForm.tempPositions = new Array<number>(this.meshView.nbMeshPointElmt[index]);
      if (this.meshView.productElmtInitTemp[index] != null && this.meshView.productElmtInitTemp[index].length > 0) {
        if (this.elmtEditForm.isoThermal) {
          this.elmtEditForm.isoTemp = this.meshView.productElmtInitTemp[index][0];
          this.elmtEditForm.tempPoints.fill(this.meshView.productElmtInitTemp[index][0]);
          this.elmtEditForm.tempPositions.fill(this.meshView.initTempPositions[index][0]);
        } else {
          for (let i = 0; i < this.meshView.productElmtInitTemp[index].length; i++) {
            this.elmtEditForm.tempPoints[i] = this.meshView.productElmtInitTemp[index][i];
            this.elmtEditForm.tempPositions[i] = this.meshView.initTempPositions[index][i];
          }
        }
      } else {
        this.elmtEditForm.tempPoints.fill(0);
        if (this.meshView.initTempPositions[index].length > 0) {
          if (this.elmtEditForm.isoThermal) {
            this.elmtEditForm.tempPositions.fill(this.meshView.initTempPositions[index][0]);
          } else {
            for (let i = 0; i < this.meshView.initTempPositions[index].length; i++) {
              this.elmtEditForm.tempPositions[i] = this.meshView.initTempPositions[index][i];
            }
          }
        }
        this.elmtEditForm.isoTemp = null;
      }
    }
  }

  refreshView() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
    if (Number(this.productShape) === 0 || !this.productView.elements || Number(this.productView.elements.length) === 0) {
      return;
    }
    this.isLoadingView = true;

    if (this.productShape < 10) {
      this.initTempRecordPts();
    } else {
      this.initTempRecordPts3D();
    }

    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.api.getMeshView({
          id: this.productView.product.ID_PROD,
          IDSTUDY: this.study.ID_STUDY
        }).subscribe(
          (resp: ViewMesh) => {
            this.initMeshView(resp);
          },
          (err) => {
            console.log(err);
          }
        );

        this.api.getMinMaxProductMeshPacking().subscribe(
          mm => {
            this.minmaxProductMeshPacking = mm;
          }
        );
      }
    );
  }

  getData3D() {
    // Get mesh 3d info
    if (this.productShape > 9) {
      this.new3d.getMesh3DInfo(this.productView.product.ID_PROD).subscribe(
        mesh3d => {
          this.mesh3dinfo = mesh3d;
        },
        err => {
          console.log('err');
        },
        () => {
          if (this.mesh3dinfo == null) {
            swal('Warning', this.translate.instant('Mesh size is too small'), 'error');
          }
        }
      );
    }
  }

  ngAfterContentInit() {
    this.productShape = Number(localStorage.getItem('productShape'));
    this.study = JSON.parse(localStorage.getItem('study'));
    this.productView = JSON.parse(localStorage.getItem('productView'));

    if (Number(this.productShape) === Number(this.text.shapeNames.SLAB)
      || Number(this.productShape) === Number(this.text.shapeNames.SPHERE)
      || Number(this.productShape) === Number(this.text.shapeNames.D_SPHERE)) {
        this.meshSize1Disable = true;
    }

    if (Number(this.productShape) === Number(this.text.shapeNames.SLAB)
      || Number(this.productShape) === Number(this.text.shapeNames.CYL_STAND)
      || Number(this.productShape) === Number(this.text.shapeNames.CYL_LAY)
      || Number(this.productShape) === Number(this.text.shapeNames.SPHERE)
      || Number(this.productShape) === Number(this.text.shapeNames.D_STAND_CYL)
      || Number(this.productShape) === Number(this.text.shapeNames.D_LYI_CYL)
      || Number(this.productShape) === Number(this.text.shapeNames.D_SPHERE)
      || Number(this.productShape) === Number(this.text.shapeNames.D_STAND_CON_CYL)
      || Number(this.productShape) === Number(this.text.shapeNames.D_LYN_CON_CYL)
      || Number(this.productShape) === Number(this.text.shapeNames.D_SEMI_CYL)) {
        this.meshSize3Disable = true;
    }

    if (Number(this.productShape) === 0 || !this.productView.elements || Number(this.productView.elements.length) === 0) {
      swal('Warning', this.translate.instant('Please define product along with elements first'), 'error');
      this.router.navigate(['/input/product']);
      return false;
    }
  }

  ngAfterViewInit() {
    this.refreshView();
  }

  generateMesh() {
    this.meshParametersModal.show();
  }

  editInitialMesh() {

  }

  initMeshView(resp: ViewMesh) {
    this.meshView = resp;
    if (!this.meshView.meshGeneration) {
      return this.resetDefaultMesh();
    } else {
      localStorage.setItem('meshView', JSON.stringify(this.meshView));
    }
    this.productTempForm.flagIsoTemp = (Number(this.productView.product.PROD_ISO) !== 0);
    if (this.productTempForm.flagIsoTemp) {
      this.productTempForm.initTemp = this.meshView.productIsoTemp;
    }
    this.isLoadingView = false;
    this.meshParamsForm = {};
    this.meshParamsForm.mesh_type = this.meshView.meshGeneration.MESH_1_FIXED;
    if (Number(this.meshParamsForm.mesh_type) === 1) { // regular
      this.meshParamsForm.size1 = this.meshView.meshGeneration.MESH_1_SIZE;
      this.meshParamsForm.size2 = this.meshView.meshGeneration.MESH_2_SIZE;
      this.meshParamsForm.size3 = this.meshView.meshGeneration.MESH_3_SIZE;
    } else {
      this.meshParamsForm.size1 = this.meshView.meshGeneration.MESH_1_INT;
      this.meshParamsForm.size2 = this.meshView.meshGeneration.MESH_2_INT;
      this.meshParamsForm.size3 = this.meshView.meshGeneration.MESH_3_INT;
    }
    // Get data mesh 3d
    this.getData3D();
  }

  resetDefaultMesh() {
    this.laddaGeneratingMesh = true;
    this.api.refreshMesh(this.study.ID_STUDY).subscribe(
      data => {
        this.api.generateDefaultMesh(this.productView.product.ID_PROD).subscribe(
          (resp: ViewMesh) => {
            this.refreshView();
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
      },
      err => {
        this.laddaGeneratingMesh = false;
      },
      () => {
        this.laddaGeneratingMesh = false;
      }
    );
  }

  initIsoTemperature() {
    if (isNaN(this.productTempForm.initTemp)) {
      swal('Error', this.translate.instant('Please correctly define initial product temperature!'), 'error');
      return false;
    }

    this.laddaInitializingTemp = true;
    this.initTempWaitingModal.show();
    this.api.initIsoTemperature({
      idProd: this.productView.product.ID_PROD,
      initTemp: this.meshView.productIsoTemp
    }).subscribe(
      (resp) => {
        this.laddaInitializingTemp = false;
      },
      (err) => {
        this.laddaInitializingTemp = false;
        this.initTempWaitingModal.hide();
      },
      () => {
        this.laddaInitializingTemp = false;
        this.initTempWaitingModal.hide();
      }
    );
  }
  // 3D initial temperature
  initIso3DTemperature() {
    if (isNaN(this.productTempForm.initTemp)) {
      swal('Error', this.translate.instant('Please correctly define initial product temperature!'), 'error');
      return false;
    }

    this.laddaInitializingTemp = true;
    this.initTempWaitingModal.show();
    this.new3d.initIso3DTemperature({
      idProd: this.productView.product.ID_PROD,
      initTemp: this.meshView.productIsoTemp
    }).subscribe(
      (resp) => {
        this.laddaInitializingTemp = false;
      },
      (err) => {
        this.laddaInitializingTemp = false;
        this.initTempWaitingModal.hide();
      },
      () => {
        this.laddaInitializingTemp = false;
        this.initTempWaitingModal.hide();
      }
    );
  }

  initNonIso3DTemperature() {
    // console.log('Non iso 3D initial temperature');
    this.initTempWaitingModal.show();
    this.new3d.initNonIso3DTemperature({
      idProd: this.study.ID_PROD,
      body: this.meshView
    }).subscribe(
      res => {
      },
      err => {
        this.initTempWaitingModal.hide();
        console.log(err);
      },
      () => {
        this.initTempWaitingModal.hide();
      }
    );
  }
  // End 3D initial temperature
  initNonIsoTemperature() {
    this.initTempWaitingModal.show();
    this.api.initNonIsoTemperature({
      idProd: this.study.ID_PROD,
      body: this.meshView
    }).subscribe(
      resp => {
        // console.log(resp);
      },
      err => {
        console.log(err);
        this.initTempWaitingModal.hide();
      },
      () => {
        this.initTempWaitingModal.hide();
      }
    );
  }

  editProductTemp() {
    this.isoTempEditModal.show();
  }

  initTemperature() {
    if (Number(this.productView.product.PROD_ISO) === 1) {
      if (this.productShape < 10) {
        this.initIsoTemperature();
      } else {
        this.initIso3DTemperature();
      }
    } else {
      if (this.productShape < 10) {
        this.initNonIsoTemperature();
      } else {
        this.initNonIso3DTemperature();
      }
    }
  }

  saveProductInitTemp() {
    if (this.productTempForm.flagIsoTemp) {
      if (!this.productTempForm.initTemp) {
        this.toastr.error(this.translate.instant('Enter a value in Initial temperature !'), 'Error');
        return;
      } else if (!this.isNumberic(this.productTempForm.initTemp)) {
        this.toastr.error(this.translate.instant('Not a valid number in Initial temperature !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.productTempForm.initTemp, this.minmaxProductMeshPacking.mmTemp.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmTemp.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Initial temperature') +
          ' (' + this.minmaxProductMeshPacking.mmTemp.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmTemp.LIMIT_MAX + ') !', 'Error');
          return;
      }
    }
    this.isoTempEditModal.hide();
    if (!this.productTempForm.flagIsoTemp) {
      this.productView.product.PROD_ISO = 0;
      this.productTempForm.initTemp = null;
      this.meshView.productIsoTemp = null;
      // this.initNonIsoTemperature();
    } else {
      this.meshView.productIsoTemp = this.productTempForm.initTemp;
      this.productView.product.PROD_ISO = 1;
      if (this.productShape < 10) {
        this.initIsoTemperature();
      } else {
        this.initIso3DTemperature();
      }
    }
  }

  showElementTemp(element: ProductElmt) {

  }

  // add by oriental
  initTempRecordPts() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.inputApi.initTempRecordPts(this.study.ID_STUDY).subscribe(
      response => {
        // console.log('ok');
      },
      err => {},
      () =>  {}
    );
  }

  // Initial 3D
  initTempRecordPts3D() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.new3d.initTempRecordPts3D(this.study.ID_STUDY).subscribe(
      resp => {

      },
      err => {}
    );
  }

  loadDataProfileChart(index) {
    this.inputApi.getDataSvgTemperature().subscribe(
      data => {
        this.drawingTemperature = data;
      },
      err => {
        console.log(err);
      },
      () => {
        this.loadDrawingTemperature(this.drawingTemperature, index);
      }
    );
  }

  loadDrawingTemperature(dataDrawing, index) {
    // data drawing
    const _xsize = dataDrawing.xsize;
    const X_ZONE_DE_SAISIE = dataDrawing.xsize;
    let listofPoints = null; // list x,y circle
    let xValue = [];
    let yValue = null;
    let idx = 0;
    let _path = null;
    let _height = null;

    if (this.meshView) {
      if (index != null) {
        listofPoints = this.meshView.nbMeshPointElmt[index];
        xValue = this.meshView.productElmtInitTemp[index];
        _height = this.meshView.heights[index];
        if (!isUndefined(xValue)) {
          if (xValue != null) {
            if (xValue.length === 0) {
              for (let i = 0; i < listofPoints; i++) {
                xValue.push(0);
              }
            }
          }
        }

        yValue = this.meshView.initTempPositions[index];
        localStorage.setItem('svgData', JSON.stringify({ size: listofPoints, yValue: yValue, xValue: xValue }));
      }

      this.xValues = xValue;
      // console.log(this.xValues);
      this.lines = [];
      if (listofPoints > 0) {
        for (idx = 0; idx < listofPoints; idx++) {
          this.point = new Point();
          this.point.X_POSITION = this.getAxisXPos(xValue[idx], Number(dataDrawing.getTempMax));
          this.point.Y_POINT = this.getAxisYPos(yValue[idx], 30 * listofPoints, yValue);
          this.lines.push(this.point);
          if (idx === 0) {
            _path = 'M' + this.point.X_POSITION + ',' + this.point.Y_POINT + ' L';
          } else {
            _path = _path + this.point.X_POSITION + ',' + this.point.Y_POINT + ' ';
          }
        }
      }
    }

    const _svgXsize = (30 + X_ZONE_DE_SAISIE + 60);
    const _ysize = 30 * listofPoints;
    const _svgYsize = _ysize + 60;
    const _x0 = 30;
    const _y0 = 30;
    const _getYTopGraduate = (_y0 * 2) / 3;
    const _getYTopLegend = _y0 / 2;
    const _getXquarter = _x0 + (_xsize / 4);
    const _getXmedium = _x0 + (_xsize / 2);
    const _getXThreeQuarter = _x0 + ((_xsize * 3) / 4);
    const _getRightLimit = _svgXsize - _x0 - 30;
    const _getBottomLimit = _svgYsize - _y0;
    const _getYBottomGraduate = (_y0 / 3) + _getBottomLimit;
    const _getYBottomLegend = _getBottomLimit + _getYTopGraduate;
    const _getXArrow = _getRightLimit + 10;
    const _getYArrow = _y0 + 5;
    const _getXArrowLeft = _getRightLimit + 15;
    const _getXArrowRight = _getRightLimit + 5;
    const _getYMediumSVG = _svgYsize / 2;
    const _getTextArrow = _getRightLimit + 16;
    // data legends
    const _tempMin = Number(dataDrawing.getTempMin);
    const _tempMax = Number(dataDrawing.getTempMax);
    let legendTemperature = '';
    let prodDimension = '';
    if (this.symbol) {
      legendTemperature = this.symbol.temperatureSymbol;
      prodDimension = this.symbol.prodDimensionSymbol;
    }

    this.dataDrawing = {
      drawing: {
        svgXsize: _svgXsize,
        svgYsize: _svgYsize,
        x0: _x0,
        y0: _y0,
        xsize: _xsize,
        ysize: _ysize,
        getYTopGraduate: _getYTopGraduate,
        getYTopLegend: _getYTopLegend,
        getXquarter: _getXquarter,
        getXmedium: _getXmedium,
        getXThreeQuarter: _getXThreeQuarter,
        getRightLimit: _getRightLimit,
        getBottomLimit: _getBottomLimit,
        getYBottomGraduate: _getYBottomGraduate,
        getYBottomLegend: _getYBottomLegend,
        getXArrow: _getXArrow,
        getYArrow: _getYArrow,
        getXArrowRight: _getXArrowRight,
        getXArrowLeft: _getXArrowLeft,
        getTextArrow: _getTextArrow,
        getYMediumSVG: _getYMediumSVG,
        path: _path,
      },

      lines: this.lines,
      xValues: this.xValues,
      legends: {
        getTempMin: Number(dataDrawing.getTempMin),
        getTempMax: Number(dataDrawing.getTempMax),
        getLegendTemperature: legendTemperature,
        getQuarterTemp: String((_tempMax - _tempMin) / 4.0 + _tempMin),
        getMediumTemp: String((_tempMax - _tempMin) / 2.0 + _tempMin),
        getThreeQuarterTemp: String((_tempMax - _tempMin) * 0.75 + _tempMin),
        getHeight: _height + prodDimension
      }
    };
  }

  loadDatatempPointChart(id, index) {
    this.inputApi.getDataTempoint({
      IDPROD: id,
      INDEXTEMP: index
    }).subscribe(
      data => {
        if (this.indexTemp !== index) {
          this.tempPointOldForm = null;
        }

        if (!this.tempPointOldForm) {
          this.tempPointOldForm = data;
          this.tempPointNewForm = this.tempPointOldForm;
          this.indexTemp = index;
        } else {
          this.tempPointNewForm = this.tempPointOldForm;
        }

        // new fix load tempPoint
        this.tempPointNewForm = data;
        if (this.tempPointNewForm.tempPoints.length === this.tempPointOldForm.tempPoints.length) {
          for (let i = 0; i < this.tempPointNewForm.tempPoints.length; i++) {
            this.tempPointNewForm.tempPoints[i].value = this.tempPointOldForm.tempPoints[i].value;
          }
        }
      },
      err => {
        console.log('err');
      },
      () => {
        // this.tempPointNewForm = this.tempPointOldForm;
      }
    );
  }

  isNumberic(number) {
    return Number.isInteger(Math.floor(number));
  }

  isInRangeOutput(value, min, max) {
    if (value < min || value > max) {
      return false;
    } else {
      return true;
    }
  }

  showTempProfile() {
    this.tempProfileChart.show();
  }

  getAxisXPos(lfVal: number, maxTemp) {
    if (isUndefined(lfVal)) {
      lfVal = 0;
    }

    if (Number(maxTemp) === Number(373.2)) {
      lfVal = (Number(lfVal) - 273.15);
    } else if (Number(maxTemp) === Number(212)) {
      lfVal = (Number(lfVal) - 32) / 1.8;
    }

    let pos = null;
    const width = 245;
    const marginWidth = 30;
    if (lfVal < 0) {
      pos = (((100 + Math.round(lfVal)) / 100) * (width / 2)) + marginWidth;
    } else if (lfVal >= 0) {
      pos = (((Math.round(lfVal)) / 100) * (width / 2)) + (width / 2) + marginWidth;
    }

    return pos;
  }

  getAxisYPos(lfval: number, height: number, listPositions: Array<number>) {
    let minScale = height;
    let maxScale = 0;
    for (let i = 0; i < listPositions.length; i++) {
      if (Number(listPositions[i]) < Number(minScale)) {
        minScale = Number(listPositions[i]);
      }

      if (Number(listPositions[i]) > Number(maxScale)) {
        maxScale = Number(listPositions[i]);
      }
    }
    let pos = null;
    const firstPoint = 30;
    const endPoint = firstPoint + height;
    pos = endPoint - ((lfval - minScale) / (maxScale - minScale) * height);

    return pos;
  }

  clearAll() {
    if (this.tempPointNewForm) {
      for (let i = 0; i < this.tempPointNewForm.tempPoints.length; i++) {
        if ((i === 0) || (i === this.tempPointNewForm.tempPoints.length - 1)) {
          this.tempPointNewForm.tempPoints[i].value = 0;
        } else {
          this.tempPointNewForm.tempPoints[i].value = null;
        }
      }
    }

    if (this.dataDrawing) {
      for (let i = 0; i < this.dataDrawing.xValues.length; i++) {
        this.dataDrawing.xValues[i] = 0;
        this.dataDrawing.lines[i].X_POSITION = this.getAxisXPos(0, Number(this.dataDrawing.legends.getTempMax));
      }
    }

    this.tempProfileChart.clearAll();
  }

  generatePoints() {
    this.meshView.elements[this.elmtEditForm.index].PROD_ELMT_ISO = this.elmtEditForm.isoThermal ? 1 : 2;

    if (this.meshView.elements[this.elmtEditForm.index].PROD_ELMT_ISO === 2) {
      const temp = [];
      if (this.tempPointNewForm) {
        for (let i = 0; i < this.tempPointNewForm.tempPoints.length; i++) {
          const element = this.tempPointNewForm.tempPoints[i];
          temp.push(element.value);
        }
        this.elmtEditForm.tempPoints = temp;
      }
    }
    // some code here

    this.inputApi.getPlotPoints({
      xPositions: this.elmtEditForm.tempPositions,
      tempPoints: this.tempPointNewForm.tempPoints
    }).subscribe(
      data => {
        this.pointsTemp = data;
      },
      err => {
        console.log('err');
      },
      () => {
        let _path = null;
        if (this.dataDrawing) {
          for (let i = 0; i < this.dataDrawing.xValues.length; i++) {
            this.dataDrawing.lines[i].X_POSITION = this.getAxisXPos(this.pointsTemp[i].temperature,
              Number(this.dataDrawing.legends.getTempMax));
            if (i === 0) {
              _path = 'M' + this.dataDrawing.lines[i].X_POSITION + ',' + this.dataDrawing.lines[i].Y_POINT + ' L';
            } else {
              _path = _path + this.dataDrawing.lines[i].X_POSITION + ',' + this.dataDrawing.lines[i].Y_POINT + ' ';
            }

            this.tempPointNewForm.tempPoints[i].value = this.pointsTemp[i].temperature;
          }
          this.dataDrawing.drawing.path = _path;
        }
      }
    );

    this.tempProfileChart.generatePoints();

    this.toastr.success(this.translate.instant('Generate point'), 'Successfully');
  }

  disabledField() {
    return !(Number(this.study.ID_USER) === Number(this.user.ID_USER));
  }

  disabledChaining() {
    if (this.study) {
      if (this.study.CHAINING_CONTROLS) {
        if (this.study.PARENT_ID === 0) {
          if (this.study.HAS_CHILD) {
            return true;
          } else {
            return false;
          }
        } else {
          if (this.study.HAS_CHILD) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
  }
  // end add by oriental
}
