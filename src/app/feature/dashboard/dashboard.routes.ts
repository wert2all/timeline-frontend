import { Routes, UrlSegment } from '@angular/router';

const actions = ['add-timeline', 'add-event'];
const createComponentAction = (action: string, url: UrlSegment[]) => {
  return { consumed: url, posParams: { action: new UrlSegment(action, {}) } };
};
export const routes: Routes = [
  {
    matcher: url => {
      if (url[0]) {
        const action = actions.find(action => action == url[0].path);
        return action ? createComponentAction(action, url) : null;
      }
      return null;
    },
    loadComponent: () =>
      import('./dashboard.component').then(d => d.DashboardPageComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then(d => d.DashboardPageComponent),
  },
];
