import { Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { 
  IonContent,
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon,
  IonChip,
  IonLabel
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
  ellipseOutline,
  checkmarkCircle,
  alertCircle,
  closeCircle,
  arrowDownCircle,
} from 'ionicons/icons';

/* ================================
  COMPONENTS
================================ */
import { HeaderComponent } from '../../components/header/header.component';
import { MoodTrackerComponent } from '../../components/mood-tracker/mood-tracker.component';
import { WaterTrackerComponent } from '../../components/water-tracker/water-tracker.component';
import { VariableCardComponent } from '../../components/variable-card/variable-card.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

/* ================================
  SERVICES
================================ */
import { Toast } from '../../services/toast.service';
import { MonitoramentoService } from './../../services/monitoramento.service';

type MoodStatus = 'great' | 'alert' | 'stressed' | '';

interface MoodResult {
  level: number;
  status: MoodStatus;
  title: string;
  description: string;
  chipText: string;
  icon: string;
}

@Component({
  selector: 'app-monitoramento',
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonChip,
    IonLabel,
    HeaderComponent,
    MoodTrackerComponent,
    WaterTrackerComponent,
    VariableCardComponent,
    BottomNavComponent
],
  templateUrl: './monitoramento.html',
  styleUrls: ['./monitoramento.css', '../../../styles.css']
})

export class MonitoramentoPage implements OnInit {
  constructor(
    private monService: MonitoramentoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toast: Toast
  ) {
    addIcons({
      'water': water,
      'pulse': pulse,
      'thermometer': thermometer,
      'water-outline': waterOutline,
      'sunny': sunny,
      'cloud': cloud,
      'ellipse-outline': ellipseOutline,
      'checkmark-circle': checkmarkCircle,
      'alert-circle': alertCircle,
      'close-circle': closeCircle,
      'arrow-down-circle': arrowDownCircle
    });
  }
  
  idEstufa: string | null = null;
  waterLevel: number = 0;
  // Nível do humor (barra circular de progresso)

  // Estado atual do humor
  moodLevel: number = 0;
  moodStatus: MoodStatus = '';
  moodTitle: string = 'SEM DADOS';
  moodDescription: string = 'Aguardando informações dos sensores.';
  moodChipText: string = 'Humor não rastreado';
  moodIcon: string = 'ellipse-outline';
  
