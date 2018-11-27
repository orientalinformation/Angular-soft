import { Component, OnInit, AfterContentChecked, ViewChild } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { Study } from '../../../api/models/study';
import { PackingLayer } from '../../../api/models/packing-layer';
import { ViewPackingLayer } from '../../../api/models/view-packing-layer';
import { AfterViewInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { PackingElement } from '../../../api/models/packing-element';
import { Router } from '@angular/router';
import { ViewProduct } from '../../../api/models/view-product';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../../../shared/text.service';
import { Symbol } from '../../../api/models/symbol';
import { ChainingComponent } from '../chaining/chaining.component';
import { AuthenticationService } from '../../../authentication/authentication.service';
import * as Models from '../../../api/models';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit, AfterContentChecked, AfterViewInit {

  public topNrLayer: number;
  public sideNrLayer: number;
  public bottomNrLayer: number;

  public packingName: string;
  public packingData: PackingLayer;

  public topLayers: PackingLayer[] = [];
  public sideLayers: PackingLayer[] = [];
  public bottomLayers: PackingLayer[] = [];

  public defaultThickness = parseFloat((10 * 1).toFixed()).toFixed(2);
  public productShape = 0;
  public imgSrc = '';
  public study: Study;

  public packingElements: PackingElement[];
  public packingView: ViewPackingLayer;
  public productView: ViewProduct;

  public laddaSavingPacking = false;
  public isLoading = true;
  public symbol: Symbol;
  public minmaxProductMeshPacking: Models.ViewMinMaxProductMeshPacking;
  public disabledFieldForm = false;

  @ViewChild('chainingControls') chainingControls: ChainingComponent;

  constructor(private api: ApiService, private router: Router, private translate: TranslateService,
    private toastr: ToastrService, public text: TextService, private auth: AuthenticationService) {
    this.topNrLayer = 0;
    this.sideNrLayer = 0;
    this.bottomNrLayer = 0;
    this.packingData = {
      ID_PACKING_ELMT: 0,
      THICKNESS: '',
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    localStorage.setItem('productWarning', 'Y');
    localStorage.setItem('productDeleteWarning', 'Y');
    this.study = JSON.parse(localStorage.getItem('study'));
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        this.api.getStudyPackingLayers(this.study.ID_STUDY).subscribe (
          (response: ViewPackingLayer) => {
            if (response.packing && response.packingLayers) {
              this.packingView = response;
              this.packingView.packingLayers.forEach(layer => {
                switch (Number(layer.PACKING_SIDE_NUMBER)) {
                  case 1:
                    this.topLayers.push(layer);
                    break;
                  case 2:
                    this.sideLayers.push(layer);
                    break;
                  case 3:
                    this.bottomLayers.push(layer);
                    break;
                }
              });
              this.packingName = this.packingView.packing.NOMEMBMAT;
              this.topNrLayer = this.topLayers.length;
              this.sideNrLayer = this.sideLayers.length;
              this.bottomNrLayer = this.bottomLayers.length;
            }
          },
          err => {
          },
          () => {
            this.isLoading = false;
          }
        );
        this.api.getMinMaxProductMeshPacking().subscribe(
          mm => {
            this.minmaxProductMeshPacking = mm;
          }
        );
      }
    );
    this.api.findPackingElements().subscribe(
      (response: PackingElement[]) => {
        this.packingElements = response;
      }
    );
  }

  ngAfterContentChecked() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = JSON.parse(localStorage.getItem('productView'));

    if (this.productShape === 0 || !this.productView.elements || this.productView.elements.length === 0) {
      swal('Warning', this.translate.instant('Please define product first'), 'error');
      this.router.navigate(['/input/product']);
      return;
    }

    if (this.productShape >= 10) {
      this.imgSrc = this.shapeImgShim(JSON.parse(localStorage.getItem('shapes'))[this.productShape - 10].SHAPEPICT);
    } else {
      this.imgSrc = this.shapeImgShim(JSON.parse(localStorage.getItem('shapes'))[this.productShape - 1].SHAPEPICT);
    }
  }

  private shapeImgShim(shapePict: string) {
    return '/assets/img/packing/pack_' + shapePict.split('/').pop().split('.').shift().substr(5) + '.jpg';
  }

  private getTopLabel(shapeCode: number) {
    switch (shapeCode) {
      case this.text.shapeNames.SPHERE:
      case this.text.shapeNames.D_SPHERE:
        return 'All around';
      case this.text.shapeNames.CYL_LAY:
      case this.text.shapeNames.CON_CYL_LAY:
        return 'Side';
    }
    return 'Top';
  }

  private getSideLabel(shapeCode: number) {
    switch (shapeCode) {
      case this.text.shapeNames.REC_LAY:
      case this.text.shapeNames.D_REC_BLOCK_H:
      case this.text.shapeNames.REC_STAND:
      case this.text.shapeNames.D_REC_BLOCK_V:
      case this.text.shapeNames.D_TRAP_3D:
      case this.text.shapeNames.BREAD:
      case this.text.shapeNames.D_REC_BLOCK:
        return '4 Sides';

      case this.text.shapeNames.CYL_LAY:
      case this.text.shapeNames.D_LYI_CYL:
      case this.text.shapeNames.CON_CYL_LAY:
      case this.text.shapeNames.D_LYN_CON_CYL:
      case this.text.shapeNames.D_LYN_OVAL:
        return 'Front';
    }

    return 'Side';
  }

  private getBottomLabel(shapeCode: number) {
    switch (shapeCode) {
      case this.text.shapeNames.CYL_LAY:
      case this.text.shapeNames.D_LYI_CYL:
      case this.text.shapeNames.CON_CYL_LAY:
      case this.text.shapeNames.D_LYN_CON_CYL:
        return 'Rear';
    }
    return 'Bottom';
  }

  savePacking() {
    for (let i = 0; i < this.topLayers.length; i++) {
      if (isNullOrUndefined(this.topLayers[i]['THICKNESS']) || String(this.topLayers[i]['THICKNESS']) === '') {
        this.toastr.error(this.translate.instant('Enter a value in Thickne !'), 'Error');
        return;
      }

      const thikness = Number(this.topLayers[i]['THICKNESS']);
      if (!this.isNumberic(thikness)) {
        this.toastr.error(this.translate.instant('Not a valid number in Thickne !'), 'Error');
        return false;
      } else if (i < 8 && !this.isInRangeOutput(thikness, this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Thickne') +
          ' (' + this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN + ' : '
          + this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX + ') !', 'Error');
          return false;
      }
    }

    for (let i = 0; i < this.sideLayers.length; i++) {
      if (isNullOrUndefined(this.sideLayers[i]['THICKNESS']) || String(this.sideLayers[i]['THICKNESS']) === '') {
        this.toastr.error(this.translate.instant('Enter a value in Thickne !'), 'Error');
        return;
      }

      const thikness = Number(this.sideLayers[i]['THICKNESS']);
      if (!this.isNumberic(thikness)) {
        this.toastr.error(this.translate.instant('Not a valid number in Thickne !'), 'Error');
        return false;
      } else if (i < 8 && !this.isInRangeOutput(thikness, this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Thickne') +
          ' (' + this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN + ' : '
          + this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX + ') !', 'Error');
          return false;
      }
    }

    for (let i = 0; i < this.bottomLayers.length; i++) {
      if (isNullOrUndefined(this.bottomLayers[i]['THICKNESS']) || String(this.bottomLayers[i]['THICKNESS']) === '') {
        this.toastr.error(this.translate.instant('Enter a value in Thickne !'), 'Error');
        return;
      }

      const thikness = Number(this.bottomLayers[i]['THICKNESS']);
      if (!this.isNumberic(thikness)) {
        this.toastr.error(this.translate.instant('Not a valid number in Thickne !'), 'Error');
        return false;
      } else if (i < 8 && !this.isInRangeOutput(thikness, this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX)) {
          this.toastr.error(this.translate.instant('Value out of range in Thickne') +
          ' (' + this.minmaxProductMeshPacking.mmThickness.LIMIT_MIN + ' : '
          + this.minmaxProductMeshPacking.mmThickness.LIMIT_MAX + ') !', 'Error');
          return false;
      }
    }

    this.laddaSavingPacking = true;
    const updateParams = {
      id: this.study.ID_STUDY,
      body: {
        packing: {
          ID_STUDY: this.study.ID_STUDY,
          ID_PACKING: this.study.ID_PACKING,
          ID_SHAPE: this.productShape,
          NOMEMBMAT: this.packingName
        },
        packingLayers: []
      }
    };

    this.topLayers.forEach((element, index) => {
      updateParams.body.packingLayers.push( {
        ID_PACKING_ELMT: element.ID_PACKING_ELMT,
        PACKING_SIDE_NUMBER: 1,
        PACKING_LAYER_ORDER: index,
        THICKNESS: element.THICKNESS
      });
    });

    this.sideLayers.forEach((element, index) => {
      updateParams.body.packingLayers.push({
        ID_PACKING_ELMT: element.ID_PACKING_ELMT,
        PACKING_SIDE_NUMBER: 2,
        PACKING_LAYER_ORDER: index,
        THICKNESS: element.THICKNESS
      });
    });

    this.bottomLayers.forEach((element, index) => {
      updateParams.body.packingLayers.push({
        ID_PACKING_ELMT: element.ID_PACKING_ELMT,
        PACKING_SIDE_NUMBER: 3,
        PACKING_LAYER_ORDER: index,
        THICKNESS: element.THICKNESS
      });
    });

    if (this.packingView) {
      if (this.study.CHAINING_CONTROLS &&
        ((this.topNrLayer > 0) ||
          ((Number(this.packingView.packing.ID_SHAPE) === 9) && ((this.bottomNrLayer + this.sideNrLayer) > 0)))) {
        swal('Warning',
        this.translate.instant('Packing data changed.' +
          'The equipment parameters(Control temperature, dwelling time...)' +
          ' are not valid any more.Please return on equipment page to validate these data.'), 'warning');
      }
    }

    this.api.savePacking(updateParams).subscribe(
      response => {
        this.laddaSavingPacking = false;
        this.toastr.success(this.translate.instant('Product packing specification saved.'), 'Success');
      },
      err => {

      }
    );
  }

  onTopNrLayerChanged() {
    if (this.packingView) {
      if (this.study.CHAINING_CONTROLS &&
        ((this.topNrLayer > 0) ||
          ((Number(this.packingView.packing.ID_SHAPE) === 9) && ((this.bottomNrLayer + this.sideNrLayer) > 0)))) {
        swal('Warning', this.translate.instant('No component addition will be allowed in next studies'), 'warning');
      }
    }

    this.topLayers = [];

    for (let index = 0; index < this.topNrLayer; index++) {
      const p = new PackingLayer();
      p.THICKNESS = this.defaultThickness;
      p.ID_PACKING_ELMT = 1;
      p.PACKING_LAYER_ORDER = index;
      p.PACKING_SIDE_NUMBER = 1;
      this.topLayers.push( p );
    }
  }

  onSideNrLayerChanged() {
    if (this.packingView) {
      if (this.study.CHAINING_CONTROLS &&
        ((this.topNrLayer > 0) ||
          ((Number(this.packingView.packing.ID_SHAPE) === 9) && ((this.bottomNrLayer + this.sideNrLayer) > 0)))) {
        swal('Warning', this.translate.instant('No component addition will be allowed in next studies'), 'warning');
      }
    }

    this.sideLayers = [];
    for (let index = 0; index < this.sideNrLayer; index++) {
      const p = new PackingLayer();
      p.THICKNESS = this.defaultThickness;
      p.ID_PACKING_ELMT = 1;
      p.PACKING_LAYER_ORDER = index;
      p.PACKING_SIDE_NUMBER = 2;
      this.sideLayers.push(p);
    }
  }

  onBottomNrLayerChanged() {
    if (this.packingView) {
      if (this.study.CHAINING_CONTROLS &&
        ((this.topNrLayer > 0) ||
          ((Number(this.packingView.packing.ID_SHAPE) === 9) && ((this.bottomNrLayer + this.sideNrLayer) > 0)))) {
        swal('Warning', this.translate.instant('No component addition will be allowed in next studies'), 'warning');
      }
    }

    this.bottomLayers = [];
    for (let index = 0; index < this.bottomNrLayer; index++) {
      const p = new PackingLayer();
      p.THICKNESS = this.defaultThickness;
      p.ID_PACKING_ELMT = 1;
      p.PACKING_LAYER_ORDER = index;
      p.PACKING_SIDE_NUMBER = 3;
      this.bottomLayers.push(p);
    }
  }

  onSideSameAsTop() {
    this.sideNrLayer = this.topNrLayer;

    this.onSideNrLayerChanged();
    // this.sideLayers = this.topLayers;
  }

  onSideSameAsBottom() {
    this.sideNrLayer = this.bottomNrLayer;

    this.onSideNrLayerChanged();
    // this.sideLayers = this.bottomLayers;
  }

  onBottomSameAsTop() {
    this.bottomNrLayer = this.topNrLayer;

    this.onBottomNrLayerChanged();
    // this.bottomLayers = this.topLayers;
  }

  onChainingControlsLoaded() {
    this.chainingControls.showPacking();
  }

  disabledField() {
    return !(Number(this.study.ID_USER) === Number(this.auth.user().ID_USER));
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

  checkEnabledField() {
    if (Number(this.productShape) === Number(this.text.shapeNames.D_SPHERE)
      || Number(this.productShape) === Number(this.text.shapeNames.SPHERE)
      || Number(this.productShape) === Number(this.text.shapeNames.SLAB)) {
      return true;
    } else {
      return false;
    }
  }
}
