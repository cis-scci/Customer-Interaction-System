import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [LoginLayoutComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule
  ]
})
export class LoginModule { }
