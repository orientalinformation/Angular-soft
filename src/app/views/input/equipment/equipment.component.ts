import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  public  showTable = false;
  constructor() { }

  ngOnInit() {
  }

  showPageGas() {
    this.showTable = !this.showTable;
    const table = <HTMLElement> document.getElementById('tableGas');
    if (this.showTable) {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }
}
