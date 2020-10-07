import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAddressComponent } from './add-address/add-address.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:''
    },
    children:[

      {
        path:'',
        component: AddAddressComponent
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAddressRoutingModule { }
