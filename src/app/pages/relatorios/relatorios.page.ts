import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexTooltip,
} from "ng-apexcharts";

/* ================================
  ICONS
================================ */
import { addIcons } from 'ionicons';
import {
  calendar,
} from 'ionicons/icons';

/* ================================
  COMPONENTS
================================ */
import { HeaderComponent } from '../../components/header/header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss', '../../../styles.css'],
  imports: [
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CommonModule, 
    FormsModule,
    HeaderComponent,
    BottomNavComponent,
    ChartComponent
  ],
})
export class RelatoriosPage implements OnInit {
  constructor() {
    addIcons({
      'calendar': calendar,
    })
  }

  ngOnInit() {}

  temperatures: number [] = [10, 18, 14, 21, 12, 32, 21, 23, 21, 23, 18, 14, 15, 30];
  days: string [] = [
    '04/10 - 08:00', 
    '04/10 - 17:00', 
    '05/10 - 08:00', 
    '05/10 - 17:00', 
    '06/10 - 08:00',
    '06/10 - 17:00',
    '07/10 - 08:00',
    '07/10 - 17:00',
    '08/10 - 08:00',
    '08/10 - 17:00',
    '09/10 - 08:00',
    '09/10 - 17:00',
    '10/10 - 08:00',
    '10/10 - 17:00',
  ];

  readonly formattedData = this.temperatures.map((temp, i) => {
    const ideal = temp >= 18 && temp <= 25;
    const close = ((temp > 13 && temp < 18) || (temp > 25 && temp <= 30)) && !ideal;
    const noIdeal = temp <= 13 || temp > 30;

    return {
      x: this.days[i],
      y: temp,
      fillColor: ideal ? 'var(--ideal)' : (close ? 'var(--close)' : 'var(--no-ideal)')
    }
  });

  readonly series = signal<ApexAxisChartSeries>([
    { name: "ºC", data: this.formattedData },
  ]);

  readonly chart: ApexChart = { 
    type: "bar", 
    height: 250,
    foreColor: "var(--ion-text-color-step-550)",
  };
  readonly title: ApexTitleSubtitle = { text: "Temperaturas" };
  readonly xaxis: ApexXAxis = {
    categories: this.days,
    labels: {
      rotate: -55, 
    }
  };

  readonly dataLabels: ApexDataLabels = {
    enabled: false
  };

  readonly tooltip: ApexTooltip = {
    theme: 'dark',
  };

  readonly grid = {
    padding: {
      bottom: -26,
      top: 0,
      left: 10,
      right: 10
    }
  };

  readonly responsive = [
    {
      breakpoint: 375,
      options: {
        xaxis: {
          tickAmount: 7,
        }
      }
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          toolbar: {
            show: false
          }
        }
      }
    }
  ]
}
