import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PreliminaryComponent } from './preliminary/preliminary.component';
import { SizingComponent } from './sizing/sizing.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'preliminary',
        pathMatch: 'full',
      },
      {
        path: 'preliminary',
        component: PreliminaryComponent
      },
      {
        path: 'sizing',
        component: SizingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }
