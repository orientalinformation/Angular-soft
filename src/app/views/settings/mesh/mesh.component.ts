import { Component, OnInit } from '@angular/core';
import { MeshParamDef } from '../../../api/models/mesh-param-def';
import { ApiService } from '../../../api/services';
import { AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { Units } from '../../../api/models';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-mesh',
  templateUrl: './mesh.component.html',
  styleUrls: ['./mesh.component.scss']
})
export class MeshComponent implements OnInit, AfterViewInit {

  public meshparamdef: MeshParamDef;
  public laddaSavingMesh = false;
  public isLoading = false;
  public listUnits: Array<Units>;
  public meshesSymbol = '';


  constructor(private api: ApiService, private toastr: ToastrService, private translate: TranslateService) {
   }

  ngOnInit() {
    this.isLoading = true;
    this.listUnits = JSON.parse(localStorage.getItem('UnitUser'));

    for (let i = 0 ; i < this.listUnits.length ; i++) {
      if (Number(this.listUnits[i].TYPE_UNIT) === 20) {
        this.meshesSymbol = this.listUnits[i].SYMBOL;
      }
    }
  }

  ngAfterViewInit() {
    this.isLoading = true;
    this.api.getMyMeshParamDef().subscribe(
      data => {
        data.MESH_1_SIZE = Number(data.MESH_1_SIZE);
        data.MESH_2_SIZE = Number(data.MESH_2_SIZE);
        data.MESH_3_SIZE = Number(data.MESH_3_SIZE);
        this.meshparamdef = data;
        this.isLoading = false;
     }
    );
  }

  saveMyMeshParamDef() {
    if (isNullOrUndefined(this.meshparamdef.MESH_1_SIZE) || String(this.meshparamdef.MESH_1_SIZE) === ''
    || isNaN(this.meshparamdef.MESH_1_SIZE )) {
      this.toastr.error(this.translate.instant('Please specify Dimension 1'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.meshparamdef.MESH_2_SIZE) || String(this.meshparamdef.MESH_2_SIZE) === ''
    || isNaN(this.meshparamdef.MESH_2_SIZE )) {
      this.toastr.error(this.translate.instant('Please specify Dimension 2'), 'Error');
      return;
    }

    if (isNullOrUndefined(this.meshparamdef.MESH_3_SIZE) || String(this.meshparamdef.MESH_3_SIZE) === ''
    || isNaN(this.meshparamdef.MESH_3_SIZE )) {
      this.toastr.error(this.translate.instant('Please specify Dimension 3'), 'Error');
      return;
    }

    this.laddaSavingMesh = true;
    this.api.saveMyMeshParamDef({
      dim1: Number(this.meshparamdef.MESH_1_SIZE),
      dim2: Number(this.meshparamdef.MESH_2_SIZE),
      dim3: Number(this.meshparamdef.MESH_3_SIZE)
    }).subscribe(
      res => {
        if (res === 1) {
          this.toastr.success(this.translate.instant('Save mesh setting completed'), 'successfully');
        } else {
          this.toastr.error(this.translate.instant(res.Message), 'Error');
        }
      },
      err => {
        this.laddaSavingMesh = false;
        // console.log(err);
      },
      () => {
        this.laddaSavingMesh = false;
      }
    );
  }
}
