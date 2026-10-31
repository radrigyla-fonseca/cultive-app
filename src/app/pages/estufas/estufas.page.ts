import { addIcons } from 'ionicons';
import { 
  Component, 
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonBadge,
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
} from '@ionic/angular';

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
} from 'ionicons/icons';

import { OverlayEventDetail } from '@ionic/core/components';

import { HeaderComponent } from '../../components/header/header.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

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
    IonItemSliding, 
    IonItemOptions, 
    IonItemOption, 
    IonLabel, 
    IonBadge, 
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
    HeaderComponent, 
    BottomNavComponent
  ],
})

export class EstufasPage implements OnInit {
  constructor() {
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
    });
  }

  ngOnInit() {}

  @ViewChild(IonModal) modal!: IonModal;
  name!: string;
  message: string = 'Oulá';

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }
}
