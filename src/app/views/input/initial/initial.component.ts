import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfterViewInit, AfterContentChecked, AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiService } from '../../../api/services/api.service';
import { Study, Product, ViewProduct, ViewMesh, ProductElmt } from '../../../api/models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { TextService } from '../../../shared/text.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ValuesListService } from '../../../shared/values-list.service';

import * as Highcharts from 'highcharts';
import * as HC_draggablePoints from 'highcharts-draggable-points';
HC_draggablePoints(Highcharts);

import { HighchartsChartComponent } from '../../../components/highcharts-chart/highcharts-chart.component';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ViewChild('editElmtInitTempModal') public editElmtInitTempModal: ModalDirective;
  @ViewChild('meshParametersModal') public meshParametersModal: ModalDirective;
  @ViewChild('tempProfileChart') public tempProfileChart: HighchartsChartComponent;
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('isoTempEditModal') isoTempEditModal: ModalDirective;

  public Highcharts = Highcharts;
  public chartOptions = {
    chart: {
      // inverted: true
    },
    tooltip: {
      enabled: false
    },
    series: [{
      data: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      draggableY: true,
      dragMinY: 0
    }]
  };

  public study: Study;
  public productShape: number;
  public productView: ViewProduct;
  public meshView: ViewMesh;
  public laddaGeneratingMesh = false;
  public laddaInitializingTemp = false;
  public productTempForm: {
    flagIsoTemp: boolean,
    initTemp: number
  };

  public elmtEditForm: {
    isoThermal?: boolean,
    isoTemp?: number,
    elementId?: number,
    elmt?: ProductElmt,
  };

  public meshParamsForm: {
    mesh_type?: number,
    size1?: number,
    size2?: number,
    size3?: number
  };

  public isLoadingView = true;

  // renderer = new THREE.WebGLRenderer({ alpha: true });
  // scene = null;
  // camera = null;
  // mesh = null;
  // materials = null;
  // orbit = null;

  constructor(private api: ApiService, private router: Router, public text: TextService, private valuesList: ValuesListService) {
    this.elmtEditForm = {
      elementId: null,
      isoThermal: true,
      isoTemp: null,
      elmt: null,
    };
  }

  generateMeshWithParameters() {
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
        console.log(resp);
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

  editElementTemp(element: ProductElmt) {
    this.elmtEditForm.elmt = element;
    this.elmtEditForm.elementId = element.ID_PRODUCT_ELMT;
    this.elmtEditForm.isoThermal = element.PROD_ELMT_ISO == this.valuesList.PRODELT_ISOTHERM;
    if (element.PROD_ELMT_ISO == this.valuesList.PRODELT_UNDEFINED) {
      this.elmtEditForm.isoThermal = true;
    }
    this.editElmtInitTempModal.show();
  }

  saveElementInitTemp() {

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
      // this.tempProfileChart.options = this.chartOptions;
    }
  }

  refreshView() {
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      return;
    }
    this.isLoadingView = true;
    this.api.getMeshView(this.productView.product.ID_PROD).subscribe(
      (resp: ViewMesh) => {
        this.initMeshView(resp);
      },
      (err) => {
        console.log(err);
        // swal('Oops..', 'Error getting mesh view', 'error');
      }
    );
  }

  ngAfterContentInit() {
    this.productShape = Number(localStorage.getItem('productShape'));
    this.study = JSON.parse(localStorage.getItem('study'));
    this.productView = JSON.parse(localStorage.getItem('productView'));
    console.log('content checked');
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      swal('Oops..', 'Please define product along with elements first', 'error');
      this.router.navigate(['/input/product']);
      return false;
    }
  }

  ngAfterViewInit() {
    this.refreshView();
  }

  // animate() {
  //   window.requestAnimationFrame(() => this.animate());
  //   this.orbit.update();
  //   this.renderer.render(this.scene, this.camera);
  // }

  generateMesh() {
    this.meshParametersModal.show();
    // this.laddaGeneratingMesh = true;
    // this.api.generateMesh(this.productView.product.ID_PROD).subscribe(
    //   resp => {
    //     console.log(resp);
    //   },
    //   error2 => {
    //     console.log(error2);
    //   },
    //   () => {
    //     this.laddaGeneratingMesh = false;
    //   }
    // );
  }

  editInitialMesh() {

  }

  initMeshView(resp: ViewMesh) {
    this.meshView = resp;
    console.log(resp);
    if (!this.meshView.meshGeneration) {
      this.resetDefaultMesh();
    } else {
      localStorage.setItem('meshView', JSON.stringify(this.meshView));
    }

    this.productTempForm.flagIsoTemp = this.productView.product.PROD_ISO != 0;
    if (this.productTempForm.flagIsoTemp) {
      this.productTempForm.initTemp = this.meshView.productIsoTemp;
    }
    this.isLoadingView = false;
    this.meshParamsForm = {};
    this.meshParamsForm.mesh_type = this.meshView.meshGeneration.MESH_1_FIXED;
    if (this.meshParamsForm.mesh_type == 1) { // regular
      this.meshParamsForm.size1 = parseFloat((this.meshView.meshGeneration.MESH_1_SIZE * 1000).toFixed(2));
      this.meshParamsForm.size2 = parseFloat((this.meshView.meshGeneration.MESH_2_SIZE * 1000).toFixed(2));
      this.meshParamsForm.size3 = parseFloat((this.meshView.meshGeneration.MESH_3_SIZE * 1000).toFixed(2));
    } else {
      this.meshParamsForm.size1 = parseFloat((this.meshView.meshGeneration.MESH_1_INT * 1000).toFixed(2));
      this.meshParamsForm.size2 = parseFloat((this.meshView.meshGeneration.MESH_2_INT * 1000).toFixed(2));
      this.meshParamsForm.size3 = parseFloat((this.meshView.meshGeneration.MESH_3_INT * 1000).toFixed(2));
    }
  }

    // this.scene = new THREE.Scene();

    // this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 10000);
    // this.camera.position.z = 400;

    // // this.createRubixMaterial();

    // let geometry = null;
    // switch (this.productShape) {
    //   case this.text.shapeNames.BREAD:
    //   case this.text.shapeNames.REC_LAY:
    //   case this.text.shapeNames.REC_STAND:
    //   case this.text.shapeNames.SLAB:
    //     geometry = new THREE.BoxGeometry(200, 200, 200);
    //     break;

    //   case this.text.shapeNames.SPHERE:
    //     geometry = new THREE.SphereGeometry(200);
    //     break;

    //   case this.text.shapeNames.CON_CYL_LAY:
    //   case this.text.shapeNames.CON_CYL_STAND:
    //   case this.text.shapeNames.CYL_LAY:
    //   case this.text.shapeNames.CYL_STAND:
    //     geometry = new THREE.CylinderGeometry(150, 150, 300);
    //     break;

    //   default:
    //     return false;
    // }

    // // var meshFaceMaterial = new THREE.MeshFaceMaterial(this.materials);
    // this.materials = new THREE.MeshBasicMaterial({
    //   color: 0x333333,
    //   wireframe: true
    // });
    // this.mesh = new THREE.Mesh(geometry, this.materials);
    // const axisHelper = new THREE.AxisHelper(120);
    // this.scene.add(axisHelper);

    // this.scene.add(this.mesh);

    // this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setSize(180, 200);

    // this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    // this.orbit.enableZoom = true;
    // // this.renderer.domElement.style.display = 'block';
    // // this.renderer.domElement.style.margin = 'auto';
    // this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    // this.orbit.update();

    // this.animate();

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

  initTemperature() {
    if (isNaN(this.productTempForm.initTemp)) {
      swal('Error', 'Please correctly define initial product temperature!', 'error');
      return false;
    }

    this.laddaInitializingTemp = true;
    this.api.initTemperature({
      idProd: this.productView.product.ID_PROD,
      initTemp: this.meshView.productIsoTemp
    }).subscribe(
      (resp) => {
        this.laddaInitializingTemp = false;
      },
      (err) => {
        this.laddaInitializingTemp = false;
      },
      () => {
        this.laddaInitializingTemp = false;
      }
    );
  }

  editProductTemp() {
    this.isoTempEditModal.show();
  }

  saveProductInitTemp() {
    console.log(this.productTempForm.initTemp);
    if (this.productTempForm.flagIsoTemp && (isNaN(this.productTempForm.initTemp) || this.productTempForm.initTemp == null)) {
      swal('Error', 'Please define initial temperature for the product!', 'error');
      return false;
    }
    this.isoTempEditModal.hide();
    if (!this.productTempForm.flagIsoTemp) {
      this.productView.product.PROD_ISO = 0;
      this.productTempForm.initTemp = null;
      this.meshView.productIsoTemp = null;
    } else {
      this.meshView.productIsoTemp = this.productTempForm.initTemp;
      this.productView.product.PROD_ISO = 1;
      this.initTemperature();
    }
  }

}
