import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { eventsEffects } from './feature/authorized/dashboard/store/events/events.effects';
import { eventsFeature } from './feature/authorized/dashboard/store/events/events.reducer';
import { previewEffects } from './feature/authorized/dashboard/store/preview/preview.effects';
import { previewFeature } from './feature/authorized/dashboard/store/preview/preview.reducers';
import { timelineEffects } from './feature/authorized/dashboard/store/timeline/timeline.effects';
import { timelineFeature } from './feature/authorized/dashboard/store/timeline/timeline.reducer';
import { timelineEffects as newTimelineEffects } from './feature/timeline/store/timeline.effects';
import { timelineFeature as newTimelineFeature } from './feature/timeline/store/timeline.reducers';
import { maybeAuthGuard } from './libs/maybe-auth.guard';
export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState(newTimelineFeature),
      provideEffects(newTimelineEffects),
    ],
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
    providers: [
      provideState(timelineFeature),
      provideState(eventsFeature),
      provideState(previewFeature),
      provideState(newTimelineFeature),
      provideEffects(
        timelineEffects,
        eventsEffects,
        previewEffects,
        newTimelineEffects
      ),
    ],
    loadComponent: () =>
      import('./feature/authorized/dashboard/my-page.component').then(
        d => d.MyPageComponent
      ),
    canActivate: [maybeAuthGuard],
  },
  {
    path: 'timeline/:timelineId',
    providers: [
      provideState(newTimelineFeature),
      provideEffects(newTimelineEffects),
    ],
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
