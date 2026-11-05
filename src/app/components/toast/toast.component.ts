import { 
  Component,
  OnInit,
  inject
} from '@angular/core';
import { IonToast } from '@ionic/angular';
import { addIcons } from 'ionicons';
/* ================================
  ICONS
================================ */
import {
  checkmarkCircle,
  alert,
  closeCircle,
} from 'ionicons/icons'

import { Toast } from '../../services/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [IonToast],
})
export class ToastComponent implements OnInit {
  constructor() {
    addIcons({
      'checkmark-circle': checkmarkCircle,
      'alert': alert,
      'close-circle': closeCircle,
    })
  }

  ngOnInit() {}

  toastService = inject(Toast);

}
