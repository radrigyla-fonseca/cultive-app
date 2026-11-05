import { addIcons } from 'ionicons';
import { 
  Component, 
  OnInit,
  ViewChild,
  inject,
  NgZone,
  ChangeDetectorRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonIcon,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonChip,
  IonButton,
  IonModal,
  IonInput,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonInputPasswordToggle,
  IonSpinner,
  IonRippleEffect
} from '@ionic/angular';
import { finalize } from 'rxjs';

/* ================================
  ICONS
================================ */
import { 
  star,
  pencil,
  trash,
  list,
  add,
  create,
  bookmark,
  pulse,
  thermometer,
  waterOutline,
  sunny,
  cloud,
  search,
  trendingDown,
  trendingUp,
  addCircleOutline,
  wifi,
  key
} from 'ionicons/icons';

/* ================================
  COMPONENTS
================================ */
import { HeaderComponent } from '../../components/header/header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { Router } from '@angular/router';

/* ================================
  SERVICES
================================ */
import { Toast } from '../../services/toast';
import { EstufaService } from '../../services/estufa';

interface Estufa {
  id: number;
  name: string;
  status: string;
  class: string;
  variables: Variable[];
}

interface Variable {
  id: number;
  name: string;
  icon: string;
  status: string;
  min: number;
  max: number;
}

interface UpdateEstufa {
  name?: string,
  variables?: {
    id: number,
    min?: number,
    max?: number
  }[]
}

@Component({
  selector: 'app-estufas',
  templateUrl: './estufas.page.html',
  styleUrls: ['./estufas.page.scss'],
  imports: [
    IonContent, 
    CommonModule, 
    FormsModule, 
    IonIcon, 
    IonList, 
    IonItem, 
    IonGrid, 
    IonRow, 
    IonCol,
    IonItemSliding, 
    IonItemOptions, 
    IonItemOption, 
    IonLabel,
    IonChip, 
    IonButton,
    IonModal,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonSelect,
    IonSelectOption,
    IonAlert,
    IonInputPasswordToggle,
    IonSpinner,
    IonRippleEffect,
    HeaderComponent, 
    BottomNavComponent
  ],
})

export class EstufasPage implements OnInit {
  constructor(private router: Router) {
    addIcons({
      'star': star,
      'pencil': pencil,
      'trash': trash,
      'list': list,
      'add': add,
      'create': create,
      'bookmark': bookmark,
      'pulse': pulse,
      'thermometer': thermometer,
      'water-outline': waterOutline,
      'sunny': sunny,
      'cloud': cloud,
      'search': search,
      'trending-down': trendingDown,
      'trending-up': trendingUp,
      'add-circle-outline': addCircleOutline,
      'wifi': wifi,
      'key': key,
    });
  }

  ngOnInit() {}

