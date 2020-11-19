import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardCongratsComponent } from './leaderboard-congrats.component';

describe('LeaderboardCongratsComponent', () => {
  let component: LeaderboardCongratsComponent;
  let fixture: ComponentFixture<LeaderboardCongratsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderboardCongratsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardCongratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
