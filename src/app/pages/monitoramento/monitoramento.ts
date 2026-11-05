import { Component } from '@angular/core';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon 
} from '@ionic/angular';

/* ================================
  ICONS
================================ */
import { addIcons } from 'ionicons';
import { 
  water,
  pulse,
  thermometer,
  waterOutline,
  sunny,
  cloud,
  home
} from 'ionicons/icons';

/* ================================
  COMPONENTS
================================ */
import { HeaderComponent } from '../../components/header/header.component';
import { MoodTrackerComponent } from '../../components/mood-tracker/mood-tracker.component';
import { WaterTrackerComponent } from '../../components/water-tracker/water-tracker.component';
import { VariableCardComponent } from '../../components/variable-card/variable-card.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-home',
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    HeaderComponent,
    MoodTrackerComponent,
    WaterTrackerComponent,
    VariableCardComponent,
    BottomNavComponent
],
  templateUrl: './monitoramento.html',
  styleUrls: ['./monitoramento.css', '../../../styles.css']
})

export class MonitoramentoPage {
  constructor() {
    addIcons({
      'water': water,
      'pulse': pulse,
      'thermometer': thermometer,
      'water-outline': waterOutline,
      'sunny': sunny,
      'cloud': cloud
    });
  }

  // Nível de CO2
  currentProgress: number = 75;

  // Dados dos sensores para alimentar os cards
  data = [
    {
      title: 'TEMPERATURA',
      icon: 'thermometer', 
      min: 18, 
      max: 25, 
      value: 20, 
      unit: 'ºC', 
      condition: 'IDEAL',
      conditionClass: 'ideal'
    },
    {
      title: 'UMIDADE DO SOLO', 
      icon: 'water-outline',
      min: 65, 
      max: 81, 
      value: 97, 
      unit: '%', 
      condition: 'ACIMA',
      conditionClass: 'no-ideal'
    },
    {
      title: 'LUMINOSIDADE', 
      icon: 'sunny',
      min: 59, 
      max: 84, 
      value: 68, 
      unit: '%', 
      condition: 'IDEAL',
      conditionClass: 'ideal'
    },
    {
      title: 'UMIDADE DO AR', 
      icon: 'cloud',
      min: 23, 
      max: 39, 
      value: 36, 
      unit: '%', 
      condition: 'IDEAL',
      conditionClass: 'ideal'
    },
  ];
}