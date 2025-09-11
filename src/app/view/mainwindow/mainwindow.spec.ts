import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mainwindow } from './mainwindow';

describe('Mainwindow', () => {
  let component: Mainwindow;
  let fixture: ComponentFixture<Mainwindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mainwindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mainwindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
