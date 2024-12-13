import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDaysCardComponent } from './three-days-card.component';

describe('ThreeDaysCardComponent', () => {
  let component: ThreeDaysCardComponent;
  let fixture: ComponentFixture<ThreeDaysCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeDaysCardComponent]
    });
    fixture = TestBed.createComponent(ThreeDaysCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
