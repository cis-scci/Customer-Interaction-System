import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [MainComponent]
})
export class MainModule { }
