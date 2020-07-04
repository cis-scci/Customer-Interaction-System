import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealersComponent } from '../dealers/dealers.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dealers'
    },
    component: DealersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealersRoutingModule { }
