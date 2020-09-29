import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealersComponent } from './dealers.component';
import { DealersRoutingModule } from './dealers-routing.module';
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
import { MatTabsModule } from '@angular/material/tabs'
import { DealerDetailComponent } from './dealer-detail/dealer-detail.component';
import { ApprovalComponent } from './approval/approval.component';
import { MatButtonModule,MatSelectModule } from '@angular/material';



@NgModule({
  declarations: [DealersComponent, DealerDetailComponent, ApprovalComponent],
  imports: [
    CommonModule,
    DealersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatCheckboxModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class DealersModule { }
