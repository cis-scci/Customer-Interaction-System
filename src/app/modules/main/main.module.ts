import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [MainComponent]
})
export class MainModule { }
