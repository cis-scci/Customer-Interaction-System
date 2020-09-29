import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { FusionChartsModule } from 'angular-fusioncharts';
@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FusionChartsModule
  ],
  declarations: [MainComponent]
})
export class MainModule { }
