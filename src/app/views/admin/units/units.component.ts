import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit, AfterViewInit {
  @ViewChild('modalValuePrice') public modalValuePrice: ModalDirective;
  @ViewChild('modalValueUnit') public modalValueUnit: ModalDirective;
  constructor(private api: ApiService, private translate: TranslateService) { }

  public priceMoneySelect;
  public kernelMonetary;
  public monetary;
  public listUnit;
  public symbolSelectCoeffA: Array<any> = [];
  public symbolSelectCoeffB: Array<any> = [];
  public modifyPrice: number;
  public showModifyPrice: boolean;
  public showNewPrice: boolean;
  public priceText;
  public priceSymbol;
  public priceTextNew: string;
  public priceSymbolNew: string;

  ngOnInit() {
    this.modifyPrice = 1;
    this.showModifyPrice = true;
    this.showNewPrice = false;
    this.priceTextNew = '';
    this.priceSymbolNew = '';
  }

  ngAfterViewInit() {
    this.refeshView();
  }
  refeshView() {
    this.api.units().subscribe(
      data => {
        this.kernelMonetary = data.kernelMonetary;
        this.priceMoneySelect = data.kernelMonetary.ID_MONETARY_CURRENCY;
        this.monetary = data.monetary;
        this.listUnit = data.listUnit;
        for (let i = 0; i < Object.keys(this.listUnit).length; i++) {
          this.symbolSelectCoeffA.push(this.listUnit[i]['COEFF_A']);
          this.symbolSelectCoeffB.push(this.listUnit[i]['COEFF_B']);
        }
      }
    );
  }
  loadSymbol(i, symbol) {
    const symbolSelected = this.listUnit[i].symbolSelect;
    for (let j = 0; j < Object.keys(symbolSelected).length; j++) {
      if (symbolSelected[j]['SYMBOL'] == symbol) {
        this.symbolSelectCoeffA[i] = symbolSelected[j]['COEFF_A'];
        this.symbolSelectCoeffB[i] = symbolSelected[j]['COEFF_B'];
      }
    }
  }
  onModalValuePrice() {
    console.log(this.priceMoneySelect);
    this.api.getMonetaryCurrencyById(this.priceMoneySelect).subscribe(
      data => {
        console.log(this.priceText);
        this.priceText = data.MONEY_TEXT;
        this.priceSymbol = data.MONEY_SYMB;
      }
    );
    this.modalValuePrice.show();
  }
  showPriceForm(value) {
    if (value == 'modify') {
      this.showModifyPrice = true;
      this.showNewPrice = false;
    } else {
      this.showModifyPrice = false;
      this.showNewPrice = true;
    }
  }
  savePrice() {
    console.log(this.modifyPrice);
    if (this.modifyPrice == 1) {
      if (this.priceText == '') {
        swal('Oops..', this.translate.instant('Enter a value in Text !'), 'error');
      } else if (this.priceSymbol == '') {
        swal('Oops..', this.translate.instant('Enter a value in Symbol !'), 'error');
      }
      const params = {
        ID_MONETARY_CURRENCY: this.priceMoneySelect,
        MONEY_TEXT: this.priceText,
        MONEY_SYMB: this.priceSymbol
      };
      this.api.saveMonetaryCurrency(params).subscribe(
        data => {
          this.showModifyPrice = true;
          this.showNewPrice = false;
          this.modalValuePrice.hide();
          this.refeshView();
        }
      );
    }
    if (this.modifyPrice == 0) {
      if (this.priceTextNew == '') {
        swal('Oops..', this.translate.instant('Enter a value in Text !'), 'error');
      } else if (this.priceSymbolNew == '') {
        swal('Oops..', this.translate.instant('Enter a value in Symbol !'), 'error');
      }
      const params = {
        MONEY_TEXT: this.priceTextNew,
        MONEY_SYMB: this.priceSymbolNew
      };
      this.api.createMonetaryCurrency(params).subscribe(
        data => {
          this.modifyPrice = 1;
          this.showModifyPrice = true;
          this.showNewPrice = false;
          this.modalValuePrice.hide();
          this.refeshView();
        }
      );
    }
  }
}
