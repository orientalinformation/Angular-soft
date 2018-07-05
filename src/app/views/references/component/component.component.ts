import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { ReferencedataService } from '../../../api/services/referencedata.service';
import { ApiService } from '../../../api/services';
import { Translation, ViewComponent, VComponent, ViewTemperature, MyComponent, Compenth, Study, Units } from '../../../api/models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { isNumber, isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Math } from 'three';
import { isNullOrUndefined } from 'util';
import { User } from '../../../api/models/user';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'ComponentFilter' })
export class ComponentFilterPipe implements PipeTransform {
  public transform(values: VComponent[], filter: string): any[] {
    if (!values || !values.length) {
      return [];
    }
    if (!filter) {
      return values;
    }

    return values.filter(
      v => v.LABEL.toLowerCase().indexOf(
        filter.toLowerCase()) >= 0);
  }
}

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  @ViewChild('modalFreezetemper') public modalFreezetemper: ModalDirective;
  @ViewChild('modalDeleteComponent') public modalDeleteComponent: ModalDirective;
  @ViewChild('modalSaveAsComponent') public modalSaveAsComponent: ModalDirective;
  @ViewChild('modalAddComponent') modalAddComponent;
  @ViewChild('displayCTComponent') displayCTComponent;
  public activePageComponent = '';
  public listFamily: Object;
  public listSubFamily: Object;
  public dataComponent: ViewComponent;
  public components: MyComponent;
  public fieldArray: Array<ViewTemperature>;
  public newAttribute: any = {};
  public isLoading = false;
  public selectComponent: VComponent;
  public filterString = '';
  public laddaIsCalculating = false;
  public laddaIsFreeze = false;
  public compenths: Array<Compenth>;
  public dataCompenth: Compenth;
  public total = 0;

  public generatedData: {
    isCalculated?: boolean,
    idComp?: number,
  };
  public checkHideInfo = false;
  public checkActiveComp = 0;
  public temperatureSymbol = '';
  public timeSymbol = '';
  public meshesSymbol = '';
  public enthalpySymbol = '';
  public conductivitySymbol = '';
  public densitySymbol = '';
  public study: Study;
  public listUnits: Array<Units>;
  public checkBackStudy = 0;
  public userLogon: User;
  public idCompInput = 0;
  public params: ApiService.AppendElementsToProductParams;
  public checkCalculate = false;

  constructor(private api: ApiService, private apiReference: ReferencedataService,
    private router: Router, private toastr: ToastrService, private translate: TranslateService) {
      localStorage.setItem('CompCurr', '');
      this.userLogon = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    const idCompInput2 = localStorage.getItem('IdCompInput');
    if (idCompInput2 !== 'null') {
      this.params = JSON.parse(localStorage.getItem('paramsCompInput'));
      this.idCompInput = Number(idCompInput2);
      this.apiReference.getComponentById(Number(idCompInput2)).subscribe(
        data => {
          localStorage.setItem('CompCurr', JSON.stringify(data));
          this.onGetTemperature(data);
        },
        err => {
          console.log(err);
        },
        () => {
          localStorage.setItem('IdCompInput', null);
          this.checkBackStudy = 1;
        }
      );
    }

    this.activePageComponent = 'new';
    this.isLoading = true;
    this.getDataComponent(0);
    this.getMyComponent();
    // this.generatedData = JSON.parse(localStorage.getItem('generatedData'));
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));

    if (this.listUnits) {

      for (let i = 0; i < this.listUnits.length; i++) {

        if (Number(this.listUnits[i].TYPE_UNIT) === 8) {
          this.temperatureSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 5) {
          this.timeSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 20) {
          this.meshesSymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 9) {
          this.enthalpySymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 10) {
          this.conductivitySymbol = this.listUnits[i].SYMBOL;
        }

        if (Number(this.listUnits[i].TYPE_UNIT) === 7) {
          this.densitySymbol = this.listUnits[i].SYMBOL;
        }
      }
    }
  }

  openNewComponent() {
    this.hideAllPageComponent();
    const newC = <HTMLElement>document.getElementById('page-new-component');
    this.activePageComponent = 'new';
    newC.style.display = 'block';
  }

  openDataGenerateComponent() {
    this.hideAllPageComponent();
    const dataGen = <HTMLElement>document.getElementById('page-datagenerated-component');
    dataGen.style.display = 'block';
    this.activePageComponent = 'gen';
  }

  hideAllPageComponent() {
    const newC = <HTMLElement>document.getElementById('page-new-component');
    const dataGen = <HTMLElement>document.getElementById('page-datagenerated-component');
    newC.style.display = 'none';
    dataGen.style.display = 'none';
  }

  getDataComponent(compfamily) {
    this.apiReference.getDataComponent(compfamily).subscribe(
      data => {
        // console.log(data.release);
        this.dataComponent = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  changCompFamily(compfamily) {
    this.apiReference.getDataSubFamily(compfamily).subscribe(
      data => {
        this.dataComponent.subFamily = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  getMyComponent() {
    this.isLoading = true;
    this.apiReference.getMyComponent().subscribe(
      data => {
        for (let i = 0; i < data.others.length ; i++) {

          if (Number(data.others[i].COMP_RELEASE) === 7) {
            data.others[i].LABEL = data.others[i].LABEL + ' - v' + data.others[i].COMP_VERSION + ' - (@)';
          } else {
            data.others[i].LABEL = data.others[i].LABEL + ' - v' + data.others[i].COMP_VERSION;
          }
        }
        this.components = data;
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        if (localStorage.getItem('CompCurr') !== '') {
          const compCurr = JSON.parse(localStorage.getItem('CompCurr'));
          this.checkActiveComp = Number(compCurr.ID_COMP);
          this.selectComponent = compCurr;
          // console.log(this.selectComponent);
        }
      }
    );
  }

  onSelectComponent(comp) {
    localStorage.setItem('CompCurr', '');
    this.checkActiveComp = 0;
    this.selectComponent = comp;
    this.checkHideInfo = false;
  }

  onGetTemperature(comp) {
    this.apiReference.getTemperaturesByIdComp(comp.ID_COMP).subscribe(
      data => {
        this.fieldArray = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  deleteComponent(comp) {
    swal({
      title: this.translate.instant('Are you sure?'),
      text: this.translate.instant('You won`t be able to revert this!'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('Yes, delete it!')
    }).then((result) => {
      if (result.value) {
        this.apiReference.deleteComponent(comp.ID_COMP).subscribe(
          response => {
            if (response === 1) {
              this.toastr.success(this.translate.instant('Delete component'), 'successfully');
              this.checkHideInfo = true;
            } else {
              this.toastr.error(this.translate.instant('Delete component'), 'Error');
            }
          },
          err => {
            console.log(err);
          },
          () => {
            this.refrestComponent();
          }
        );
      }
    });
  }

  onResetData() {
    this.fieldArray = [];
  }

  addFieldValue() {
    if (isNullOrUndefined(this.newAttribute.temperature) || String(this.newAttribute.temperature) === ''
    || isNaN(this.newAttribute.temperature)) {
      this.toastr.error(this.translate.instant('Please specify Temperature'), 'Error');
      return;
    }

    for (let i = 0; i < this.fieldArray.length; i++) {
      const element = this.fieldArray[i].temperature;
      if (Number(element) === Number(this.newAttribute.temperature)) {
        this.toastr.error(this.translate.instant('Temperature already exists !'), 'Error');
        return;
      }
    }

    this.apiReference.checkTemperature(this.newAttribute.temperature).subscribe(
      res => {
        if (res === 1) {
          this.newAttribute.temperature = Number(this.newAttribute.temperature).toFixed(2);
          this.fieldArray.push(this.newAttribute);
          this.newAttribute = {};
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  checkDataComponent(comp, check) {
    if (check === 2 || check === 3) {
      comp.COMP_NAME = comp.LABEL;
    }

    if (isNullOrUndefined(comp.COMP_NAME) || String(comp.COMP_NAME) === ''
    || isNumber(comp.COMP_NAME)) {
      this.toastr.error(this.translate.instant('Please specify Component name'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.COMP_VERSION) || String(comp.COMP_VERSION) === ''
    || isNaN(comp.COMP_VERSION)) {
      this.toastr.error(this.translate.instant('Please specify Version'), 'Error');
      return;
    }

    if (Number(comp.PRODUCT_TYPE) === 0) {
      this.toastr.error(this.translate.instant('Please select the component`s family'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.FREEZE_TEMP) || String(comp.FREEZE_TEMP) === ''
    || isNaN(comp.FREEZE_TEMP)) {
      this.toastr.error(this.translate.instant('Please specify Freeze temperature'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.WATER) || String(comp.WATER) === ''
    || isNaN(comp.WATER)) {
      this.toastr.error(this.translate.instant('Please specify Water'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.PROTID) || String(comp.PROTID) === ''
    || isNaN(comp.PROTID)) {
      this.toastr.error(this.translate.instant('Please specify Protein & dry material	'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.LIPID) || String(comp.LIPID) === ''
    || isNaN(comp.LIPID)) {
      this.toastr.error(this.translate.instant('Please specify Lipid	'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.GLUCID) || String(comp.GLUCID) === ''
    || isNaN(comp.GLUCID)) {
      this.toastr.error(this.translate.instant('Please specify Glucid	'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.SALT) || String(comp.SALT) === ''
    || isNaN(comp.SALT)) {
      this.toastr.error(this.translate.instant('Please specify Salt	'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.AIR) || String(comp.AIR) === ''
    || isNaN(comp.AIR)) {
      this.toastr.error(this.translate.instant('Please specify Air (volume)	'), 'Error');
      return;
    }

    if (isNullOrUndefined(comp.NON_FROZEN_WATER) || String(comp.NON_FROZEN_WATER) === ''
    || isNaN(comp.NON_FROZEN_WATER)) {
      this.toastr.error(this.translate.instant('Please specify Unfreezable water	'), 'Error');
      return;
    }

    if (check === 3) {
      if (this.fieldArray.length <= 0) {
        this.toastr.error(this.translate.instant('Please enter some temperature	'), 'Error');
        return;
      }
    }

    this.apiReference.checkSaveDataComponent({
      COMP_NAME: comp.COMP_NAME,
      COMP_VERSION: comp.COMP_VERSION,
      FREEZE_TEMP: comp.FREEZE_TEMP,
      WATER: comp.WATER,
      PROTID: comp.PROTID,
      LIPID: comp.LIPID,
      GLUCID: comp.GLUCID,
      SALT: comp.SALT,
      AIR: comp.AIR,
      NON_FROZEN_WATER: comp.NON_FROZEN_WATER,
      check: check
    }).subscribe(
      (res) => {
        if (res === 1) {
          if (check === 0) {
            this.saveDataComponent();
          }

          if (check === 1) {
            this.runCalculateFreeze();
          }

          if (check === 2) {
            if (Number(this.selectComponent.COMP_RELEASE) === 6) {
              this.toastr.error(this.translate.instant('Please awake component!'), 'Error');
              return;
            }
            this.runSelectCalculateFreeze(this.selectComponent);
          }
          if (check === 3) {
            this.runCalculate(this.selectComponent);

            if (this.checkBackStudy === 1) {
              if (this.idCompInput !== 0) {
                this.api.appendElementsToProduct(this.params).subscribe(
                  data => {
                    // code
                  });
              }
            }
          }
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  saveDataComponent() {
    this.apiReference.saveDataComponent({
      PRODUCT_TYPE: this.dataComponent.PRODUCT_TYPE,
      SUB_TYPE: this.dataComponent.SUB_TYPE,
      NATURE_TYPE: this.dataComponent.NATURE_TYPE,
      CONDUCT_TYPE: this.dataComponent.CONDUCT_TYPE,
      FATTYPE: this.dataComponent.FATTYPE,
      COMP_NAME: this.dataComponent.COMP_NAME,
      WATER: this.dataComponent.WATER,
      AIR: this.dataComponent.AIR,
      CLASS_TYPE: this.dataComponent.CLASS_TYPE,
      COMP_COMMENT: this.dataComponent.COMP_COMMENT,
      COMP_VERSION: this.dataComponent.COMP_VERSION,
      FREEZE_TEMP: this.dataComponent.FREEZE_TEMP,
      PROTID: this.dataComponent.PROTID,
      LIPID: this.dataComponent.LIPID,
      GLUCID: this.dataComponent.GLUCID,
      SALT: this.dataComponent.SALT,
      ID_COMP: this.dataComponent.ID_COMP,
      NON_FROZEN_WATER: this.dataComponent.NON_FROZEN_WATER,
      release: this.dataComponent.release,
      Temperatures: this.fieldArray,
    }).subscribe(
      response => {
        let success = true;
        // console.log(response);

        if (response === -2) {
          success = false;
          this.toastr.error(this.translate.instant('Create component'), this.translate.instant('Please, select the components family!'));
          return;
        }

        if (response === -3) {
          success = false;
          this.toastr.error(this.translate.instant('Create component'), this.translate.instant('Component name can not be null!'));
          return;
        }

        if (response === -4) {
          success = false;
          this.toastr.error(this.translate.instant('Create component'), this.translate.instant('Name and version already in use!'));
          return;
        }

        if (success) {
          localStorage.setItem('CompCurr', JSON.stringify(response));
          this.toastr.success(this.translate.instant('Create component'), 'successfully');
          this.modalAddComponent.hide();
          this.refrestComponent();
          this.checkHideInfo = false;
          this.getDataComponent(0);
        } else {
          this.toastr.error(this.translate.instant('Create component'), 'Error');
        }
      },
      err => {

      },
      () => {
      }
    );
  }

  saveAsComponent(comp) {
    this.apiReference.saveDataComponent({
      COMP_NAME_NEW: this.dataComponent.COMP_NAME_NEW,
      COMP_VERSION_NEW: this.dataComponent.COMP_VERSION_NEW,
      PRODUCT_TYPE: comp.CLASS_TYPE,
      SUB_TYPE: comp.SUB_FAMILY,
      NATURE_TYPE: comp.COMP_NATURE,
      CONDUCT_TYPE: comp.COND_DENS_MODE,
      FATTYPE: comp.FAT_TYPE,
      COMP_NAME: comp.LABEL,
      AIR: comp.AIR,
      WATER: comp.WATER,
      CLASS_TYPE: comp.CLASS_TYPE,
      COMP_COMMENT: comp.COMP_COMMENT,
      COMP_VERSION: comp.COMP_VERSION,
      FREEZE_TEMP: comp.FREEZE_TEMP,
      PROTID: comp.PROTID,
      ID_COMP: comp.ID_COMP,
      LIPID: comp.LIPID,
      GLUCID: comp.GLUCID,
      SALT: comp.SALT,
      NON_FROZEN_WATER: comp.NON_FROZEN_WATER,
      release: this.dataComponent.release,
      COMP_RELEASE: comp.COMP_RELEASE,
      Temperatures: this.fieldArray,
    }).subscribe(
      response => {
        let success = true;

        if (response === -2) {
          success = false;
          this.toastr.error(this.translate.instant('Save as'), this.translate.instant('Please, select the components family!'));
          return;
        }

        if (response === -3) {
          success = false;
          this.toastr.error(this.translate.instant('Save as'), this.translate.instant('Component name can not be null!'));
          return;
        }

        if (response === -4) {
          success = false;
          this.toastr.error(this.translate.instant('Save as'), this.translate.instant('Name and version already in use!'));
          return;
        }

        if (success) {
          localStorage.setItem('CompCurr', JSON.stringify(response));
          this.toastr.success(this.translate.instant('Save as component'), 'successfully');
          this.modalSaveAsComponent.hide();
          this.refrestComponent();
          this.checkHideInfo = false;
          this.dataComponent.COMP_NAME_NEW = '';
          this.dataComponent.COMP_VERSION_NEW = 0;
        } else {
          this.toastr.error(this.translate.instant('Save as component'), 'Error');
        }
      },
      err => {

      },
      () => {
      }
    );
  }

  getGeneratedData(comp) {
    this.apiReference.getCompenthsByIdComp(comp.ID_COMP).subscribe(
      data => {
        // console.log(data);
        this.compenths = data;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  getElementCompenth(compenth) {
    this.apiReference.getCompenthById(compenth.ID_COMPENTH).subscribe(
      data => {
        data.ID_COMP = Number(data.ID_COMP);
        this.dataCompenth = data;
        this.displayCTComponent.show();
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  refreshCompenth(id) {
    this.apiReference.getCompenthsByIdComp(id).subscribe(
      data => {
        this.compenths = data;
      }
    );
  }

  updateCompenth(compenth) {
    if (isNullOrUndefined(this.dataCompenth.COMPENTH) || String(this.dataCompenth.COMPENTH) === ''
    || isNaN(this.dataCompenth.COMPENTH)) {
      this.toastr.error(this.translate.instant('Please specify Enthalpy	'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.dataCompenth.COMPCOND) || String(this.dataCompenth.COMPCOND) === ''
    || isNaN(this.dataCompenth.COMPCOND)) {
      this.toastr.error(this.translate.instant('Please specify Conductivity	'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.dataCompenth.COMPDENS) || String(this.dataCompenth.COMPDENS) === ''
    || isNaN(this.dataCompenth.COMPDENS)) {
      this.toastr.error(this.translate.instant('Please specify Density	'), 'Error');
      return;
    }

    this.apiReference.updateCompenth({
      ID_COMPENTH: this.dataCompenth.ID_COMPENTH,
      ID_COMP: Number(this.dataCompenth.ID_COMP),
      COMPTEMP: this.dataCompenth.COMPTEMP,
      COMPENTH: this.dataCompenth.COMPENTH,
      COMPCOND: this.dataCompenth.COMPCOND,
      COMPDENS: this.dataCompenth.COMPDENS,
    }).subscribe(
      response => {
        if (response === 1) {
          this.toastr.success('update compenth', 'successfully');
          this.refreshCompenth(Number(this.dataCompenth.ID_COMP));
          this.displayCTComponent.hide();
        } else {
          this.toastr.error(this.translate.instant('update compenth'), 'ERROR');
        }
      }
    );
  }

  awakeComponent(comp, type: number) {
    this.apiReference.saveDataComponent({
      COMP_NAME_NEW: this.dataComponent.COMP_NAME_NEW,
      COMP_VERSION_NEW: this.dataComponent.COMP_VERSION_NEW,
      PRODUCT_TYPE: comp.CLASS_TYPE,
      SUB_TYPE: comp.SUB_FAMILY,
      NATURE_TYPE: comp.COMP_NATURE,
      CONDUCT_TYPE: comp.COND_DENS_MODE,
      FATTYPE: comp.FAT_TYPE,
      COMP_NAME: comp.LABEL,
      AIR: comp.AIR,
      WATER: comp.WATER,
      CLASS_TYPE: comp.CLASS_TYPE,
      COMP_COMMENT: comp.COMP_COMMENT,
      COMP_VERSION: comp.COMP_VERSION,
      FREEZE_TEMP: comp.FREEZE_TEMP,
      PROTID: comp.PROTID,
      LIPID: comp.LIPID,
      GLUCID: comp.GLUCID,
      ID_COMP: comp.ID_COMP,
      SALT: comp.SALT,
      NON_FROZEN_WATER: comp.NON_FROZEN_WATER,
      release: this.dataComponent.release,
      Temperatures: this.fieldArray,
      TYPE_COMP: type
    }).subscribe(
      response => {
        let success = true;

        if (response === -2) {
          success = false;
          this.toastr.error(this.translate.instant('Awake'), this.translate.instant('Please, select the components family!'));
          return;
        }

        if (response === -3) {
          success = false;
          this.toastr.error(this.translate.instant('Awake'), this.translate.instant('Component name can not be null!'));
          return;
        }

        if (response === -4) {
          success = false;
          this.toastr.error(this.translate.instant('Awake'), this.translate.instant('Name and version already in use!'));
          return;
        }

        if (success) {
          if (this.params) {
            this.params.componentId = response.ID_COMP;
          }

          localStorage.setItem('CompCurr', JSON.stringify(response));
          this.toastr.success(this.translate.instant('Awake component'), 'successfully');
          this.refrestComponent();
          this.checkHideInfo = false;
        } else {
          this.toastr.error(this.translate.instant('Awake component'), 'Error');
        }
      },
      err => {

      },
      () => {
      }
    );
  }

  refrestComponent() {
    this.getMyComponent();
  }

  runCalculateFreeze() {
    this.laddaIsFreeze = true;
    this.apiReference.calculateFreeze({
      PRODUCT_TYPE: this.dataComponent.PRODUCT_TYPE,
      SUB_TYPE: this.dataComponent.SUB_TYPE,
      NATURE_TYPE: this.dataComponent.NATURE_TYPE,
      CONDUCT_TYPE: this.dataComponent.CONDUCT_TYPE,
      FATTYPE: this.dataComponent.FATTYPE,
      COMP_NAME: this.dataComponent.COMP_NAME,
      AIR: this.dataComponent.AIR,
      CLASS_TYPE: this.dataComponent.CLASS_TYPE,
      COMP_COMMENT: this.dataComponent.COMP_COMMENT,
      COMP_VERSION: this.dataComponent.COMP_VERSION,
      FREEZE_TEMP: this.dataComponent.FREEZE_TEMP,
      WATER: this.dataComponent.WATER,
      PROTID: this.dataComponent.PROTID,
      LIPID: this.dataComponent.LIPID,
      GLUCID: this.dataComponent.GLUCID,
      SALT: this.dataComponent.SALT,
      NON_FROZEN_WATER: this.dataComponent.NON_FROZEN_WATER,
      release: this.dataComponent.release,
      Temperatures: this.fieldArray,
    }).subscribe(
      response => {
        this.laddaIsFreeze = false;
        let success = true;

        // console.log(response);

        if (response.CheckCalculate === -2) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Please, select the components family!'));
          return;
        }

        if (response.CheckCalculate === -3) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Component name can not be null!'));
          return;
        }

        if (response.CheckCalculate === -5) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Value out of range in' +
          'Composition total (90 : 110) !'));
          return;
        }

        if (response.CheckCalculate !== 0) {
          success = false;
        }

        if (success) {
          this.toastr.success('Freeze temperature', 'successfully');
        } else {
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Run freeze temperature false'));
        }
        if (response.VComponent) {
          localStorage.setItem('CompCurr', JSON.stringify(response.VComponent));
          this.checkHideInfo = false;
          this.refrestComponent();
          this.modalAddComponent.hide();
          this.getDataComponent(0);
        }
      },
      err => {
        this.laddaIsFreeze = false;
      },
      () => {
        this.laddaIsFreeze = false;
        this.checkCalculate = true;
      }
    );
  }

  runSelectCalculateFreeze(comp) {
    this.laddaIsFreeze = true;
    this.apiReference.calculateFreeze({
      PRODUCT_TYPE: comp.CLASS_TYPE,
      SUB_TYPE: comp.SUB_FAMILY,
      NATURE_TYPE: comp.COMP_NATURE,
      CONDUCT_TYPE: comp.COND_DENS_MODE,
      FATTYPE: comp.FAT_TYPE,
      COMP_NAME: comp.LABEL,
      AIR: comp.AIR,
      CLASS_TYPE: comp.CLASS_TYPE,
      COMP_COMMENT: comp.COMP_COMMENT,
      COMP_VERSION: comp.COMP_VERSION,
      FREEZE_TEMP: comp.FREEZE_TEMP,
      WATER: comp.WATER,
      PROTID: comp.PROTID,
      LIPID: comp.LIPID,
      GLUCID: comp.GLUCID,
      SALT: comp.SALT,
      NON_FROZEN_WATER: comp.NON_FROZEN_WATER,
      COMP_RELEASE: comp.COMP_RELEASE,
      Temperatures: this.fieldArray,
      ID_COMP: comp.ID_COMP,
      COMP_VERSION_NEW: -2
    }).subscribe(
      response => {
        // console.log(response);
        this.laddaIsFreeze = false;
        let success = true;

        if (response.CheckCalculate === -2) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Please, select the components family!'));
          return;
        }

        if (response.CheckCalculate === -3) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Component name can not be null!'));
          return;
        }

        if (response.CheckCalculate === -5) {
          success = false;
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Value out of range in '
          + 'Composition total (90 : 110) !'));
          return;
        }

        if (response.CheckCalculate !== 0) {
          success = false;
        }

        if (success) {
          this.toastr.success(this.translate.instant('Freeze temperature'), 'successfully');
        } else {
          this.toastr.error(this.translate.instant('Freeze temperature'), this.translate.instant('Run freeze temperature false'));
        }
        if (response.VComponent) {
          localStorage.setItem('CompCurr', JSON.stringify(response.VComponent));
          this.checkHideInfo = false;
          this.refrestComponent();
        }
      },
      err => {
        this.laddaIsFreeze = false;
      },
      () => {
        this.laddaIsFreeze = false;
      }
    );
  }

  runCalculate(comp) {
    this.laddaIsCalculating = true;
    this.apiReference.startFCCalculate({
      ID_COMP: comp.ID_COMP,
      PRODUCT_TYPE: comp.CLASS_TYPE,
      SUB_TYPE: comp.SUB_FAMILY,
      NATURE_TYPE: comp.COMP_NATURE,
      CONDUCT_TYPE: comp.COND_DENS_MODE,
      FATTYPE: comp.FAT_TYPE,
      COMP_NAME: comp.LABEL,
      COMP_RELEASE: comp.COMP_RELEASE,
      AIR: comp.AIR,
      WATER: comp.WATER,
      CLASS_TYPE: comp.CLASS_TYPE,
      COMP_COMMENT: comp.COMP_COMMENT,
      COMP_VERSION: comp.COMP_VERSION,
      FREEZE_TEMP: comp.FREEZE_TEMP,
      PROTID: comp.PROTID,
      LIPID: comp.LIPID,
      GLUCID: comp.GLUCID,
      SALT: comp.SALT,
      NON_FROZEN_WATER: comp.NON_FROZEN_WATER,
      Temperatures: this.fieldArray,
      COMP_VERSION_NEW: -2
    }).subscribe(
      response => {
        this.laddaIsCalculating = false;
        if (response === 0) {
          // localStorage.setItem('generatedData', JSON.stringify({ isCalculated: true, idComp: comp.ID_COMP}));
          this.checkCalculate = true;
          this.toastr.success(this.translate.instant('Calculation'), 'successfully');
        } else {
          this.toastr.error(this.translate.instant('Calculation'), 'ERROR!');
        }
      },
      err => {
        this.laddaIsCalculating = false;
      },
      () => {
        this.laddaIsCalculating = false;
        this.checkCalculate = true;
      }
    );
  }

  // by haidt
  comeBackStudy () {
    this.checkBackStudy = 0;
    this.router.navigate(['/input/product']);
  }

  comBackStudyNoAdd () {
    swal({
      title: this.translate.instant('Are you sure?'),
      text: this.translate.instant('Component was not generated, study calculation will not be possible.'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('Yes')
    }).then((result) => {
      if (result.value) {
        // swal(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // );

        this.checkBackStudy = 0;
        this.router.navigate(['/input/product']);
      }
    });
  }
}
