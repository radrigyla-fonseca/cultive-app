import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { ToastComponent } from './components/toast/toast.component';
import { LoadingComponent } from './components/loading/loading.component';
import { Loading } from './services/loading.service';
import { 
  Router, 
  NavigationStart, 
  NavigationEnd,
  NavigationCancel, 
  NavigationError 
} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet, ToastComponent, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  private loadingTimeout: any;

  constructor(
    private loading: Loading,
    private router: Router
  ){

    this.router.events.subscribe(event => {
      // Quando começar a carregar uma navegação mostra a tela de carregamento
      if (event instanceof NavigationStart) {
        this.loading.show();
      }

      // Nos outros casos de navegação - finalizar, cancelar, erro - remove carregamento
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingTimeout = setTimeout(() => {
          this.loading.hide();
        }, 1000);
      }

    })

  }
}