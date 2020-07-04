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
      title: 'main'
    },
    component: PrimaryLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
      },
      {
        path: 'dealers',
        loadChildren: () => import('./modules/dealers/dealers.module').then(m => m.DealersModule)
      }
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
