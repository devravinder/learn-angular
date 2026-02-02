import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/dashboard/dashboard').then((m) => m.Dashboard);
    },
  },
  {
    path: 'settings',
    loadComponent: () => {
      return import('./pages/settings/settings').then((m) => m.Settings);
    },
  },
];