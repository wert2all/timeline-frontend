import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () =>
      import('./dashboard.component').then(d => d.DashboardPageComponent),
  },
];