  estufa: Estufa | null = null;
  estufaOriginal: Estufa | null = null;
  showDeleteAlert: boolean = false;
  idEstufaSelected: number | null = null;
  temperatureRange: number[] = Array.from({ length: 26 }, (_, i) => i + 10);
  percentageRange: number[] = Array.from({ length: 101 }, (_, i) => i);
  ssid: string = '';
  password: string = '';
  isConnecting: boolean = false;
  private toast = inject(Toast);
  private estufaService = inject(EstufaService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // Array de estufas adicionadas
  estufas: Estufa[] = [
    {
      id: 1,
      name: 'Estufa do Quarto',
      status: 'Ativa',
      class: 'active',
      variables: [
        {
          id: 1,
          name: 'Temperatura',
          icon: 'thermometer',
          status: 'ideal',
          min: 18,
          max: 25,
        },
        {
          id: 2,
          name: 'Umidade Solo',
          icon: 'water-outline',
          status: 'ideal',
          min: 65,
          max: 81,
        },
        {
          id: 3,
          name: 'Luminosidade',
          icon: 'sunny',
          status: 'no-ideal',
          min: 59,
          max: 84,
        },
        {
          id: 4,
          name: 'Umidade Ar',
          icon: 'cloud',
          status: 'ideal',
          min: 23,
          max: 39,
        }
      ],
    },
    {
      id: 2,
      name: 'Estufa do Banheiro',
      status: 'Desativada',
      class: 'no-active',
      variables: [
        {
          id: 1,
          name: 'Temperatura',
          icon: 'thermometer',
          status: 'ideal',
          min: 18,
          max: 25,
        },
        {
          id: 2,
          name: 'Umidade Solo',
          icon: 'water-outline',
          status: 'ideal',
          min: 65,
          max: 81,
        },
        {
          id: 3,
          name: 'Luminosidade',
          icon: 'sunny',
          status: 'no-ideal',
          min: 59,
          max: 84,
        },
        {
          id: 4,
          name: 'Umidade Ar',
          icon: 'cloud',
          status: 'ideal',
          min: 23,
          max: 39,
        }
      ],
    },
  ];

  @ViewChild('editEstufaModal') editModal!: IonModal;
  @ViewChild('addEstufaModal') addModal!: IonModal;

  closeModal(modal: IonModal) {
    modal.dismiss(null, 'cancel');
  }

  confirmEdit() {

    if (!this.estufa || !this.estufaOriginal) return;

    const changes = this.getModifiedFields();
    // GET ESTUFA
    // Salva apenas se mudou algo
    if(Object.keys(changes).length > 0) {

      this.toast.success('Alterações salvas com sucesso');

      // UPDATE ESTUFA
      // const updateData = this.updateEstufa(editedEstufa);

      // this.estufaService.updateEstufa(
      //   editedEstufa.id,
      //   updateData
      // ).subscribe({
      //   next: () => {
      //     this.estufas[index] = structuredClone(editedEstufa);

      //     this.toast.success('Estufa atualizada com sucesso!');

      //     this.modal.dismiss(editedEstufa, 'confirm');
      //   },
      //   error: () => {
      //     this.toast.danger('Erro ao atualizar estufa!');
      //   }
      // });

      console.log('Dados para atualização:', changes);
    }


    this.editModal.dismiss(this.estufa, 'confirm');

  }

  public delEstufaAlertBtns = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.showDeleteAlert = false;
      }
    },
    {
      text: 'Apagar',
      role: 'confirm',
      handler: () => {
        if (this.idEstufaSelected !== null) {
          this.deleteEstufa(this.idEstufaSelected);
        }
      },
    },
  ];

  // Ir para monitoramento da estufa
  goToMonitoramento(idEstufa: number) {
    this.router.navigate([
      '/estufas',
      idEstufa,
      'monitoramento'
    ])
  }

  editEstufa(estufa: Estufa) {
    // GET ESTUFA
    this.estufaOriginal = structuredClone(estufa);

    // Cria uma cópia do array original
    this.estufa = structuredClone(estufa);
    this.editModal.present();
  }

  getModifiedFields(): UpdateEstufa {
    // Antes de modificar
    const original = this.estufaOriginal!;
    // Modificada
    const edited = this.estufa!;

    const changes: UpdateEstufa = {};

    // Se mudou o nome, adiciona em changes
    if (original.name !== edited.name) {
      changes.name = edited.name;
    }

    for (const variable of edited.variables) {
      // Olha para as variáveis originais e guarda a que tem o id correspondente à atual
      const originalVariable = original.variables.find(
        v => v.id === variable.id
      );

      // Se não houver variável igual, próximo loop
      if (!originalVariable) continue;

      const change: { 
        id: number; 
        min?: number; 
        max?: number 
      } = {
        id: variable.id
      };

      // Se houver mudanças nas variáveis, acrescente no objeto change
      if (originalVariable.min !== variable.min) {
        change.min = variable.min;
      }

      if (originalVariable.max !== variable.max) {
        change.max = variable.max;
      }

      if (change.min !== undefined || change.max !== undefined) {
        changes.variables ??= [];
        changes.variables.push(change);
      }
    }

    return changes;
  }

  deleteEstufa(idEstufa: number) {
    if(!idEstufa) return;

    const id = this.estufaExists(idEstufa);

    // Não encontrou o id da estufa a ser deletada
    if(id === -1) {
      this.toast.danger('Ocorreu um erro: a estufa selecionada não existe');
      return;
    }
  
    this.estufas.splice(id, 1);
    this.toast.success('Estufa deletada com sucesso');
    console.log('Depois:', this.estufas);
  }

  presentDeleteAlert(idEstufa: number) {
    this.idEstufaSelected = idEstufa;
    this.showDeleteAlert = true;
  }

  // Envia nome e senha da rede para o ESP32 se conectar
  addEstufa() {
    if (!this.ssid.trim() || !this.password.trim()) {
      this.toast.danger('Preencha todos os campos');
      return;
    }

    const wifiData = {
      ssid: this.ssid,
      password: this.password
    }

    this.isConnecting = true;

    console.log(wifiData);

    // Conexão com a estufa
    this.estufaService.connectWifi(wifiData)
      .pipe(
        finalize(() => {
          this.isConnecting = false;
          this.zone.run(() => {
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
      next: (res) => {
        console.log('Comunicação efetuada com sucesso', res);
        this.toast.success('Estufa adicionada com sucesso');
        this.closeModal(this.addModal);
        this.ssid = '';
        this.password = '';
      },
      error: (error) => {
        console.log('Erro na comunicação:', error);
        this.toast.danger('Ocorreu um erro na comunicação com a estufa');
      }
    })
    
  }

  estufaExists(idEstufa: number): number {
    const id = this.estufas.findIndex(
      // Checa se o id de cada estufa é igual ao id passado
      estufa => estufa.id === idEstufa
    );

    return id;
  }

}
