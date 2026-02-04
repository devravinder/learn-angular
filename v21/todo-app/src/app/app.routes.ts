import { Routes } from '@angular/router';
import { taskResolver } from './pages/dashboard/task-details/task-details';
import { archiveTasksResolver } from './pages/dashboard/archive/archive';

export const routes: Routes = [
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () => import('./pages/settings/settings'),
  },

  // order is important, bcz /anything will be treated as :id, so keep it last
  {
    path: '',
    // pathMatch: 'full',// it creates a conflict with child routes because the entire URL must be empty to match.
    title: 'Tasks',
    // we can load diffrent component based on user
    // we can inject anything in loadComponent method & implement logic
    loadComponent: () => import('./pages/dashboard/dashboard'),
    children: [
      {
        path: 'archive',
        resolve: { data: archiveTasksResolver },
        loadComponent: () => import('./pages/dashboard/archive/archive'),
      },
      {
        path: ':id',
        resolve: { task: taskResolver },
        loadComponent: () => import('./pages/dashboard/task-details/task-details'),
      },
    ],
  },
];
