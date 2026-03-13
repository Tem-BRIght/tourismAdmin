import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'monitor',
    loadComponent: () => import('./monitor/monitor-activity.page').then((m) => m.MonitorActivityPage),
  },
  {
    path: '',
    redirectTo: 'monitor',
    pathMatch: 'full',
  },
];
