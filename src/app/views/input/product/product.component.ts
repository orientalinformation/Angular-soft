import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private translate: TranslateService) {

  }
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
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('addElementModal') public addElementModal: ModalDirective;
  @ViewChild('modalEditProduct') public modalEditProduct: ModalDirective;
  @ViewChild('editCompModal') public editCompModal: ModalDirective;
  @ViewChild('chainingControls') public chainingControls: ChainingComponent;

  public laddaAddComponent = false;
  public laddaConfirmAddComponent = false;
  public laddaUpdateElement = false;
  public isLoading = true;
  public prodColors: Models.Color[];

  public elementForm = {
    description: '',
    specific_dim: 0.0,
    computed_mass: 0.0,
    real_mass: 0.0,
    elementId: 0
  };

  public productForm = {
    name: '',
    shape: 0,
    dim1: 0,
    dim2: 0,
    dim3: 0
  };
  public previewImgSrc;
  public availShapes = [];

  public shapeSelect = 0;
  public productShape = 0;
  public product: Models.Product;
  public study: Models.Study;
  public user: Models.User;
  private productModel: Models.ViewProduct;

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
    BREAD: 9
  };

  public prodDim1: number;
  public prodDim2: number;
  public prodDim3: number;

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
  public minmaxProductMeshPacking: Models.ViewMinMaxProductMeshPacking;
  public sleepingComp = 0;

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
      name: ''
    };
    this.shapeNames = text.shapeNames;
  }

  onSelectAddingElement(selected, sleeping) {
    this.selectedAddingElement = selected;
    this.sleepingComp = sleeping;
  }

  onChangeShape() {
    this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 1].SHAPEPICT);
    this.dimension1Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE));

    this.dimension2Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.REC_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.REC_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.BREAD)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY));

    this.dimension3Disabled = (Number(this.productForm.shape) === 0) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
      (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY));

    if (this.dimension1Disabled) {
      this.productForm.dim1 = 0;
    }

    if (this.dimension2Disabled) {
      this.productForm.dim2 = 0;
    }

    if (this.dimension3Disabled) {
      this.productForm.dim3 = 0;
    }
  }

  ngOnInit() {
    this.productShape = 0;
  }

  ngAfterViewInit() {
    this.prodColors = JSON.parse(localStorage.getItem('colors'));
    this.isLoading = true;
    this.study = JSON.parse(localStorage.getItem('study'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.api.getShapes().subscribe(
      shapes => {
        this.availShapes = shapes;
        localStorage.setItem('shapes', JSON.stringify(this.availShapes));
        this.api.getSymbol(this.study.ID_STUDY).subscribe(
          data => {
            console.log(data);
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

  private shapeImgShim(shapePict: string) {
    return '/assets/img/product/' + shapePict.split('/').pop().split('.').shift().substr(5) + '.png';
  }

  saveProduct() {
    console.log(this.minmaxProductMeshPacking);
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
          console.log(err);
        }
      );
    }

    this.prodDim1 = this.productForm.dim1;
    this.prodDim2 = this.productForm.dim2;
    this.prodDim3 = this.productForm.dim3;
  }

  onShowAddElement() {
    this.laddaAddComponent = true;
    this.laddaConfirmAddComponent = false;
    if (this.productShape === 0) {
      swal('Oops...', 'Product must be defined before adding elements!', 'error');

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
        console.log(response);
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
          console.log(this.prodDim2);

          this.productForm.shape = this.productShape;
          this.productForm.dim1 = this.prodDim1;
          this.productForm.dim3 = this.prodDim3;
          this.productForm.name = this.product.PRODNAME;
          this.previewImgSrc = this.shapeImgShim(this.availShapes[this.productForm.shape - 1].SHAPEPICT);

          this.dimension1Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE));

          this.dimension2Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.REC_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.REC_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.BREAD)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY));

          this.dimension3Disabled = (Number(this.productForm.shape) === 0) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SLAB)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.SPHERE)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CYL_LAY)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_STAND)) ||
            (Number(this.productForm.shape) === Number(this.shapeNames.CON_CYL_LAY));
        } else {
          localStorage.removeItem('productShape');
        }
        this.isLoading = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  hasDim1() {
    return (Number(this.productShape) !== Number(this.shapeNames.SLAB) && Number(this.productShape) !== Number(this.shapeNames.SPHERE));
  }

  hasDim3() {
    return (Number(this.productShape) === Number(this.shapeNames.REC_LAY)
      || Number(this.productShape) === Number(this.shapeNames.REC_STAND) || Number(this.productShape) === Number(this.shapeNames.BREAD));
  }

  onAddElement() {
    console.log(this.productShape);
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
        swal('Error', 'Adding sleeping component is under development, not ready to use! Please select an active component.', 'error');
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
        console.log(data);
        this.addElementModal.hide();
        this.refreshViewModel();
      });
    }
  }

  onEditProductModalShow(eventType: string, event) {
    if (!this.components || this.components.active.length === 0) {
      this.api.findComponents({
        idStudy: this.study.ID_STUDY
      }).subscribe(
        data => {
          console.log(data);
          this.components = data;
          this.laddaAddComponent = false;
        }
      );
    } else {
      this.laddaAddComponent = false;
    }
  }

  onRemoveElement(element: Models.ProductElmt, index: number) {
    console.log(index);
    console.log(this.laddaDeletingElmts);
    this.laddaDeletingElmts[index] = true;
    this.api.removeProductElement({
      id: this.product.ID_PROD,
      elementId: element.ID_PRODUCT_ELMT
    }).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {
        this.laddaDeletingElmts[index] = false;
      },
      () => {
        console.log('delete elmt completed');
        this.laddaDeletingElmts[index] = false;
      }
    );
  }

  onEditElement(element: Models.ProductElmt) {
    this.elementForm.computed_mass = element.PROD_ELMT_WEIGHT;
    this.elementForm.real_mass = element.PROD_ELMT_REALWEIGHT;
    this.elementForm.description = element.PROD_ELMT_NAME;
    this.elementForm.elementId = element.ID_PRODUCT_ELMT;
    this.elementForm.specific_dim = element.SHAPE_PARAM2;
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
      elementId: this.elementForm.elementId,
      description: this.elementForm.description,
      computedmass: this.elementForm.computed_mass,
      realmass: this.elementForm.real_mass
    }).subscribe(
      response => {
        this.refreshViewModel();
        this.editCompModal.hide();
        this.laddaUpdateElement = false;
      },
      err => {
        console.log(err);
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
      idStudy: this.study.ID_STUDY,
      compfamily: this.compFamilySelected,
    }).subscribe(
      data => {
        console.log(data);
        this.components = data;
      }
    );
    this.waterPercentListSelected = 0;
  }

  subFamilyFilter() {
    this.api.findComponents({
      idStudy: this.study.ID_STUDY,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected
    }).subscribe(
      data => {
        console.log(data);
        this.components = data;
      }
    );
    this.waterPercentListSelected = 0;
  }

  waterPercentFilter() {
    this.api.findComponents({
      idStudy: this.study.ID_STUDY,
      compfamily: this.compFamilySelected,
      subfamily: this.subFamilySelected,
      waterpercent: this.waterPercentListSelected
    }).subscribe(
      data => {
        console.log(data);
        this.components = data;
      }
    );
  }

  updateRealMass() {
    const real_mass = Math.round(this.elementForm.specific_dim * this.elementForm.computed_mass * 1000) / 1000;
    this.elementForm.real_mass = real_mass;
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
}
