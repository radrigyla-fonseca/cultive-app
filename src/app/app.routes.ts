import { Routes } from '@angular/router';
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
        loadComponent: () => import('./pages/monitoramento/monitoramento')
        .then(m => m.MonitoramentoPage)
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
