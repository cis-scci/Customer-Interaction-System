import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './sign-up-routing.module';


@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    SignUpRoutingModule
  ]
})
export class SignUpModule { }
