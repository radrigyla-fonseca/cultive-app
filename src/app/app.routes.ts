import { Routes } from '@angular/router';
import { MonitoramentoPage } from './pages/monitoramento/monitoramento';
import { EstufasPage } from './pages/estufas/estufas.page';
// import { RelatoriosPage } from './pages/relatorios/relatorios.page';
// import { RelatorioPage } from './pages/relatorio/relatorio.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'estufas',
    pathMatch: 'full',
  },
  {
    path: 'estufas',
    children: [
      {
        path: '',
        component: EstufasPage,
      },
      {
        path: ':id/monitoramento',
        component: MonitoramentoPage,
      },
    ],
  },
  // {
  //   path: 'relatorios',
  //   children: [
  //     {
  //       path: '',
  //       component: RelatoriosPage,
  //     },
  //     {
  //       path: ':id/visao-geral',
  //       component: RelatorioPage,
  //     }
  //   ],
  // },
  // {
  //   path: 'relatorio',
  //   loadComponent: () => import('./pages/relatorio/relatorio.page').then((m) => m.RelatorioPage),
  // },
];
