import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':timelineId',
    loadComponent: () =>
      import('./page/show/show-timeline-page.component').then(
        t => t.ShowTimelinePageComponent
      ),
  },
];
