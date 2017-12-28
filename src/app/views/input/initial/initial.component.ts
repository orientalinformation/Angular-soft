import { Component, OnInit } from '@angular/core';
import { AfterViewInit, AfterContentChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiService } from '../../../api/services/api.service';
import { Study, Product, ViewProduct, ViewMesh } from '../../../api/models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit, AfterContentChecked, AfterViewInit {
  public study: Study;
  public productShape: number;
  public productView: ViewProduct;
  public meshView: ViewMesh;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = {
      elements: []
    };
    this.meshView = new ViewMesh();
  }

  ngAfterViewInit() {
    this.api.getMeshView(this.productView.product.ID_PROD).subscribe(
      (resp: ViewMesh) => {
        // this.meshView = resp;
      },
      (err) => {
        // swal('Oops..', 'Error getting mesh view', 'error');
      }
    );
  }

  ngAfterContentChecked() {
    this.study = JSON.parse(localStorage.getItem('study'));
    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = JSON.parse(localStorage.getItem('productView'));
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      swal('Oops..', 'Please define product along with elements first', 'error');
      this.router.navigate(['/input/product']);
      return false;
    }
  }

}
