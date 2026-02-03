import { Routes } from '@angular/router';
import { taskResolver } from './pages/dashboard/task-details/task-details';

export const routes: Routes = [
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () => import('./pages/settings/settings'),
  },
  // order is important, bcz /anything will be treated as :id
  {
    path: '',
    // pathMatch: 'full',// it creates a conflict with child routes because the entire URL must be empty to match.
    title: 'Taks',
    // we can load diffrent component based on user
    // we can inject anything in loadComponent method & implement logic
    loadComponent: () => import('./pages/dashboard/dashboard'),
    children: [
      {
        path: ':id',
        resolve: { task: taskResolver },
        loadComponent: () => import('./pages/dashboard/task-details/task-details'),
      },
    ],
  },
  
];
