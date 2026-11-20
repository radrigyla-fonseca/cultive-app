import { 
  Component,
  OnInit,
  Input,
  SimpleChanges
} from '@angular/core';
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
  
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['waterLevel']) {
  //     console.log('WaterTracker recebeu novo valor via @Input():', changes['waterLevel'].currentValue);
  //   }
  // }

  // Nível de água
  @Input() waterLevel!: number;
  
  get waterLevelPercentage(): number {
    if (!this.waterLevel) return 0;
    return this.waterLevel / 100;
  }

}
