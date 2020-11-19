import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard.component';
import { LeaderboardComponentRoutingModule } from './leaderboard-routing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [LeaderboardComponent],
  imports: [
    CommonModule,
    LeaderboardComponentRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class LeaderboardModule { }
