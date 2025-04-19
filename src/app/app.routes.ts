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
    path: 'about',
    loadComponent: () =>
      import('./feature/non-authorized/about/about.component').then(
        a => a.AboutPageComponent
      ),
  },
  {
    path: 'legal',
    loadChildren: () =>
      import('./feature/non-authorized/legal.routes').then(l => l.routes),
  },
  {
    path: 'press-kit',
    loadComponent: () =>
      import(
        './feature/static-content/share/press-kit/press-kit-page.component'
      ).then(p => p.PressKitPageComponent),
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
    path: 'dashboard',
    loadChildren: () =>
      import('./feature/dashboard/dashboard.routes').then(d => d.routes),
    canActivateChild: [canAuth],
  },
  {
    path: 'timeline',
    loadChildren: () =>
      import('./feature/timeline/timeline.routes').then(r => r.routes),
  },
  {
    path: 'event/:eventId',
    loadComponent: () =>
      import('./feature/events/page/show/show-event-page.component').then(
        t => t.ShowEventPageComponent
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
