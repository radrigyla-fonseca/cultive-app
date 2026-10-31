import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mood-tracker',
  templateUrl: './mood-tracker.component.html',
  styleUrls: ['./mood-tracker.component.scss', '../../../styles.css'],
  imports: [],
})
export class MoodTrackerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // Nível de CO2 (%)
  @Input() progress: number = 75; 

  readonly radius: number = 60;
  readonly circumference: number = 2 * Math.PI * this.radius;

  get strokeDashoffset(): number {
    const progress = Math.max(0, Math.min(100, this.progress));
    return this.circumference - (progress / 100) * this.circumference;
  }
}
