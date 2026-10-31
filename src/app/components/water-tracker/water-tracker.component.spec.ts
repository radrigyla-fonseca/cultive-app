import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTrackerComponent } from './water-tracker.component';

describe('WaterTrackerComponent', () => {
  let component: WaterTrackerComponent;
  let fixture: ComponentFixture<WaterTrackerComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
