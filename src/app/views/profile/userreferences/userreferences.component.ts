import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../../../shared/text.service';
import swal from 'sweetalert2';

import { ProfileService, ApiService } from '../../../api/services';
import { User, Translation, Constructors, Units, MonetaryCurrency, Langue, DefaultEquipment, Profile } from '../../../api/models';

@Component({
  selector: 'app-userreferences',
  templateUrl: './userreferences.component.html',
  styleUrls: ['./userreferences.component.scss']
})
export class UserreferencesComponent implements OnInit, AfterViewInit {
  @ViewChild('modalChangePassword') public modalChangePassword: ModalDirective;
  public isLoading = false;
  public isChange = false;
  public isSave = false;
  public userLogon: User;
  public pass = {
    oldPass: '',
    newPass: '',
    confPass: ''
  };
  public listEnergies: Translation;
  public listConstructors: Constructors;
  public listFamilies: Translation;
  public listOrigines: Translation;
  public listProcess: Translation;
  public listModels: Translation;
  public listUnits: Units;
  public listLang: Translation;
  public listMonetary: MonetaryCurrency;
  public langue: Langue;
  public defaultEquip: DefaultEquipment;
  public profile: Profile;

  constructor(private profileService: ProfileService, private toastr: ToastrService,
    private router: Router, private api: ApiService, private translate: TranslateService, private text: TextService) {
    this.userLogon = JSON.parse(localStorage.getItem('user'));
    this.langue = new Langue();
    this.defaultEquip = new DefaultEquipment();
   }

  ngOnInit() {
    this.isLoading = true;
    this.langue.langId = this.userLogon.CODE_LANGUE;
    this.langue.monetaryId = this.userLogon.ID_MONETARY_CURRENCY;
    this.defaultEquip.energyId = this.userLogon.USER_ENERGY;
    this.defaultEquip.construct = this.userLogon.USER_CONSTRUCTOR;
    this.defaultEquip.familyId = this.userLogon.USER_FAMILY;
    this.defaultEquip.stdId = this.userLogon.USER_ORIGINE;
    this.defaultEquip.batchProcess = this.userLogon.USER_PROCESS;
    this.defaultEquip.equipseriesId = this.userLogon.USER_MODEL;
  }

  ngAfterViewInit() {
    this.isLoading = true;
    const params: ApiService.GetSelectionCriteriaFilterParams = {
      energy: this.defaultEquip.energyId,
      manufacturer: this.defaultEquip.construct,
      sery: this.defaultEquip.familyId,
      origin: this.defaultEquip.stdId,
      process: this.defaultEquip.batchProcess,
      model: this.defaultEquip.equipseriesId
    };
    this.api.getSelectionCriteriaFilter(params).subscribe(
      data => {
        this.listEnergies = data.energies;
        this.listConstructors = data.manufacturer;
        this.listFamilies = data.series;
        this.listOrigines = data.origines;
        this.listProcess = data.processes;
        this.listModels = data.model;
      }
    );
    this.refrestListUnits();
    this.refrestListLang();
    this.refrestListMonetary();
  }

  select_energy() {
    this.defaultEquip.construct = '';
    this.defaultEquip.familyId = -1;
    this.defaultEquip.stdId = -1;
    this.defaultEquip.batchProcess = -1;
    this.defaultEquip.equipseriesId = -1;
    this.loadFilter();
  }

  select_manufacturer() {
    this.defaultEquip.familyId = -1;
    this.defaultEquip.stdId = -1;
    this.defaultEquip.batchProcess = -1;
    this.defaultEquip.equipseriesId = -1;
    this.loadFilter();
  }

  select_family() {
    this.defaultEquip.stdId = -1;
    this.defaultEquip.batchProcess = -1;
    this.defaultEquip.equipseriesId = -1;
    this.loadFilter();
  }

  select_origin() {
    this.defaultEquip.batchProcess = -1;
    this.defaultEquip.equipseriesId = -1;
    this.loadFilter();
  }

  select_process_type() {
    this.defaultEquip.equipseriesId = -1;
    this.loadFilter();
  }

  loadFilter() {
    const params: ApiService.GetSelectionCriteriaFilterParams = {
      energy: this.defaultEquip.energyId,
      manufacturer: this.defaultEquip.construct,
      sery: this.defaultEquip.familyId,
      origin: this.defaultEquip.stdId,
      process: this.defaultEquip.batchProcess,
      model: this.defaultEquip.equipseriesId
    };
    console.log(params);
    this.api.getSelectionCriteriaFilter(params).subscribe(
      data => {
        this.listEnergies = data.energies;
        this.listConstructors = data.manufacturer;
        this.listFamilies = data.series;
        this.listOrigines = data.origines;
        this.listProcess = data.processes;
        this.listModels = data.model;
      }
    );
  }

