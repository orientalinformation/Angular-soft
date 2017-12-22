import { Component, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { Shape } from '../../../api/models/shape';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../../../api/models/product';
import { Study } from '../../../api/models/study';
import { ProductElmt } from '../../../api/models/product-elmt';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { TextService } from '../../../shared/text.service';
import { NgxLocalizedNumbersService } from 'ngx-localized-numbers';
import { LocalizationFormatCurrencyPipe } from 'ngx-localized-numbers';
import { ViewProduct } from '../../../api/models';
import { FormBuilder, FormGroup } from '@angular/forms';

import swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('addElementModal') public addElementModal: ModalDirective;
  @ViewChild('modalEditProduct') public modalEditProduct: ModalDirective;
  @ViewChild('editCompModal') public editCompModal: ModalDirective;

  public laddaAddComponent = false;
  public laddaConfirmAddComponent = false;

  public elementForm = {
    description: '',
    specific_dim: 0.0,
    computed_mass: 0.0,
    real_mass: 0.0,
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
  public product: Product;
  private study: Study;
  private productModel: ViewProduct;

  public elements: ProductElmt[] = [];

  public selectedAddingElement;

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

  components: Array<any> = [];

  constructor(private api: ApiService, private text: TextService,
    private localizedNumbersService: NgxLocalizedNumbersService) {
      this.productForm.shape = 0;
      this.productForm.dim1 = 0;
      this.productForm.dim2 = 0;
      this.productForm.dim3 = 0;
      this.productForm.name = '';
  }

  onSelectAddingElement(selected) {
    this.selectedAddingElement = selected;
  }

  onChangeShape() {
    this.previewImgSrc = this.shapeImgShim(this.availShapes[ this.productForm.shape - 1 ].SHAPEPICT);
  }

  ngOnInit() {
    this.productShape = 0;
  }

  ngAfterViewInit() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.api.getShapes().subscribe(
      shapes => {
        this.availShapes = shapes;
        this.previewImgSrc = this.shapeImgShim(shapes[0].SHAPEPICT);
        localStorage.setItem('shapes', JSON.stringify(this.availShapes));
        this.refreshViewModel();
      }
    );
  }

  private shapeImgShim(shapePict: string) {
    return '/assets/img/product/' + shapePict.split('/').pop().split('.').shift().substr(5) + '.png';
  }

  saveProduct() {
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
        id: this.study.ID_STUDY
      };
      if (this.product.PRODNAME !== this.productForm.name) {
        updateParams.name = this.product.PRODNAME;
      }
      if (this.prodDim1 !== this.productForm.dim1 && this.hasDim1()) {
        updateParams.dim1 = this.productForm.dim1;
      }
      if (this.prodDim3 !== this.productForm.dim3 && this.hasDim3()) {
        updateParams.dim3 = this.productForm.dim3;
      }

      this.api.updateProduct(updateParams).subscribe(
        response => {
        },
        err => {
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
    if (this.productShape == 0) {
      swal('Oops...', 'Product must be defined before adding elements!', 'error');

      return false;
    }
    this.addElementModal.show();
  }

  refreshViewModel() {
    this.api.getProductViewModel(this.study.ID_PROD).subscribe(
      (response: ViewProduct) => {
        localStorage.setItem('productView', JSON.stringify(response));
        this.elements = response.elements;
        this.product = response.product;
        this.prodDim2 = response.specificDimension;
        if (this.elements.length > 0) {
          this.productShape = this.elements[0].ID_SHAPE;
          localStorage.setItem('productShape', this.productShape.toString());
          this.prodDim1 = Number(Number(this.elements[0].SHAPE_PARAM1).toFixed(3));
          this.prodDim3 = Number(Number(this.elements[0].SHAPE_PARAM3).toFixed(3));

          this.productForm.shape = this.productShape;
          this.productForm.dim1 = this.prodDim1;
          this.productForm.dim3 = this.prodDim3;
          this.productForm.name = this.product.PRODNAME;
        } else {
          localStorage.removeItem('productShape');
        }
      }
    );
  }

  hasDim1() {
    return (this.productShape != this.shapeNames.SLAB && this.productShape != this.shapeNames.SPHERE);
  }

  hasDim3() {
    return (this.productShape == this.shapeNames.REC_LAY 
      || this.productShape == this.shapeNames.REC_STAND || this.productShape == this.shapeNames.BREAD);
  }

  onAddElement() {
    let params: ApiService.AppendElementsToProductParams = {
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

    this.api.appendElementsToProduct(params).subscribe( data => {
      this.addElementModal.hide();
      this.refreshViewModel();
    });
  }

  onEditProductModalShow(eventType: string, event) {
    if (this.components.length === 0) {
      this.api.findComponents({}).subscribe(
        data => {
          this.components = data;
          this.laddaAddComponent = false;
        }
      );
    } else {
      this.laddaAddComponent = false;
    }
  }

  onRemoveElement(element: ProductElmt) {
    this.api.removeProductElement({
      id: this.product.ID_PROD,
      elementId: element.ID_PRODUCT_ELMT
    }).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {

      }
    );
  }

  onEditElement(element: ProductElmt) {
    this.elementForm.computed_mass = Number(Number(element.PROD_ELMT_WEIGHT).toPrecision(3));
    this.elementForm.real_mass = Number(Number(element.PROD_ELMT_REALWEIGHT).toPrecision(3));
    this.elementForm.description = element.PROD_ELMT_NAME;
    this.elementForm.specific_dim = Number(Number(element.SHAPE_PARAM2).toPrecision(3));
    this.editCompModal.show();
  }

  onMoveUpElement(element: ProductElmt) {
    this.api.productElementMoveUp(element.ID_PRODUCT_ELMT).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {

      }
    );
  }

  onMoveDownElement(element: ProductElmt) {
    this.api.productElementMoveDown(element.ID_PRODUCT_ELMT).subscribe(
      response => {
        this.refreshViewModel();
      },
      err => {

      }
    );
  }
}
