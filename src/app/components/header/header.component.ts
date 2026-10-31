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
} from '@ionic/angular';

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
  ],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input() pageTitle: string = 'Início';
}
