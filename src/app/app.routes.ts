import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { EstufasPage } from './pages/estufas/estufas.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'estufas',
    component: EstufasPage,
  },
];