  private createMood(
    status: MoodStatus,
    level: number,
    title: string,
    description: string,
    chipText: string,
    icon: string
  ): MoodResult {

    return {
      status,
      level,
      title,
      description,
      chipText,
      icon
    };
  }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idEstufa = params.get('id');
      if (this.idEstufa) {
        this.loadEstufaData(this.idEstufa);
      }
    });
    
  }
  
  dataArr: any = [] // Array dos dados da estufa
  loadEstufaData(idEstufa: string) {

    // Último registro da estufa com o id informado
    this.monService.getData(idEstufa) 
    .subscribe({
      next: (res) => {
        // Se a requisição foi um sucesso e o dado veio
        if(res && res.success && res.data) {
          const dadosEstufa = res.data;
          this.waterLevel = dadosEstufa.reservatorio;
          this.moodLevel = dadosEstufa.co2;

          // Calcula o nível de humor da planta baseado em fatores
          const mood = this.calcMoodLevel(dadosEstufa.timestamp, dadosEstufa.co2)
          // const mood = this.calcMoodLevel(dadosEstufa.timestamp, 4246)
          this.moodLevel = mood.level;
          this.moodStatus = mood.status;
          this.moodTitle = mood.title;
          this.moodDescription = mood.description;
          this.moodChipText = mood.chipText;
          this.moodIcon = mood.icon;

          this.dataArr = [
            this.createSensorData(
              'TEMPERATURA',
              'thermometer',
              18,
              25,
              dadosEstufa.temperatura,
              'ºC'
            ),
            this.createSensorData(
              'UMIDADE DO SOLO',
              'water-outline',
              65,
              81,
              dadosEstufa.um_solo,
              '%'
            ),
            this.createSensorData(
              'LUMINOSIDADE',
              'sunny',
              59,
              84,
              dadosEstufa.lum,
              '%'
            ),
            this.createSensorData(
              'UMIDADE DO AR',
              'cloud',
              23,
              39,
              dadosEstufa.um_ar,
              '%'
            )
          ];
          
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.toast.danger('Erro ao tentar carregar dados da estufa');
        throw new Error('[monitoramento.ts] Erro ao tentar acessar o último registro da estufa', err)
      }
    })
  }

  createSensorData(
    title: string,
    icon: string,
    min: number,
    max: number,
    value: number,
    unit: string
  ) {
    const condition = this.getCondition(value, min, max);

    return {
      title,
      icon,
      min,
      max,
      value,
      unit,
      condition,
      conditionClass: condition === 'IDEAL' ? 'ideal' : 'no-ideal'
    };
  }

  // Interpolação: retorna a porcentagem correspondente ao nível de CO2 em um estado
  private interpolate(
    co2: number,
    co2Min: number,
    co2Max: number,
    faixaMin: number,
    faixaMax: number
  ): number {

    // Porcentagem do intervalo (ex.: 0.5 está na metade daquele intervalo)
    const porcInterval = (co2 - co2Min) / (co2Max - co2Min);
    // Intervalo (ex.: saudável - 66,67% até 100%)
    const deltaFaixa = (faixaMax - faixaMin);
    // Valor que representa a porcentagem dentro de uma faixa (saudável, em alerta, ...)
    const percentage = faixaMin + porcInterval * deltaFaixa;

    return percentage;
  }

  // Retorna se está ideal, acima ou abaixo da faixa para aquela variável
  getCondition(v: number, min: number, max: number): string {

    if(v >= min && v <= max) {
      return 'IDEAL'
    } 
    if(v < min) {
      return 'ABAIXO'
    }
    if(v > max) {
      return 'ACIMA'
    }
    return '';
  }

  calcMoodLevel(timestamp: any, co2: number): MoodResult {

    if(
      timestamp === '' ||
      timestamp === null ||
      co2 === null ||
      co2 === undefined ||
      !Number.isFinite(Number(co2)) ||
      co2 <= 0
    ) {
      return this.createMood(
        '',
        0,
        'SEM DADOS',
        'Leitura inválida de CO2',
        'Humor não rastreado',
        'ellipse-outline'
      )
    }
    const hour = timestamp.hour;
    const minute = timestamp.minute;
    // Período diurno: 05:00 até 17:30
    const day = (
      hour >= 5 && (
        hour < 17 || (
          hour === 17 &&
          minute <= 30
        )
      )
    );
    
    // const day = true
    // Período noturno: 17:31 até 04:59
    const night = !day;

    // Limites de CO2 para dia e noite
    const limits = day ? {
      health: {
        min: 320,
        max: 450
      },
      alert: {
        min: 450,
        max: 630
      },
      stressed: {
        min: 630,
        max: 5000
      }
    } : {
      health: {
        min: 480,
        max: 730
      },
      alert: {
        min: 730,
        max: 1230
      },
      stressed: {
        min: 1230,
        max: 5000
      }
    }
    
    // Divisão percentual para as faixas de estado
    const faixaPerc = {
      health: {
        min: 100 * (2/3),
        max: 100,
      },
      alert: {
        min: 100 * (1/3),
        max: 100 * (2/3),
      },
      stressed: {
        min: 0,
        max: 100 * (1/3),
      },
      above: 0
    };

    /* =====================
      SAUDÁVEL
    ===================== */
    if(
      co2 >= limits.health.min && 
      co2 <= limits.health.max
    ) {

      return this.createMood(
        'great',
        this.interpolate(
          co2, 
          limits.health.min, 
          limits.health.max, 
          faixaPerc.health.max,
          faixaPerc.health.min
        ),
        'SAUDÁVEL',
        'A concentração de CO₂ está dentro do esperado para uma planta saudável',
        'CO₂ normal',
        'checkmark-circle'
      );
    }
    /* =====================
      ALERTA
    ===================== */
    if(
      co2 > limits.health.min && 
      co2 <= limits.alert.max
    ) {

      return this.createMood(
        'alert',
        this.interpolate(
          co2, 
          limits.alert.max, 
          limits.alert.min, 
          faixaPerc.alert.min, 
          faixaPerc.alert.max
        ),
        'EM ALERTA',
        'A concentração de CO₂ está levemente acima da faixa ideal.',
        'CO₂ levemente acima',
        'alert-circle'
      );
    }
    /* =====================
      ESTRESSE
    ===================== */
    if(co2 >= limits.stressed.min) {

      return this.createMood(
        'stressed',
        this.interpolate(
          co2, 
          limits.stressed.max, 
          limits.stressed.min, 
          faixaPerc.stressed.min, 
          faixaPerc.stressed.max
        ),
        'ESTRESSADA',
        'Liberação de gás por estresse térmico ou renovação de ar insuficiente',
        'Excesso de CO₂',
        'close-circle'
      )
    }
    /* =====================
      ABAIXO DO ESPERADO
    ===================== */
    if(co2 < limits.health.min) {
      
      return this.createMood(
        '',
        0,
        'ABAIXO DO ESPERADO',
        'O CO₂ apresenta nível inferior aos limites esperados',
        'CO₂ abaixo do limite',
        'arrow-down-circle'
      )
    }

    // Caso não caia em nenhuma das condições
    return this.createMood(
      '',
      0,
      'SEM DADOS',
      'Não foi possível classificar as condições atuais.',
      'Sem classificação',
      'ellipse-outline'
    );
  }
}