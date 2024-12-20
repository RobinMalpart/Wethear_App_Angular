import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDetailedCardComponent } from './daily-detailed-card.component';

describe('DailyDetailedCardComponent', () => {
  let component: DailyDetailedCardComponent;
  let fixture: ComponentFixture<DailyDetailedCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDetailedCardComponent]
    });
    fixture = TestBed.createComponent(DailyDetailedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
