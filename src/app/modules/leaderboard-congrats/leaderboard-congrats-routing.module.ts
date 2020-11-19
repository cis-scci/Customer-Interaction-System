import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardCongratsComponent } from './leaderboard-congrats.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'demo'
    },
    component: LeaderboardCongratsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardCongratsComponentRoutingModule { }
