import { Component, OnInit} from '@angular/core';
import { IonProgressBar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular';

@Component({
  selector: 'app-water-tracker',
  templateUrl: './water-tracker.component.html',
  styleUrls: ['./water-tracker.component.scss'],
  imports: [IonProgressBar, IonGrid, IonRow, IonCol],
})
export class WaterTrackerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // Nível de água (%)
  waterLevel: number = 75/100;

}
