import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDetailComponent } from './dealer-detail.component';

describe('DealerDetailComponent', () => {
  let component: DealerDetailComponent;
  let fixture: ComponentFixture<DealerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
