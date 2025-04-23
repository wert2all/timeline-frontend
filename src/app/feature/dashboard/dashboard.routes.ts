import { Routes, UrlSegment } from '@angular/router';

const createComponentAction = (action: string, url: UrlSegment[]) => {
  return { consumed: url, posParams: { action: new UrlSegment(action, {}) } };
};
export const routes: Routes = [
  {
    matcher: url =>
      url[0] && url[0].path == 'add-timeline'
        ? createComponentAction('add-timeline', url)
        : null,
    loadComponent: () =>
      import('./dashboard.component').then(d => d.DashboardPageComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then(d => d.DashboardPageComponent),
  },
];
