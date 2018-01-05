import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Study, ViewProduct } from '../../../api/models';
import { ApiService } from '../../../api/services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, AfterContentChecked {
  public study: Study;
  public productShape: number;
  public productView: ViewProduct;
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    this.study = JSON.parse(localStorage.getItem('study'));

    console.log(this.study.OPTION_CRYOPIPELINE);

    if (!this.study.OPTION_CRYOPIPELINE) {
      swal('Oops..', 'This study does not have enabled CryoPipeline calculation option', 'error');
      this.router.navigate(['/input/objectives']);
    }

    this.productShape = Number(localStorage.getItem('productShape'));
    this.productView = JSON.parse(localStorage.getItem('productView'));
    if (this.productShape == 0 || !this.productView.elements || this.productView.elements.length == 0) {
      swal('Oops..', 'Please define product along with elements first', 'error');
      this.router.navigate(['/input/product']);
    }
  }

}
