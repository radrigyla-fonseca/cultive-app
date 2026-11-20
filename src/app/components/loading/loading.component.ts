import { 
  Component, 
  Input, 
  OnDestroy, 
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() title = 'Cultivando dados';
  @Input() subtitle = 'Estamos conectando os sensores e preparando sua estufa para você.';
  @Input() footer = 'Precisão que faz crescer';
  @Input() messages: string[] = [
    'Sincronizando sensores',
    'Lendo condições da estufa',
    'Organizando métricas',
    'Quase tudo pronto',
  ];

  currentMessage = this.messages[0] ?? 'Carregando dados';
  private messageTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.currentMessage = this.messages[0] ?? 'Carregando dados';
    if (this.messages.length > 1) {
      let index = 0;
      this.messageTimer = setInterval(() => {
        index = (index + 1) % this.messages.length;
        this.currentMessage = this.messages[index];
      }, 2200);
    }
  }

  ngOnDestroy(): void {
    if (this.messageTimer) clearInterval(this.messageTimer);
  }

}
