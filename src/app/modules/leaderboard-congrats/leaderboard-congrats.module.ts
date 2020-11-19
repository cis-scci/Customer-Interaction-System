import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardCongratsComponent } from './leaderboard-congrats.component';
import { LeaderboardCongratsComponentRoutingModule } from './leaderboard-congrats-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [LeaderboardCongratsComponent],
  imports: [
    CommonModule,
    LeaderboardCongratsComponentRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class LeaderboardCongratsModule { }
