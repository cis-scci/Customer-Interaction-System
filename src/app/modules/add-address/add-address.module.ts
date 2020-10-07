import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAddressRoutingModule } from './add-address-routing.module';
import { AddAddressComponent } from './add-address/add-address.component';



@NgModule({
  declarations: [AddAddressComponent],
  imports: [
    CommonModule,
    AddAddressRoutingModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddAddressModule { }
