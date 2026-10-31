import { 
  Component, 
  OnInit, 
  Input 
} from '@angular/core';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  home,
  leaf,
  barChart,
  settings
} from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss', '../../../styles.css'],
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class BottomNavComponent implements OnInit {
  constructor(private router: Router) {
    addIcons({
      'home': home,
      'leaf': leaf,
      'barChart': barChart,
      'settings': settings
    })
  }
  
  ngOnInit() {}
  
  @Input() activePage: string = 'home';
  navigateTo(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}
