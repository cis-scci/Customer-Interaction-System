import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealersComponent } from './dealers.component';
import { DealersRoutingModule } from './dealers-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap' ;
import { NgbdSortableHeader } from './sortable.directive';


@NgModule({
  declarations: [DealersComponent,NgbdSortableHeader],
  imports: [
    CommonModule,
    DealersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AccordionModule.forRoot(),
  ]
})
export class DealersModule { }
