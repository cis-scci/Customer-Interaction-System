import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:''
    },
    children:[

      {
        path:'',
        component: SignUpComponent
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
