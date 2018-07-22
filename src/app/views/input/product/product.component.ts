import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { TextService } from '../../../shared/text.service';
import { NgxLocalizedNumbersService } from 'ngx-localized-numbers';
import { LocalizationFormatCurrencyPipe } from 'ngx-localized-numbers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSpinnerComponent } from '../../../components';
import { ChainingComponent } from '../chaining/chaining.component';

import swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import * as Models from '../../../api/models';
import { Symbol } from '../../../api/models/symbol';
import { ViewFamily } from '../../../api/models/view-family';
import { ToastrService } from 'ngx-toastr';

@Pipe({ name: 'compFilter' })
export class CompFilterPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  public transform(values: Models.Component[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter((v: Models.Component) => {
      return this.translate.instant('components.' + v.ID_COMP).toLowerCase().indexOf(filter.toLowerCase()) >= 0;
    });
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('addElementModal') public addElementModal: ModalDirective;
  @ViewChild('modalEditProduct') public modalEditProduct: ModalDirective;
  @ViewChild('editCompModal') public editCompModal: ModalDirective;
  @ViewChild('selectcolorModal') public selectColorModal: ModalDirective;
  @ViewChild('chainingControls') public chainingControls: ChainingComponent;

  public threedData = [0, 1, 2, 3];
  public laddaAddComponent = false;
  public laddaConfirmAddComponent = false;
  public laddaUpdateElement = false;
  public isLoading = true;
  public prodColors: Models.Color[];

  public elementForm = {
    description: '',
    specific_dim: 0.0,
    specific_dim4: 0.0,
    specific_dim5: 0.0,
    computed_mass: 0.0,
    real_mass: 0.0,
    elementId: 0
  };

  public productForm = {
    name: '',
    shape: 0,
    dim1: 0,
    dim2: 0,
    dim3: 0,
    dim4: 0,
    dim5: 0
  };
  public previewImgSrc;
  public availShapes = [];

  public shapeSelect = 0;
  public productShape = 0;
  public product: Models.Product;
  public study: Models.Study;
  public user: Models.User;
  public productModel: Models.ViewProduct;

  public elements: Models.ProductElmt[] = [];

  public selectedAddingElement: Models.Component;

  public shapeNames = {
    SLAB: 1,
    REC_STAND: 2,
    REC_LAY: 3,
    CYL_STAND: 4,
    CYL_LAY: 5,
    SPHERE: 6,
    CON_CYL_STAND: 7,
    CON_CYL_LAY: 8,
    BREAD: 9,
    D_REC_BLOCK_V: 10,
    D_REC_BLOCK_H: 11,
    D_STAND_CYL: 12,
    D_LYI_CYL: 13,
    D_SPHERE: 14,
    D_STAND_CON_CYL: 15,
    D_LYN_CON_CYL: 16,
    D_REC_BLOCK: 17,
    D_TRAP_3D: 18,
    D_STAND_OVAL: 19,
    D_LYN_OVAL: 20,
    D_STAND_CON_OVAL: 21,
    D_LYN_CON_OVAL: 22,
    D_SEMI_CYL: 23
  };

  public prodDim1: number;
  public prodDim2: number;
  public prodDim3: number;
  public prodDim4: number;
  public prodDim5: number;

  public laddaDeletingElmts: boolean[];

  public filterString = '';
  public symbol: Symbol;
  public compFamily: ViewFamily;
  public subFamily: ViewFamily;
  public waterPercentList;
  public compFamilySelected = 0;
  public subFamilySelected = 0;
  public waterPercentListSelected = 0;
  public dimension1Disabled = true;
  public dimension2Disabled = true;
  public dimension3Disabled = true;
  public dimension4Disabled = true;
  public dimension5Disabled = true;
  public minmaxProductMeshPacking: Models.ViewMinMaxProductMeshPacking;
  public sleepingComp = 0;
  public calculateMass = 0;
  public colorPalettes: Array<any> = [];

  public colorSelect: any = {};
  public colorSelected: Array<any> = [];
  public _disabledV = '0';
  public disabled = false;
  public colorItems: Array<any> = [];
  public elementProduct;
  public eid = 0;
  public dText = 'Advanced';
  public showText = false;
  public calMode = 0;

  columns =
    [
      { text: 'up/down', columntype: 'text', width: 80 },
      { text: 'Product Name', datafield: 'PROD_ELMT_NAME', columntype: 'text' },
      { text: 'Description', columntype: 'text', width: 150 },
      { text: 'Specific Dim.', width: 100, cellsalign: 'right', cellsformat: 'f3' },
      { text: 'Calculated mass', datafield: 'PROD_ELMT_WEIGHT', width: 100, cellsalign: 'right', cellsformat: 'f3' },
      { text: 'Real mass', datafield: 'PROD_ELMT_REALWEIGHT', cellsalign: 'right', cellsformat: 'f3', width: 100 },
      { text: 'Action', cellsalign: 'right', cellsformat: 'f3', width: 100 },
    ];

  dropDownSource: string[] = ['First Name', 'Last Name', 'Product', 'Quantity', 'Price'];

  components: Models.ViewComponents;

  constructor(private api: ApiService, private text: TextService,
    private localizedNumbersService: NgxLocalizedNumbersService, private translate: TranslateService,
    private toastr: ToastrService, private router: Router) {
    this.productForm = {
      shape: 0,
      dim1: 0,
      dim2: 0,
      dim3: 0,
      dim4: 0,
      dim5: 0,
      name: ''
    };
    this.shapeNames = text.shapeNames;
  }

  onSelectAddingElement(selected, sleeping) {
    this.selectedAddingElement = selected;
    this.sleepingComp = sleeping;
  }

  onChangeShape() {
    if (this.calMode === 1) {
      this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 10].SHAPEPICT);
    } else {
      this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 1].SHAPEPICT);
    }

    this.dimension1Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE));

    this.dimension2Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.REC_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.REC_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.BREAD)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

    this.dimension3Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

    this.dimension4Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

    this.dimension5Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

    if (this.dimension1Disabled) {
      this.productForm.dim1 = 0;
    }

    if (this.dimension2Disabled) {
      this.productForm.dim2 = 0;
    }

    if (this.dimension3Disabled) {
      this.productForm.dim3 = 0;
    }

    if (this.dimension4Disabled) {
      this.productForm.dim4 = 0;
    }

    if (this.dimension5Disabled) {
      this.productForm.dim5 = 0;
    }
  }

  ngOnInit() {
    this.productShape = 0;
    this.study = JSON.parse(localStorage.getItem('study'));
  }

  ngAfterViewInit() {
    this.prodColors = JSON.parse(localStorage.getItem('colors'));
    // console.log(this.prodColors);
    this.isLoading = true;
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.api.findColorPalettes().subscribe(
      data => {
        this.colorPalettes = data;
        for (let i = 0; i < this.colorPalettes.length; i++) {
          const valueData = this.colorPalettes[i];
          const colorName = this.firstToUpperCase(valueData.COLOR_NAME);
          this.colorItems.push({
            id: this.colorPalettes[i].ID_COLOR,
            text: `<colorbox style='background-color:${valueData.CODE_HEXA};'></colorbox>${colorName} (${valueData.CODE_HEXA})`
          });
        }
      }
    );

    // console.log(this.colorItems);
    this.api.getShapes(this.calMode).subscribe(
      shapes => {
        this.availShapes = shapes;
        // localStorage.setItem('shapes', JSON.stringify(this.availShapes));
        this.api.getSymbol(this.study.ID_STUDY).subscribe(
          data => {
            // console.log(data);
            this.symbol = data;
          }
        );
        this.refreshViewModel();
      }
    );
    this.api.getMinMaxProductMeshPacking().subscribe(
      mm => {
        this.minmaxProductMeshPacking = mm;
      }
    );
  }

  showModalSelectColor(element, i) {
    this.colorSelected = [];
    if (element.prodcharColor) {
      const valueData = element.prodcharColor;
      const colorName = this.firstToUpperCase(element.prodcharColor.COLOR_NAME);
      this.colorSelected.push({
        id: element.prodcharColor.ID_COLOR,
        text: `<colorbox style='background-color:${valueData.CODE_HEXA};'></colorbox>${colorName} (${valueData.CODE_HEXA})`
      });
      this.eid = Number(element.prodcharColor.LAYER_ORDER);
    } else {
      const valueData = this.prodColors[i - 1];
      const colorName = this.firstToUpperCase(this.prodColors[i - 1].COLOR_NAME);
      this.colorSelected.push({
        id: this.prodColors[i - 1].ID_COLOR,
        text: `<colorbox style='background-color:${valueData.CODE_HEXA};'></colorbox>${colorName} (${valueData.CODE_HEXA})`
      });
      this.eid = Number(this.elements.length - i + 1);
    }
    this.elementProduct = element;
    this.selectColorModal.show();
  }

  public get disabledV(): string {
    return this._disabledV;
  }

  public set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any, ID_PROD: number): void {
    // console.log(this.eid);
    this.api.updateProductCharColor({
      id: ID_PROD,
      body: {
        ID_COLOR: value.id,
        LAYER_ORDER: this.eid,
      }
    }).subscribe(
      data => {
        // console.log(this.colorSelect);
        this.selectColorModal.hide();
        this.refreshViewModel();
      }
    );
  }
  public removed(value: any): void {
    // console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    // console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.colorSelect = value;
  }

  private shapeImgShim(shapePict: string) {
    return '/assets/img/product/' + shapePict.split('/').pop().split('.').shift().substr(5) + '.png';
  }

  saveProduct() {
    // console.log(this.minmaxProductMeshPacking);
    if (!this.productForm.name) {
      this.toastr.error(this.translate.instant('Enter a value in Product name !'), 'Error');
      return;
    }

    if (!this.dimension1Disabled) {
      if (!this.productForm.dim1) {
        this.toastr.error(this.translate.instant('Enter a value in Dimension 1 !'), 'Error');
        return;
      } else if (!this.isNumberic(this.productForm.dim1)) {
        this.toastr.error(this.translate.instant('Not a valid number in Dimension 1 !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.productForm.dim1, this.minmaxProductMeshPacking.mmDim1.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmDim1.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Dimension 1') +
          ' (' + this.minmaxProductMeshPacking.mmDim1.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmDim1.LIMIT_MAX + ') !', 'Error');
        return;
      }
    }

    if (!this.dimension2Disabled) {
      if (!this.productForm.dim2) {
        this.toastr.error(this.translate.instant('Enter a value in Dimension 2 !'), 'Error');
        return;
      } else if (!this.isNumberic(this.productForm.dim2)) {
        this.toastr.error(this.translate.instant('Not a valid number in Dimension 2 !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.productForm.dim2, this.minmaxProductMeshPacking.mmDim2.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmDim2.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Dimension 2') +
          ' (' + this.minmaxProductMeshPacking.mmDim2.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmDim2.LIMIT_MAX + ') !', 'Error');
        return;
      }
    }

    if (!this.dimension3Disabled) {
      if (!this.productForm.dim3) {
        this.toastr.error(this.translate.instant('Enter a value in Dimension 3 !'), 'Error');
        return;
      } else if (!this.isNumberic(this.productForm.dim3)) {
        this.toastr.error(this.translate.instant('Not a valid number in Dimension 3 !'), 'Error');
        return;
      } else if (!this.isInRangeOutput(this.productForm.dim3, this.minmaxProductMeshPacking.mmDim3.LIMIT_MIN,
        this.minmaxProductMeshPacking.mmDim3.LIMIT_MAX)) {
        this.toastr.error(this.translate.instant('Value out of range in Dimension 3') +
          ' (' + this.minmaxProductMeshPacking.mmDim3.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmDim3.LIMIT_MAX + ') !', 'Error');
        return;
      }
    }
    this.modalEditProduct.hide();
    // console.log(this.productForm.shape, this.productShape);
    if (this.productForm.shape !== this.productShape) {
      this.productShape = this.productForm.shape;
      this.api.newProduct({
        id: this.study.ID_STUDY,
        name: this.productForm.name
      }).subscribe(
        response => {
          this.refreshViewModel();
        },
        err => {

        }
      );
    } else {
      const updateParams: ApiService.UpdateProductParams = {
        id: this.study.ID_STUDY,
        updateParams: {}
      };

      if (this.product.PRODNAME !== this.productForm.name) {
        updateParams.updateParams.name = this.productForm.name;
      }

      if (this.prodDim1 !== this.productForm.dim1 && this.hasDim1()) {
        updateParams.updateParams.dim1 = this.productForm.dim1;
      }

      if (this.prodDim3 !== this.productForm.dim3 && this.hasDim3()) {
        updateParams.updateParams.dim3 = this.productForm.dim3;
      }

      this.api.updateProduct(updateParams).subscribe(
        response => {
          this.refreshViewModel();
        },
        err => {
          // console.log(err);
        }
      );
    }

    this.prodDim1 = this.productForm.dim1;
    this.prodDim2 = this.productForm.dim2;
    this.prodDim3 = this.productForm.dim3;
    this.prodDim4 = this.productForm.dim4;
    this.prodDim5 = this.productForm.dim5;
  }

  onShowAddElement() {
    this.laddaAddComponent = true;
    this.laddaConfirmAddComponent = false;
    if (this.productShape === 0) {
      swal('Warning', this.translate.instant('Product must be defined before adding elements!'), 'error');

      return false;
    }
    this.addElementModal.show();
  }

  onChainControlsLoaded() {
    if (this.study.HAS_CHILD || this.study.PARENT_ID !== 0) {
      this.chainingControls.showProduct();
    }
  }

  refreshViewModel() {
    this.api.getProductViewModel(this.study.ID_PROD).subscribe(
      (response: Models.ViewProduct) => {
        // console.log(response);
        this.productModel = response;
        localStorage.setItem('productView', JSON.stringify(response));
        this.laddaDeletingElmts = new Array<boolean>(response.elements.length);
        this.laddaDeletingElmts.fill(false);
        this.elements = response.elements;
        this.product = response.product;
        this.prodDim2 = response.specificDimension;
        this.compFamily = response.compFamily;
        this.subFamily = response.subFamily;
        this.waterPercentList = response.waterPercentList;
        if (this.elements.length > 0) {
          this.productShape = this.elements[0].ID_SHAPE;
          localStorage.setItem('productShape', this.productShape.toString());
          this.prodDim1 = this.elements[0].SHAPE_PARAM1;
          this.prodDim3 = this.elements[0].SHAPE_PARAM3;
          // console.log(this.prodDim2);

          this.productForm.shape = this.productShape;
          this.productForm.dim1 = this.prodDim1;
          this.productForm.dim3 = this.prodDim3;
          this.productForm.name = this.product.PRODNAME;

          if (this.productShape >= 10) {
            this.calMode = 1;
            this.dText = 'Basic';
            this.showText = true;
            this.getShapesMode(this.calMode);
            this.availShapes = JSON.parse(localStorage.getItem('shapes'));
            this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 10].SHAPEPICT);
            console.log(this.previewImgSrc);
          } else {
            this.calMode = 0;
            this.dText = 'Advanced';
            this.showText = false;
            this.getShapesMode(this.calMode);
            this.availShapes = JSON.parse(localStorage.getItem('shapes'));
            this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 1].SHAPEPICT);
          }

          this.dimension1Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE));

          this.dimension2Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.REC_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.REC_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.BREAD)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

          this.dimension3Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

          this.dimension4Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));

          this.dimension5Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_H)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYI_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_CYL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_TRAP_3D)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_STAND_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_LYN_CON_OVAL)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.D_SEMI_CYL));
        } else {
          localStorage.removeItem('productShape');
        }
        this.isLoading = false;
      },
      err => {
        // console.log(err);
      }
    );
  }

  hasDim1() {
    let dim = null;
    if (Number(this.productShape) >= 10) {
      dim = (Number(this.productShape) !== Number(this.shapeNames.D_SPHERE));
    } else {
      dim = (Number(this.productShape) !== Number(this.shapeNames.SLAB) && Number(this.productShape) !== Number(this.shapeNames.SPHERE));
    }
    return dim;
  }

  hasDim3() {
    let dim = null;
    if (Number(this.productShape) >= 10) {
      dim = (Number(this.productShape) !== Number(this.shapeNames.D_STAND_CYL)
        && Number(this.productShape) !== Number(this.shapeNames.D_LYI_CYL)
        && Number(this.productShape) !== Number(this.shapeNames.D_SPHERE)
        && Number(this.productShape) !== Number(this.shapeNames.D_STAND_CON_CYL)
        && Number(this.productShape) !== Number(this.shapeNames.D_SEMI_CYL)
      );
    } else  {
      dim = (Number(this.productShape) === Number(this.shapeNames.REC_LAY)
        || Number(this.productShape) === Number(this.shapeNames.REC_STAND)
        || Number(this.productShape) === Number(this.shapeNames.BREAD)
      );
    }
    return dim;
  }

  onAddElement() {
    // console.log(this.productShape);
    if (this.sleepingComp === 1) {

      const params: ApiService.AppendElementsToProductParams = {
        id: this.product.ID_PROD,
        shapeId: this.productShape,
        componentId: this.selectedAddingElement.ID_COMP
      };

      if (this.hasDim1()) {
        params.dim1 = this.prodDim1;
      }

      if (this.hasDim3()) {
        params.dim3 = this.prodDim3;
      }

      localStorage.setItem('paramsCompInput', JSON.stringify(params));
      localStorage.setItem('IdCompInput', this.selectedAddingElement.ID_COMP.toString());
      this.sleepingComp = 0;
      this.router.navigate(['/references/component']);

    } else {
      if (this.selectedAddingElement.COMP_RELEASE === 6) {
        swal('Error', this.translate.instant('Adding sleeping component is under development,' +
        'not ready to use! Please select an active component.'), 'error');
        return false;
      }
      const params: ApiService.AppendElementsToProductParams = {
        id: this.product.ID_PROD,
        shapeId: this.productShape,
        componentId: this.selectedAddingElement.ID_COMP
      };
      this.laddaConfirmAddComponent = true;

      if (this.hasDim1()) {
        params.dim1 = this.prodDim1;
      }

      if (this.hasDim3()) {
        params.dim3 = this.prodDim3;
      }

      this.api.appendElementsToProduct(params).subscribe(data => {
        // console.log(data);
        /* tslint:disable */
        const productWarning = localStorage.getItem('productWarning');
        if (productWarning == 'Y') {
          swal('Warning', this.translate.instant('Product data changed.The equipment parameters (Control temperature, dwelling time...) are not valid any more. Please return on equipment page to validate these data.'), 'warning');
          localStorage.setItem('productWarning', 'N');
        }
        this.addElementModal.hide();
        this.refreshViewModel();
      });
    }
  }

  onEditProductModalShow(eventType: string, event) {
    if (!this.components || this.components.active.length === 0) {
      this.api.findComponents({
        idStudy: 0
      }).subscribe(
        data => {
          // console.log(data);
          this.components = data;
          this.laddaAddComponent = false;
        }
      );
    } else {
      this.laddaAddComponent = false;
    }
  }

  onRemoveElement(element: Models.ProductElmt, index: number) {
    // console.log(index);
    this.laddaDeletingElmts[index] = true;
    this.api.removeProductElement({
      id: this.product.ID_PROD,
      elementId: element.ID_PRODUCT_ELMT
    }).subscribe(
      response => {
        const productDeleteWarning = localStorage.getItem('productDeleteWarning');
        if (productDeleteWarning == 'Y') {
          swal('Warning', this.translate.instant('Product data changed.The equipment parameters (Control temperature, dwelling time...) are not valid any more. Please return on equipment page to validate these data.'), 'warning');
          localStorage.setItem('productDeleteWarning', 'N');
        }
        this.refreshViewModel();
      },
      err => {
        this.laddaDeletingElmts[index] = false;
      },
      () => {
        // console.log('delete elmt completed');
        this.laddaDeletingElmts[index] = false;
      }
    );
  }

  onEditElement(element: Models.ProductElmt) {
    // console.log(element);
    this.calculateMass = element.PROD_ELMT_WEIGHT;
    this.elementForm.computed_mass = element.PROD_ELMT_WEIGHT;
    this.elementForm.real_mass = element.PROD_ELMT_REALWEIGHT;
    this.elementForm.description = element.PROD_ELMT_NAME;
    this.elementForm.elementId = element.ID_PRODUCT_ELMT;
    this.elementForm.specific_dim = element.SHAPE_PARAM2;
    this.elementForm.specific_dim4 = element.SHAPE_PARAM4;
    this.elementForm.specific_dim5 = element.SHAPE_PARAM5;
    this.editCompModal.show();
  }

  onMoveUpElement(element: Models.ProductElmt) {
    this.api.productElementMoveUp(element.ID_PRODUCT_ELMT).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {

      }
    );
  }

  onMoveDownElement(element: Models.ProductElmt) {
    this.api.productElementMoveDown(element.ID_PRODUCT_ELMT).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {

      }
    );
  }

  updateProductElement() {
    if (!this.elementForm.specific_dim) {
      this.toastr.error(this.translate.instant('Enter a value in Specific Dim. !'), 'Error');
      return;
    } else if (!this.isNumberic(this.elementForm.specific_dim)) {
      this.toastr.error(this.translate.instant('Not a valid number in Specific Dim. !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.elementForm.specific_dim, this.minmaxProductMeshPacking.mmDim2.LIMIT_MIN,
      this.minmaxProductMeshPacking.mmDim2.LIMIT_MAX)) {
      this.toastr.error(this.translate.instant('Value out of range in Specific Dim.') +
        ' (' + this.minmaxProductMeshPacking.mmDim2.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmDim2.LIMIT_MAX + ') !', 'Error');
      return;
    }

    if (!this.elementForm.real_mass) {
      this.toastr.error(this.translate.instant('Enter a value in Mass !'), 'Error');
      return;
    } else if (!this.isNumberic(this.elementForm.real_mass)) {
      this.toastr.error(this.translate.instant('Not a valid number in Mass !'), 'Error');
      return;
    } else if (!this.isInRangeOutput(this.elementForm.real_mass, this.minmaxProductMeshPacking.mmMass.LIMIT_MIN,
      this.minmaxProductMeshPacking.mmMass.LIMIT_MAX)) {
      this.toastr.error(this.translate.instant('Value out of range in Mass') +
        ' (' + this.minmaxProductMeshPacking.mmMass.LIMIT_MIN + ' : ' + this.minmaxProductMeshPacking.mmMass.LIMIT_MAX + ') !', 'Error');
      return;
    }

    this.laddaUpdateElement = true;
    this.api.updateProductElement({
      id: this.product.ID_PROD,
      dim2: this.elementForm.specific_dim,
      dim4: this.elementForm.specific_dim4,
      dim5: this.elementForm.specific_dim5,
      elementId: this.elementForm.elementId,
      description: this.elementForm.description,
      computedmass: this.elementForm.computed_mass,
      realmass: this.elementForm.real_mass
    }).subscribe(
      response => {
        swal('Warning', this.translate.instant('Product data changed.The equipment parameters (Control temperature, dwelling time...) are not valid any more. Please return on equipment page to validate these data.'), 'warning');        
        // console.log(response);
        this.refreshViewModel();
        this.editCompModal.hide();
        this.laddaUpdateElement = false;
      },
      err => {
        // console.log(err);
      },
      () => {
        this.laddaUpdateElement = false;
      }
    );
  }

  compFamilyFilter() {
    this.api.getSubfamily(this.compFamilySelected).subscribe(
      data => {
        this.subFamily = data;
      }
    );

    this.api.findComponents({
      idStudy: 0,
      compfamily: this.compFamilySelected,
    }).subscribe(
      data => {
        // console.log(data);
        this.components = data;
      }
    );
    this.waterPercentListSelected = 0;
  }

  subFamilyFilter() {
    this.api.findComponents({
      idStudy: 0,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected
    }).subscribe(
      data => {
        // console.log(data);
        this.components = data;
      }
    );
    this.waterPercentListSelected = 0;
  }

  waterPercentFilter() {
    this.api.findComponents({
      idStudy: 0,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected,
      waterpercent: this.waterPercentListSelected
    }).subscribe(
      data => {
        // console.log(data);
        this.components = data;
      }
    );
  }

  updateRealMass() {
    const mass = Math.round(this.elementForm.specific_dim * this.calculateMass * 1000) / 1000;
    this.elementForm.computed_mass = mass;
    this.elementForm.real_mass = mass;
  }

  disabledField() {
    return !(Number(this.study.ID_USER) === Number(this.user.ID_USER));
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

  firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  change3DProduct() {
    this.showText = !this.showText;
    if (this.showText) {
      this.dText = 'Basic';
      this.calMode = 1;
    } else {
      this.dText = 'Advanced';
      this.calMode = 0;
    }
    this.getShapesMode(this.calMode);

    this.dimension1Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V));
    this.dimension3Disabled = (Number(this.productForm.shape) === Number(this.shapeNames.D_REC_BLOCK_V));
  }

  getShapesMode(calMode: number) {
    this.api.getShapes(calMode).subscribe(
      data => {
        this.availShapes = data;
        localStorage.setItem('shapes', JSON.stringify(this.availShapes));
      }
    );
  }
}
