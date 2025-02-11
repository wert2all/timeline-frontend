import { Routes } from '@angular/router';
import { canAuth } from './feature/auth/shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/non-authorized/index/index-page.component').then(
        i => i.IndexPageComponent
      ),
  },
  {
    path: 'legal',
    loadChildren: () =>
      import('./feature/non-authorized/legal/legal.routes').then(l => l.routes),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./feature/non-authorized/user/user.routes').then(u => u.routes),
  },
  {
    path: 'develop',
    loadComponent: () =>
      import('./feature/non-authorized/develop/develop-page.component').then(
        d => d.DevelopPageComponent
      ),
  },
  {
    path: 'my',
    loadComponent: () =>
      import('./feature/authorized/dashboard/dashboard.component').then(
        d => d.MyPageComponent
      ),
    canActivate: [canAuth],
  },
  {
    path: 'timeline/:timelineId',
    loadComponent: () =>
      import('./feature/non-authorized/timeline/timeline-page.component').then(
        t => t.TimelinePageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./feature/non-authorized/404/404-page.component').then(
        p => p.PageNotFoundComponent
      ),
  },
];
