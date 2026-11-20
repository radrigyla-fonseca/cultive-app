import { 
  Component, 
  OnInit, 
  Input 
} from '@angular/core';
import { 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonIcon,
} from '@ionic/angular';
import { Location } from '@angular/common';

/* ================================
  ICONS
================================ */
import { addIcons } from 'ionicons';
import {
  arrowBack,
} from 'ionicons/icons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  ],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location
  ) {
    addIcons({
      "arrow-back": arrowBack
    })
  }

  goBackPage() {
    this.location.back();
  }

  ngOnInit() {}

  @Input() pageTitle: string = '';
  @Input() logo: boolean = true;
  @Input() goBack: boolean = false;
  
  goToEstufas() {
    this.router.navigate(['estufas'])
  }
}
