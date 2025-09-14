import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardM } from './dashboard.m';

describe('DashboardM', () => {
  let component: DashboardM;
  let fixture: ComponentFixture<DashboardM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardM]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardM);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
