import { Component, OnInit, Input } from '@angular/core';
import {
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular';

@Component({
  selector: 'app-variable-card',
  templateUrl: './variable-card.component.html',
  styleUrls: ['./variable-card.component.scss', '../../../styles.css'],
  imports: [
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ],
})
export class VariableCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() min: number | string = 0;
  @Input() max: number | string = 0;
  @Input() value: number | string = 0;
  @Input() unit: string = '';
  @Input() condition: string = '';
  @Input() conditionClass: string = '';

}
