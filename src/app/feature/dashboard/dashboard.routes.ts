import { Routes, UrlSegment } from '@angular/router';
import { Undefined } from '../../app.types';

const actions = ['add-timeline', 'add-event', 'edit-event'];
const createComponentAction = (
  action: string,
  id: string | Undefined,
  consumed: UrlSegment[]
) => {
  const posParams: Record<string, UrlSegment> = {
    action: new UrlSegment(action, {}),
  };
  if (id) {
    posParams['idParam'] = new UrlSegment(id, {});
  }
  console.log(posParams);
  return { consumed, posParams };
};

export const routes: Routes = [
  {
    matcher: url => {
      if (url[0]) {
        const action = actions.find(action => action == url[0].path);
        const id = url[1] ? url[1].path : null;
        return action ? createComponentAction(action, id, url) : null;
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