  changePassword() {
    if (this.pass.oldPass === '' || this.pass.oldPass === undefined) {
      swal('Warning', this.translate.instant('Please specify old password !'), 'warning');
      return;
    }
    if (this.pass.oldPass.length < 5 || this.pass.oldPass.length > 30) {
      swal('Warning', this.translate.instant('Please old password ( 5 : 30 )'), 'warning');
      return;
    }
    if (this.pass.newPass === '' || this.pass.newPass === undefined) {
      swal('Warning', this.translate.instant('Please specify new password !'), 'warning');
      return;
    }
    if (this.pass.newPass.length < 5 || this.pass.newPass.length > 30) {
      swal('Warning', this.translate.instant('Please new password ( 5 : 30 )'), 'warning');
      return;
    }
    if (this.pass.confPass === '' || this.pass.confPass === undefined) {
      swal('Warning', this.translate.instant('Please specify confirm password !'), 'warning');
      return;
    }
    if (this.pass.confPass.length < 5 || this.pass.confPass.length > 30) {
      swal('Warning', this.translate.instant('Please confirm password ( 5 : 30 )'), 'warning');
      return;
    }
    if (this.pass.newPass !== this.pass.confPass) {
      swal('Warning', this.translate.instant('Password was different to the confirm password!'), 'warning');
      return;
    }
    const body = {
      oldPass: this.pass.oldPass,
      newPass: this.pass.newPass
    };
    this.isChange = true;
    this.profileService.changePassword({
      id: this.userLogon.ID_USER,
      body: body
    }).subscribe(
      response => {
        let success = true;
        if (response === -1) {
          success = false;
        }

        if (success) {
          this.modalChangePassword.hide();
          this.toastr.success(this.translate.instant('Change password'), 'successfully');
          this.router.navigate(['/auth/signin']);
          this.pass = {
            oldPass: '',
            newPass: '',
            confPass: ''
          };
        } else {
          swal('Warning', this.translate.instant('Change password error!'), 'error');
        }
        this.isChange = false;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
    );
  }

  refrestListEnergies() {
    this.profileService.getEnergies()
      .subscribe(
      data => {
        this.listEnergies = data;
        // console.log(data);
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListConstructors() {
    this.profileService.getConstructors()
      .subscribe(
      data => {
        this.listConstructors = data;
        // console.log(data);
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListFamilies() {
    const dataSend = {
      idCooling: 0,
      manufacturerLabel: ''
    };
    this.profileService.getFamilies(dataSend)
      .subscribe(
      data => {
        this.listFamilies = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListOrigines() {
    const dataSend = {
      idCooling: 0,
      manufacturerLabel: '',
      idFamily: 0
    };
    this.profileService.getOrigines(dataSend)
      .subscribe(
      data => {
        this.listOrigines = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListProcessType() {
    const dataSend = {
      idCooling: 0,
      manufacturerLabel: '',
      idFamily: 0,
      idStd: 0
    };
    this.profileService.getProcesses(dataSend)
      .subscribe(
      data => {
        this.listProcess = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListModels() {
    const dataSend = {
      idCooling: 0,
      manufacturerLabel: '',
      idFamily: 0,
      idStd: 0,
      idProcess: 0
    };
    this.profileService.getModels(dataSend)
      .subscribe(
      data => {
        this.listModels = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListLang() {
    this.profileService.getLangue()
      .subscribe(
      data => {
        this.listLang = data;
      },
      err => {
        // console.log(err);
      },
      () => {

      }
      );
  }

  refrestListMonetary() {
    this.profileService.getMonetary()
      .subscribe(
      data => {
        this.listMonetary = data;
        this.isLoading = false;
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }

  refrestListUnits() {
    this.profileService.getUnits(this.userLogon.ID_USER)
      .subscribe(
      data => {
        this.listUnits = data;
        this.processNameUnits(this.listUnits);
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }

  processNameUnits(res) {
    for (let i = 0 ; i < res.length ; i++) {

      if (res[i].TYPE_UNIT === 1) { res[i].nameLabel = this.translate.instant('Fluid flow'); }

      if (res[i].TYPE_UNIT === 2) { res[i].nameLabel = this.translate.instant('Product flow'); }

      if (res[i].TYPE_UNIT === 3) { res[i].nameLabel = this.translate.instant('Length'); }

      if (res[i].TYPE_UNIT === 4) { res[i].nameLabel = this.translate.instant('Mass'); }

      if (res[i].TYPE_UNIT === 5) { res[i].nameLabel = this.translate.instant('Time'); }

      if (res[i].TYPE_UNIT === 6) { res[i].nameLabel = this.translate.instant('Specific Heat'); }

      if (res[i].TYPE_UNIT === 7) { res[i].nameLabel = this.translate.instant('Density'); }

      if (res[i].TYPE_UNIT === 8) { res[i].nameLabel = this.translate.instant('Temperature'); }

      if (res[i].TYPE_UNIT === 9) { res[i].nameLabel = this.translate.instant('Enthalpy'); }

      if (res[i].TYPE_UNIT === 10) { res[i].nameLabel = this.translate.instant('Conductivity'); }

      if (res[i].TYPE_UNIT === 11) { res[i].nameLabel = this.translate.instant('Losses in get cold (Line)'); }

      if (res[i].TYPE_UNIT === 12) { res[i].nameLabel = this.translate.instant('Permanent Heat losses (Line)'); }

      if (res[i].TYPE_UNIT === 13) { res[i].nameLabel = this.translate.instant('Convection speed'); }

      if (res[i].TYPE_UNIT === 14) { res[i].nameLabel = this.translate.instant('Convection coef'); }

      if (res[i].TYPE_UNIT === 15) { res[i].nameLabel = this.translate.instant('Pressure'); }

      if (res[i].TYPE_UNIT === 16) { res[i].nameLabel = this.translate.instant('Thickness packing'); }

      if (res[i].TYPE_UNIT === 17) { res[i].nameLabel = this.translate.instant('Line'); }

      if (res[i].TYPE_UNIT === 18) { res[i].nameLabel = this.translate.instant('LN2 tank capacity'); }

      if (res[i].TYPE_UNIT === 19) { res[i].nameLabel = this.translate.instant('Product dimension'); }

      if (res[i].TYPE_UNIT === 20) { res[i].nameLabel = this.translate.instant('Mesh cut'); }

      if (res[i].TYPE_UNIT === 21) { res[i].nameLabel = this.translate.instant('Equipment dimension'); }

      if (res[i].TYPE_UNIT === 22) { res[i].nameLabel = this.translate.instant('Carpet/Sieve width'); }

      if (res[i].TYPE_UNIT === 23) { res[i].nameLabel = this.translate.instant('Slopes position'); }

      if (res[i].TYPE_UNIT === 24) { res[i].nameLabel = this.translate.instant('Material Rise'); }

      if (res[i].TYPE_UNIT === 25) { res[i].nameLabel = this.translate.instant('CO2 tank capacity'); }

      if (res[i].TYPE_UNIT === 26) { res[i].nameLabel = this.translate.instant('Evaporation'); }

      if (res[i].TYPE_UNIT === 28) { res[i].nameLabel = this.translate.instant('Consumption unit'); }

      if (res[i].TYPE_UNIT === 29) { res[i].nameLabel = this.translate.instant('Consumption unit (LN2)'); }

      if (res[i].TYPE_UNIT === 30) { res[i].nameLabel = this.translate.instant('Consumption unit (CO2)'); }

      if (res[i].TYPE_UNIT === 31) { res[i].nameLabel = this.translate.instant('Heat losses per hour'); }

      if (res[i].TYPE_UNIT === 32) { res[i].nameLabel = this.translate.instant('Heat losses per hour (LN2)'); }

      if (res[i].TYPE_UNIT === 33) { res[i].nameLabel = this.translate.instant('Heat losses per hour (CO2)'); }

      if (res[i].TYPE_UNIT === 34) { res[i].nameLabel = this.translate.instant('Cooldown'); }

      if (res[i].TYPE_UNIT === 35) { res[i].nameLabel = this.translate.instant('Cooldown (LN2)'); }

      if (res[i].TYPE_UNIT === 36) { res[i].nameLabel = this.translate.instant('Cooldown (CO2)'); }

      if (res[i].TYPE_UNIT === 37) { res[i].nameLabel = this.translate.instant('unit of mass (consumption)'); }

      if (res[i].TYPE_UNIT === 38) { res[i].nameLabel = this.translate.instant('Product dimension - product chart'); }
    }
  }

  saveUnits() {
    const profile = {
      'Langue': this.langue,
      'DefaultEquipment': this.defaultEquip,
      'Units': this.listUnits
    };
    this.isSave = true;
    this.profileService.updateUnits({
      id: this.userLogon.ID_USER,
      body: profile
    }).subscribe(
      data => {
        localStorage.setItem('UnitUser', JSON.stringify(data));
        this.toastr.success(this.translate.instant('Update profile'), 'successfully');
        this.router.navigate(['/profile/userreferences']);
        this.refrestUser();
        this.isSave = false;
        this.profileService.getMonetaryUser(this.userLogon.ID_USER).subscribe(
          (res) => {
            localStorage.setItem('MoneratyUser', JSON.stringify(res));
            if (this.isSave === false) {
              location.reload();
            }
          }
        );
      },
      err => {
        console.log(err);
        this.isSave = false;
      },
      () => {
        this.isSave = false;
      }
      );
  }

  refrestUser() {
    this.api.getUser(this.userLogon.ID_USER).subscribe(
      data => {
        this.userLogon = data;
        localStorage.setItem('user', JSON.stringify(data));
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }
}
