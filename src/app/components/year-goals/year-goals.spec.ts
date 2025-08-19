import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearGoals } from './year-goals';

describe('YearGoals', () => {
  let component: YearGoals;
  let fixture: ComponentFixture<YearGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearGoals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearGoals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
