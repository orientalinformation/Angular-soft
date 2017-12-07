import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
import { AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { Shape } from '../../../api/models/shape';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  public modalEditProduct;
  public availShapes = [];

  columns =
    [
      { text: 'First Name', columntype: 'textbox', datafield: 'firstname', width: 120 },
      { text: 'Last Name', datafield: 'lastname', columntype: 'textbox', width: 120 },
      { text: 'Product', datafield: 'productname', width: 170 },
      { text: 'In Stock', datafield: 'available', columntype: 'checkbox', width: 125 },
      { text: 'Quantity', datafield: 'quantity', width: 85, cellsalign: 'right', cellsformat: 'n2' },
      { text: 'Price', datafield: 'price', cellsalign: 'right', cellsformat: 'c2' }
    ];

  dropDownSource: string[] = ['First Name', 'Last Name', 'Product', 'Quantity', 'Price'];

  getAdapter = (): any => {
    const source: any = {
        localdata: [],
        datatype: 'array',
        datafields:
          [
            { name: 'firstname', type: 'string' },
            { name: 'lastname', type: 'string' },
            { name: 'productname', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' },
            { name: 'available', type: 'bool' }
          ],
        updaterow: (rowid: number, rowdata: any, commit: any): void => {
          // synchronize with the server - send update command
          // call commit with parameter true if the synchronization with the server is successful
          // and with parameter false if the synchronization failed.
          commit(true);
        }
      };

    const dataAdapter: any = new jqx.dataAdapter(source);

    return dataAdapter;
  }

  // tslint:disable-next-line:member-ordering
  dataAdapter = this.getAdapter();

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.api.getShapes().subscribe(
      data => this.availShapes = data
    );
  }
}
