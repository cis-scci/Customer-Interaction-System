import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryLayoutComponent } from './modules/layout/primary-layout/primary-layout.component';
import { AuthGuard } from './shared/gaurds/authgaurd/auth.gaurd';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    data: {
      title: 'login'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      }
    ]
  },

  {
    path: '',
    data: {
      title: 'dashboard'
    },
    component: PrimaryLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
      },
      {
        path: 'dealers',
        loadChildren: () => import('./modules/dealers/dealers.module').then(m => m.DealersModule)
      },
      {
        path: 'dealers/signup',
        loadChildren: () => import('./modules/sign-up/sign-up.module').then(m => m.SignUpModule)
      },
      {
        path: 'dealers/add/address/:id/:pincode',
        loadChildren: () => import('./modules/add-address/add-address.module').then(m => m.AddAddressModule)
      }
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
