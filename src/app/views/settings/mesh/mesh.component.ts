import { Component, OnInit } from '@angular/core';
import { MeshParamDef } from '../../../api/models/mesh-param-def';
import { ApiService } from '../../../api/services';
import { AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-mesh',
	templateUrl: './mesh.component.html',
	styleUrls: ['./mesh.component.scss']
})
export class MeshComponent implements OnInit, AfterViewInit {

	public meshparamdef: MeshParamDef;

	constructor(private api: ApiService) { }

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.api.getMyMeshParamDef().subscribe(
			data => {
				data.MESH_1_SIZE = Number(Number(data.MESH_1_SIZE).toPrecision(3));
				data.MESH_2_SIZE = Number(Number(data.MESH_2_SIZE).toPrecision(3));
				data.MESH_3_SIZE = Number(Number(data.MESH_3_SIZE).toPrecision(3));
				this.meshparamdef = data;
			}
		);
	}

	saveMyMeshParamDef() {
		this.api.saveMyMeshParamDef({
			dim1: Number(this.meshparamdef.MESH_1_SIZE),
			dim2: Number(this.meshparamdef.MESH_2_SIZE),
			dim3: Number(this.meshparamdef.MESH_3_SIZE)
		}).subscribe(
			response => {
				console.log(response);
			},
			err => {
			}
			);
	}
}
