import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealersComponent } from '../dealers/dealers.component';
import { DealerDetailComponent} from './dealer-detail/dealer-detail.component';
import { ApprovalComponent } from './approval/approval.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title:''
    },
    children:[

      {
        path:'',
        component: DealersComponent
      },
      {
        path:':id/detail',
        component: DealerDetailComponent
      },
      {
        path:':id/:phone/approval',
        component: ApprovalComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealersRoutingModule { }
