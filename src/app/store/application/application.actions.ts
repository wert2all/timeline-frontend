import { createActionGroup, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),
  },
});
